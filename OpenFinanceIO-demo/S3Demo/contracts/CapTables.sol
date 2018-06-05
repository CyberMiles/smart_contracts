pragma solidity ^0.4.18;

import "./IndexConsumer.sol";
import "./zeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title CapTables
 * @dev The sole purpose of this contract is to store the cap tables of securities
 * created by the OFN system.  We take the position that a security is defined
 * by its cap table and not by its transfer rules.  So a security is
 * represented by a unique integer index.  A security has a fixed amount and we
 * preserve this invariant by allowing no other cap table updates beside
 * transfers.
 */
contract CapTables is IndexConsumer {
  using SafeMath for uint256;

  /** Address of security */
  mapping(uint256 => address) public addresses;

  /** `capTable(security, user) == userBalance` */
  mapping(uint256 => mapping(address => uint256)) public capTable;

  /** Total token supplies */
  mapping(uint256 => uint256) public totalSupply;

  /** @dev retrieve the balance at a given address */
  function balanceOf(uint256 security, address user) public view returns (uint256) {
    return capTable[security][user];
  }

  /** @dev Add a security to the contract. */
  function initialize(uint256 supply) public returns (uint256) {
    uint256 index = nextIndex();
    addresses[index] = msg.sender;
    capTable[index][msg.sender] = supply;
    totalSupply[index] = supply;
    return index;
  }

  /** @dev Migrate a security to a new address, if its transfer restriction rules change. */
  function migrate(uint256 security, address newAddress) public {
    require(msg.sender == addresses[security]);
    addresses[security] = newAddress;
  }

  /** @dev Transfer an amount of security. */
  function transfer(uint256 security, address src, address dest, uint256 amount) public {
    require(msg.sender == addresses[security]);
    require(capTable[security][src] >= amount);
    capTable[security][src].sub(amount);
    capTable[security][dest].add(amount);
  }
}
