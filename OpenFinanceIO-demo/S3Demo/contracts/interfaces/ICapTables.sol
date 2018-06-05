pragma solidity ^0.4.18;

interface ICapTables {
  function balanceOf(uint256 token, address user) external view returns (uint256);
  function initialize(uint256 supply) external returns (uint256);
  function migrate(uint256 security, address newAddress) external;
  function totalSupply(uint256 security) external view returns (uint256);
  function transfer(uint256 security, address src, address dest, uint256 amount) external;
}
