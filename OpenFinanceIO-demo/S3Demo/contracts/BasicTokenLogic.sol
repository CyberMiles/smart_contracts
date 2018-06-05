// Variation on `BasicToken.sol` from Open Zeppelin
pragma solidity ^0.4.18;

import "./interfaces/ICapTables.sol";
import "./zeppelin-solidity/contracts/token/ERC20/ERC20Basic.sol";
import "./zeppelin-solidity/contracts/math/SafeMath.sol";


/**
 * @title Basic token (logic only)
 * @dev Basic version of StandardToken, with no allowances.
 */
contract BasicTokenLogic is ERC20Basic {
  using SafeMath for uint256;

  address capTables;

  /**
  * @Dev Index of this security in the global cap table store.
  */
  uint256 index;

  uint256 totalSupply_;

  /**
  * @dev total number of tokens in existence
  */
  function totalSupply() public view returns (uint256) {
    return totalSupply_;
  }

  /**
  * @dev transfer token for a specified address
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balanceOf(msg.sender));

    ICapTables(capTables).transfer(index, msg.sender, _to, _value);
    emit Transfer(msg.sender, _to, _value);
    return true;
  }

  /**
  * @dev Gets the balance of the specified address.
  * @param _owner The address to query the the balance of.
  * @return An uint256 representing the amount owned by the passed address.
  */
  function balanceOf(address _owner) public view returns (uint256 balance) {
    return ICapTables(capTables).balanceOf(index, _owner);
  }

}
