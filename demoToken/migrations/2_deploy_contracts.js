var ericoin = artifacts.require("./ericoin.sol");

module.exports = function(deployer) {
  deployer.deploy(ericoin, 69);
};
