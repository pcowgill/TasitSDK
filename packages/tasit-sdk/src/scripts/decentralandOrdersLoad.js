// This is script will add lands, estates and sell order to Decentraland marketplace
// Those data is been used to test Decentraland demo app using ganache-cli local blockchain
import { createFromPrivateKey } from "tasit-account/dist/testHelpers/helpers";
import {
  setupWallets,
  setupContracts,
  duration,
  createEstatesFromParcels,
  getEstateSellOrder,
  gasParams,
} from "../testHelpers/helpers";

// It's likely that script won't be necessary after 0.1.0 version of tasit demo app
// Use npx babel-node to run this
(async () => {
  const { owner, seller } = setupWallets();
  const { mana, land, estate, marketplace } = await setupContracts(owner);

  const ONE = 1e18;

  const parcels = [
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0, y: 4 },
    { x: 0, y: 5 },
  ];

  // Note: Often estates have more than one parcel of land in them
  // but here we just have one parcel of land in each to keep this test short
  const estateIds = await createEstatesFromParcels(
    estate,
    land,
    parcels,
    seller
  );

  estate.setWallet(seller);
  const marketplaceApprovalBySeller = estate.setApprovalForAll(
    marketplace.getAddress(),
    true,
    gasParams
  );
  await marketplaceApprovalBySeller.waitForNonceToUpdate();

  marketplace.setWallet(seller);
  for (let assetId of estateIds) {
    const priceInWei = ONE.toString();
    const expireAt = Date.now() + duration.years(1);
    const createOrder = marketplace.createOrder(
      estate.getAddress(),
      assetId,
      priceInWei,
      expireAt,
      gasParams
    );
    await createOrder.waitForNonceToUpdate();
  }

  const orders = [];
  for (let id of estateIds) {
    const order = await getEstateSellOrder(marketplace, estate, id);
    orders.push(order);
  }

  console.log(orders);
})();