pragma solidity ^0.5.0;

contract SimpleStorage {
  event ValueChanged(address indexed author, string oldValue, string newValue);

  string _value;

  constructor(string memory value) public {
    emit ValueChanged(msg.sender, _value, value);
    _value = value;
  }

  function getValue() public view returns(string memory) {
    return _value;
  }

  function setValue(string memory value) public {
    emit ValueChanged(msg.sender, _value, value);
    _value = value;
  }
}
