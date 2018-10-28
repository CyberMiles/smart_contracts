pragma solidity ^0.4.0;

contract CRC20 {
    function symbol() public view returns (string);
    function owner() public view returns (address);
}

contract CRC20NS {

    struct Entry {
        address contractAddr;
        string desc;
        uint256 exitPrice;
        bool initialized;
    }
    
    mapping(string => Entry) entries;
    mapping(string => bool) forbiddenSymbols;

    address public owner;
    constructor () public {
        owner = msg.sender;
        forbiddenSymbols["CMT"] = true;
        forbiddenSymbols["BTC"] = true;
        forbiddenSymbols["ETH"] = true;
        forbiddenSymbols["SEX"] = true;
        forbiddenSymbols["FUCK"] = true;
    }
    modifier onlyOwner() {
        assert(msg.sender == owner);
        _;
    }

    function register (address _contractAddr, string _desc, uint256 _exitPrice) public payable returns (bool) {
        CRC20 crc = CRC20(_contractAddr);
        string memory symbol = crc.symbol();
        require (bytes(symbol).length >= 2);
        require (forbiddenSymbols[symbol] != true);
        require (msg.sender == crc.owner());

        uint256 payment = msg.value;
        uint256 fee = 1000000000000000000; // 1 CMT
        if (bytes(symbol).length <= 2) {
            fee = 1000000000000000000000; // 1000 CMT
        } else if (bytes(symbol).length <= 3) {
            fee = 100000000000000000000; // 100 CMT
        } else if (bytes(symbol).length <= 4) {
            fee = 10000000000000000000; // 10 CMT
        }

        Entry memory entry = entries[symbol];
        if (entry.initialized) {
            require (payment >= entry.exitPrice + fee);
            // pay the previous owner exit price
            CRC20(entry.contractAddr).owner().transfer(entry.exitPrice);
            payment = payment - entry.exitPrice;
        }

        require (payment >= fee);
        Entry memory newEntry = Entry(_contractAddr, _desc, _exitPrice, true);
        entries[symbol] = newEntry;
        return true;
    }

    function updateRegistration (address _contractAddr, string _desc, uint256 _exitPrice) public returns (bool) {
        CRC20 crc = CRC20(_contractAddr);
        string memory symbol = crc.symbol();
        require (msg.sender == crc.owner());

        Entry storage entry = entries[symbol];
        require (entry.contractAddr == _contractAddr);

        entry.desc = _desc;
        entry.exitPrice = _exitPrice;
        return true;
    }

    function lookup (string _symbol) public view returns (address, string, uint256) {
        Entry memory entry = entries[_symbol];
        return (entry.contractAddr, entry.desc, entry.exitPrice);
    }

    function isRegistered (string _symbol, address _contractAddr) public view returns (bool) {
        Entry memory entry = entries[_symbol];
        return (entry.contractAddr == _contractAddr);
    }

    function getBalance () external onlyOwner view returns (uint256) {
        return address(this).balance;
    }
    
    function withdraw (uint256 _amount) external onlyOwner returns (bool) {
        require (address(this).balance >= _amount);
        owner.transfer(_amount);
    }

    function terminate() external onlyOwner {
        selfdestruct(owner);
    }
}
