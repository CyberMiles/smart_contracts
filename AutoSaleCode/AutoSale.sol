pragma solidity ^0.4.24;

contract AutoSale {
	uint256 public price;
	string private titleId;
	string public make;
	string public model;
	uint public year;
	string public color;
	address public seller;
	address public buyer;

	function AutoSale() public {
		seller = msg.sender;
		year = 2007;
		make = "Toyota";
		model = "FJ Cruiser";
		color = "Blue";
		titleId = "titleExample01";
		price = 9000000000000000000; //set the price to 9 ether
	}

	function buyCar() payable public {
		require(seller != 0x0); //ensure there is a valid seller
		require(buyer == 0x0); //ensure there was no previous buyer
		require(msg.sender != seller); //ensure that the buyer is not the seller
		require(msg.value == price); //ensure that the amount offered is correct
		buyer = msg.sender;	//set the buyer to the caller of the function buyCar
		seller.transfer(msg.value); //transfer funds from the buyer to the seller
	}
}