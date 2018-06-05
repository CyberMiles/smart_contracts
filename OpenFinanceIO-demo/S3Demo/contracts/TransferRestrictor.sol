pragma solidity ^0.4.10;


///
/// @title An interface for restricting ERC20 token transfers
interface TransferRestrictor {
  /**
   * @return error code, with 0 being success and non-zero codes depending on the rule set
   */
  function test(address from, address to, uint256 amount, address token) external returns (uint16);
}
