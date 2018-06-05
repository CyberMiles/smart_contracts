pragma solidity ^0.4.18;

import './RegS.sol';
import './RegSToken.sol';
import './RestrictedTokenLogic.sol';
import './zeppelin-solidity/contracts/ownership/Ownable.sol';

///
/// @title A token that tracks data relevant for Reg S status;
contract ARegSToken is RegSToken, RestrictedTokenLogic, Ownable {


  ///
  /// Total number of shareholders
  uint16 public shareholderCount = 0;


  function ARegSToken(
    address issuer, 
    address restrictor_, 
    address capTables_,
    uint256 index_
  )
    public
  {
    totalSupply_ = ICapTables(capTables_).totalSupply(index_);
    restrictor = restrictor_;
    owner = issuer;

    capTables = capTables_;
    index = index_;
  }

  ///
  /// Officially issue the security
  function issue() public onlyOwner {
    RegS(restrictor).startTrading();
  }

  ///
  /// Migrate by changing the owner of the security id in CapTables to the new address
  function migrate(address newRules) public onlyOwner {
    ICapTables(capTables).migrate(index, newRules);
  }

  /// After 12 months a RegS security may be converted to a Reg D security if
  //it meets the requirements, so we track the number of shareholders.
  function shareholderCountAfter(address _from, address _to, uint256 _value)
    public
    view
    returns (uint16)
  {
    bool newShareholder = balanceOf(_to) == 0;
    bool loseShareholder = balanceOf(_from) == _value;

    if (newShareholder && !loseShareholder)
      return shareholderCount + 1;

    if (!newShareholder && loseShareholder)
      return shareholderCount - 1;

    return shareholderCount;
  }

  /// Manage shareholder count after transfer
  function transfer(address _to, uint256 _value) public returns (bool) {

    uint16 newCount = shareholderCountAfter(msg.sender, _to, _value);

    super.transfer(_to, _value);

    if (shareholderCount != newCount)
      shareholderCount = newCount;

    return true;

  }

  ///
  /// Manage shareholder count after delegated transfer
  function transferFrom(address _from, address _to, uint256 _value)
    public
    returns (bool)
  {

    uint16 newCount = shareholderCountAfter(_from, _to, _value);

    super.transferFrom(_from, _to, _value);

    if (shareholderCount != newCount)
      shareholderCount = newCount;

    return true;

  }

}
