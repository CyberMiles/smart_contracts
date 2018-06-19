pragma solidity ^0.4.17;

contract HelloWorld {
        string helloMessage;
        address public owner;

constructor () public {
        helloMessage = "Hello, World!";
        owner = msg.sender;
}
function strConcatHelper(string _a, string _b) public returns (string){
    bytes memory _ba = bytes(_a);
    bytes memory _bb = bytes(_b);
    string memory abcde = new string(_ba.length + _bb.length);
    bytes memory babcde = bytes(abcde);
    uint k = 0;
    for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
    for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
    return string(babcde);
}
function strConcat(string _a, string _b) public returns (string) {
    helloMessage = strConcatHelper(_a, _b);
}
function updateMessage (string _new_msg) public {
        helloMessage = _new_msg;
}
function sayHello () public constant returns (string){
        return helloMessage;
}
function kill() public {
        if (msg.sender == owner) selfdestruct(owner);
}

}

