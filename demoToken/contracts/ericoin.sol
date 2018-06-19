pragma solidity ^0.4.24;

contract ericoin {
    string  public name = "eriCoin";
    string  public symbol = "ECT";
    string  public standard = "eriCoin v1.0";
    uint8   public decimals = 18; // same value as wei
    uint256 public totalSupply;

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    function ericoin (uint256 _initialSupply) public {
        balances[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function totalSupply() public constant returns (uint256) {
        return totalSupply;
    }

    function balanceOf(address acct) public returns (uint256 balance) {
        return balances[acct];
    }

    function allowance(address _tokenOwner, address _spender) public constant returns (uint remaining) {
        return allowance[_tokenOwner][_spender];
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balances[msg.sender] >= _value);

        balances[msg.sender] -= _value;
        balances[_to] += _value;

        Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;

        Approval(msg.sender, _spender, _value);

        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balances[_from]);
        require(_value <= allowance[_from][msg.sender]);

        balances[_from] -= _value;
        balances[_to] += _value;
        allowance[_from][msg.sender] -= _value;

        Transfer(_from, _to, _value);

        return true;
    }
}