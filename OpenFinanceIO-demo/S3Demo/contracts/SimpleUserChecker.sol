pragma solidity ^0.4.10;


import './UserChecker.sol';
import './zeppelin-solidity/contracts/ownership/Ownable.sol';


contract SimpleUserChecker is UserChecker, Ownable {

  mapping(address => bool) public checkers; 
  mapping(address => mapping(address => bytes32)) public commitments;
  mapping(address => bool) public confirmations;

  ///
  /// Confirm a user
  function confirm(address _user) 
    external
    returns (bool)
  {
    return confirmations[_user];
  }

  ///
  /// Add a checker
  function addChecker(address _checker)
    public
    onlyOwner
  {
    checkers[_checker] = true;
  }

  ///
  /// Remove a checker
  function removeChecker(address _checker)
    public
    onlyOwner
  {
    checkers[_checker] = false;
  }

  ///
  /// Confirm entity and attach a commitment to their information
  function confirmUser(address _user, bytes32 _commitment)
    public
  {
    require(checkers[msg.sender]);
    commitments[msg.sender][_user] = _commitment;
    confirmations[_user] = true;
  }

}
