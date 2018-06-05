pragma solidity ^0.4.18;

/** 
 * @title IndexConsumer
 * @dev This contract adds an autoincrementing index to contracts. 
 */
contract IndexConsumer {
  /** The index */
  uint256 private freshIndex = 0;
  /** Fetch the next index */
  function nextIndex() internal returns (uint256) {
    uint256 theIndex = freshIndex;
    freshIndex = freshIndex + 1;
    return theIndex;
  }
}
