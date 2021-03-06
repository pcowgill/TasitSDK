import "ethers/dist/shims.js";
// Note: ethers SHOULD be imported from their main object
// shims aren't injected with package import
import { ethers } from "ethers";

class Utils {
  static isAddress = address => {
    return typeof address === "string" && address.match(/^0x[0-9A-Fa-f]{40}$/);
  };

  static isABI = abi => {
    return abi && Array.isArray(abi);
  };

  // https://github.com/ethers-io/ethers.js/blob/db383a3121bb8cf5c80c5488e853101d8c1df353/src.ts/utils/properties.ts#L20
  static isEthersJsSigner = signer => {
    return signer && signer._ethersType === "Signer";
  };
}

class Subscription {
  #txPromise;
  #provider;

  constructor(txPromise, provider) {
    this.#txPromise = txPromise;
    this.#provider = provider;
  }

  on = async (trigger, callback) => {
    if (trigger !== "confirmation") {
      throw new Error(`Invalid subscription trigger, use: ["confirmation"]`);
    }

    if (!callback || typeof callback !== "function") {
      throw new Error(`Cannot subscribe without a function`);
    }

    const blockHeight = 1;
    const tx = await this.#txPromise;

    this.#provider.on(tx.hash, async receipt => {
      const { confirmations } = receipt;
      const message = {
        data: {
          confirmations: confirmations,
        },
      };

      try {
        await callback(message);
      } catch (error) {
        throw new Error(`Callback function with error: ${error.message}`);
      }
    });
  };

  removeAllListeners = async () => {
    const tx = await this.#txPromise;
    this.#provider.removeAllListeners(tx.hash);
  };
}

class EventSubscription {
  #eventNames;
  #provider;

  constructor(eventNames, provider) {
    this.#eventNames = eventNames;
    this.#provider = provider;
  }

  on = (eventName, callback) => {
    if (!this.#eventNames.includes(eventName))
      throw new Error(
        `This subscription isn't subscribed on '${eventName}' event.`
      );
  };

  //removeAllListeners = async () => {};
}

export class Contract {
  #address;
  #provider;
  #contract;

  constructor(address, abi, wallet) {
    if (!Utils.isAddress(address) || !Utils.isABI(abi))
      throw new Error(`Cannot create a Contract without a address and ABI`);

    this.#provider = this.#getDefaultProvider();

    const signerOrProvider = wallet
      ? wallet.connect(this.#provider)
      : this.#provider;

    this.#contract = new ethers.Contract(address, abi, signerOrProvider);
    this.address = this.#contract.address;
    this.#addFunctionsToContract();
  }

  // Note: For now, `tasit-account` creates a wallet object
  setWallet = wallet => {
    if (!Utils.isEthersJsSigner(wallet))
      throw new Error(`Cannot set a invalid wallet to a Contract`);

    return new Contract(this.address, this.#contract.interface.abi, wallet);
  };

  // For tests purpose
  getProvider = () => {
    return this.#provider;
  };

  subscribe = eventNames => {
    eventNames.forEach(eventName => {
      if (this.#contract.interface.events[eventName] === undefined)
        throw new Error(`Event '${eventName}' not found.`);
    });

    const subscription = new EventSubscription(eventNames, this.#provider);
    return subscription;
  };

  // Notes:
  // - JsonRpcProvider will only be used for testing purpose;
  // - Default provider should be customized (.env file).
  #getDefaultProvider = () => {
    const provider = new ethers.providers.JsonRpcProvider();
    provider.pollingInterval = 50;
    return provider;
  };

  #addFunctionsToContract = () => {
    this.#contract.interface.abi
      .filter(json => {
        return json.type === "function";
      })
      .forEach(f => {
        var isWrite = !f.constant;
        if (isWrite) this.#attachWriteFunction(f);
        else {
          this.#attachReadFunction(f);
        }
      });
  };

  #attachReadFunction = f => {
    this[f.name] = async (...args) => {
      const value = await this.#contract[f.name].apply(null, args);
      return value;
    };
  };

  #attachWriteFunction = f => {
    this[f.name] = (...args) => {
      if (!Utils.isEthersJsSigner(this.#contract.signer))
        throw new Error(`Cannot setting data to Contract without a wallet`);

      const tx = this.#contract[f.name].apply(null, args);
      const subscription = new Subscription(tx, this.#provider);
      return subscription;
    };
  };
}

export const TasitAction = {
  Contract,
};

export default TasitAction;
