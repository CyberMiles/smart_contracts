pragma solidity ^0.4.17;

contract HelloWorld {
        bytes32 helloMessage;
        address public owner;

constructor () public {
        helloMessage = 'Hello, World!';
        owner = msg.sender;
}
function updateMessage (bytes32 _new_msg) public {
        helloMessage = _new_msg;
}
function sayHello () public constant returns (bytes32){
        return helloMessage;
}
function kill() public {
        if (msg.sender == owner) selfdestruct(owner);
}

}

