pragma solidity ^0.4.10;


import './RegD506c.sol';
import './RegD506cToken.sol';
import './UserChecker.sol';
import './zeppelin-solidity/contracts/ownership/Ownable.sol';


///
/// @title Implementation of RegD506c
contract TheRegD506c is RegD506c, Ownable {

  ///
  /// Table of AML-KYC checking contracts
  mapping(address => address) amlkycChecker;

  ///
  /// Table of accredited investor status checking contracts
  mapping(address => address) accreditationChecker;

  ///
  /// Issuance dates for securities restricted by this contract
  mapping(address => uint256) issuanceDate;

  ///
  /// Amount of time investors must hold the token before trading
  uint256 holdingPeriod;

  /// 
  /// Error codes
  enum ErrorCode {
    Ok,
    HoldingPeriod,
    ShareholderMaximum,
    BuyerAMLKYC,
    SellerAMLKYC,
    Accreditation
  }

  ///
  /// At deployment time the holding period can be set
  function TheRegD506c(uint256 holdingPeriod_) Ownable() public {
    holdingPeriod = holdingPeriod_;
  }


  ///
  /// Register a contract to confirm AML-KYC status
  function registerAmlKycChecker(address _checker, address _token)
    public
  {
    require(Ownable(_token).owner() == msg.sender);
    amlkycChecker[_token] = _checker;
  }

  ///
  /// Register a contract to confirm accreditation status
  function registerAccreditationChecker(address _checker, address _token)
    public
  {
    require(Ownable(_token).owner() == msg.sender);
    accreditationChecker[_token] = _checker;
  }

  ///
  /// Set the start date for the holding period 
  function startHoldingPeriod() public {
    if (issuanceDate[msg.sender] == 0)
      issuanceDate[msg.sender] = now;
  }

  ///
  /// Test whether or not a token transfer is compliant
  function test(address _from, address _to, uint256 _value, address _token) 
    external 
    returns (uint16) 
  {

    // The security cannot be transfered until after its holding period 
    if (issuanceDate[_token] != 0 && now < issuanceDate[_token] + holdingPeriod)
      return uint16(ErrorCode.HoldingPeriod);

    // Shareholder limits
    // 99 if the security is raising money for a fund and 2000 otherwise
    uint16 newShareholderCount = RegD506cToken(_token).shareholderCountAfter(_from, _to, _value);
    if ((RegD506cToken(_token).isFund() && newShareholderCount > 99) 
      || newShareholderCount > 2000)
      return uint16(ErrorCode.ShareholderMaximum);

    // The seller must pass AMLKYC 
    if (!amlkyc(_from, _token))
      return uint16(ErrorCode.SellerAMLKYC);
    
    // The buyer must pass AMLKYC
    if (!amlkyc(_to, _token))
      return uint16(ErrorCode.BuyerAMLKYC);

    // The buyer must be an accredited investor 
    if (!accreditation(_to, _token))
      return uint16(ErrorCode.Accreditation);

    // All checks passed
    return uint16(ErrorCode.Ok);

  }

  /// 
  /// Confirm AML-KYC status with the registered checker
  function amlkyc(address _user, address _token) 
    internal
    returns (bool) 
  {
    return UserChecker(amlkycChecker[_token]).confirm(_user);
  }

  ///
  /// Confirm accredited investor status with the associated checker
  function accreditation(address _user, address _token)
    internal
    returns (bool)
  {
    return UserChecker(accreditationChecker[_token]).confirm(_user);
  }

}
