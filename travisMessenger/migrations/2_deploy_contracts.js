var EtherChat = artifacts.require("./EtherChat.sol");

module.exports = function(deployer) {
  deployer.deploy(EtherChat);
};
