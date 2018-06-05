pragma solidity ^0.4.18;

import './TransferRestrictor.sol';

/// @title An implementation of restrictions under regulation S Category 3
contract RegS is TransferRestrictor {
  function startTrading() public;
  function registerAmlKycChecker(address _checker, address _token) public;
  function registerAccreditationChecker(address _checker, address _token) public;
}

