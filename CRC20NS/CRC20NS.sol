pragma lity ^1.2.4;

contract CRC20 {
    function symbol() public view returns (string);
    function owner() public view returns (address);
}

contract CRC20NS {

    struct Entry {
        address contractAddr;
        string desc;
        safeuint exitPrice;
        bool initialized;
    }
    
    mapping(string => Entry) entries;
    mapping(string => bool) forbiddenSymbols;
    mapping(uint => safeuint) fees;

    address public owner;
    constructor () public {
        owner = msg.sender;
        forbiddenSymbols["CMT"] = true;
        forbiddenSymbols["BTC"] = true;
        forbiddenSymbols["ETH"] = true;
        forbiddenSymbols["SEX"] = true;
        forbiddenSymbols["FUCK"] = true;

        fees[0] = 1000000000000000000; // 1 CMT This is the default
        fees[1] = 1; // 1 wei to signal that this is not allowed
        fees[2] = 1000000000000000000000; // 1000 CMT
        fees[3] = 100000000000000000000;  // 100 CMT
        fees[4] = 10000000000000000000;   // 10 CMT
    }
    modifier onlyOwner() {
        assert(msg.sender == owner);
        _;
    }

    function register (address _contractAddr, string _desc, safeuint _exitPrice) public payable returns (bool) {
        CRC20 crc = CRC20(_contractAddr);
        string memory symbol = crc.symbol();
        require (bytes(symbol).length >= 2);
        require (forbiddenSymbols[symbol] != true);
        require (msg.sender == crc.owner());

        safeuint payment = msg.value;
        safeuint fee = fees[bytes(symbol).length];
        require (fee > 1); // exit if the fee is 1 wei
        if (fee == 0) {
            fee = fees[0];
        }

        Entry memory entry = entries[symbol];
        if (entry.initialized) {
            require (payment >= entry.exitPrice + fee);
            // pay the previous owner exit price
            CRC20(entry.contractAddr).owner().transfer(uint256(entry.exitPrice));
            payment = payment - entry.exitPrice;
        }

        require (payment >= fee);
        Entry memory newEntry = Entry(_contractAddr, _desc, _exitPrice, true);
        entries[symbol] = newEntry;
        return true;
    }

    function updateRegistration (address _contractAddr, string _desc, safeuint _exitPrice) public returns (bool) {
        CRC20 crc = CRC20(_contractAddr);
        string memory symbol = crc.symbol();
        require (msg.sender == crc.owner());

        Entry storage entry = entries[symbol];
        require (entry.contractAddr == _contractAddr);

        entry.desc = _desc;
        entry.exitPrice = _exitPrice;
        return true;
    }

    function forceRemove (string _symbol) external onlyOwner returns (bool) {
        Entry memory entry = entries[_symbol];
        require (entry.initialized);
        delete entries[_symbol];
        return true;
    }

    function lookup (string _symbol) public view returns (address, string, safeuint) {
        Entry memory entry = entries[_symbol];
        return (entry.contractAddr, entry.desc, entry.exitPrice);
    }

    function isRegistered (string _symbol, address _contractAddr) public view returns (bool) {
        Entry memory entry = entries[_symbol];
        return (entry.contractAddr == _contractAddr);
    }

    function updateFee (uint _symbol_length, safeuint fee) external onlyOwner returns (bool) {
        fees[_symbol_length] = fee;
        return true;
    }

    function findFee (uint _symbol_length) public view returns (safeuint) {
        return fees[_symbol_length];
    }

    function getBalance () external onlyOwner view returns (safeuint) {
        return address(this).balance;
    }
    
    function withdraw (safeuint _amount) external onlyOwner returns (bool) {
        require (address(this).balance >= _amount);
        owner.transfer(uint256(_amount));
    }

    function terminate() external onlyOwner {
        selfdestruct(owner);
    }
}
