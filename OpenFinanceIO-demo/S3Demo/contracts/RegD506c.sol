pragma solidity ^0.4.10;


import './TransferRestrictor.sol';


///
/// @title Functions that tokens will need to call to configure themselves 
contract RegD506c is TransferRestrictor {
  function startHoldingPeriod() public;
  function registerAmlKycChecker(address _checker, address _token) public;
  function registerAccreditationChecker(address _checker, address _token) public;
}
