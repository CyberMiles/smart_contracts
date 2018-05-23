
# AutoSale
This example is about deploying a decentralized auto sale smart contract on the blockchain.

**The source code 'AutoSale.sol' is available in the directory.**

This contract has 8 data fields (buyer, seller, price, titleId, make, model, year and color) and 1 main method (buyCar).

buyCar() sets the buyer field to address of the caller of the function and then transfers the funds from the buyer to the seller. 

## Remix IDE

To test the smart contract on the Remix IDE, go to [https://remix.ethereum.org/](https://remix.ethereum.org/). 

First, paste the solidity code for the auto sale over the voting smart contract sample code provided by remix. 

Then, **select the "Compile" tab** on the right hand portion of the window. **Click on the "Start to compile" button** to compile the code. 

After that, **select the "Run" tab** on the right hand portion of the window. Ensure that the environment is **set to "JavaScript VM".**

**Click on the "Deploy" button.** This will deploy the smart contract onto the blockchain. The first default account on the "Accounts" field should now have slightly less than 100 ether. This is because it deployed the contract and had to pay a gas fee to do so. You should now also have some accessor functions for every public variable (blue buttons) and the main function (red button) appear at the bottom right corner of the window. Click on these to call the functions.

To complete a sale, scroll back up to the "Account" field in the "Run" tab. Select any account that is not the first one. In the **"Value" text field, enter in the price for the automobile** (in this case, 9 ether or 9000000000000000000 wei). If you input a value that is not equal to the price of the automobile, the buyCar() function will not run and the sale will not complete. **Click on the red "buyCar" button** on the lower bottom right hand side of the window. The sale should now be complete.

The accounts listed under the "Accounts" button should now have updated balances to reflect the sale. The buyer variable should now also be updated to the address of the account you selected earlier to reflect it as well. To check this, **click on the blue "buyer" button** on the bottom right hand of the screen. 

Take note that the way in which this smart contract is designed, a sale can only be made once. Attempting to call the buyCar() function a second time will not succeed. 

More instructions of how to deploy smart contracts on Travis Testnet, TestRPC and ETH testnet to follow soon.
