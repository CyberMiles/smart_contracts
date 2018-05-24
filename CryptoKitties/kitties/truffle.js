module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration
	networks: {
		testnet: {
		host: "localhost",
		port: 8545,
		network_id: 3,
		from: "0x4ec87ae6c8b1c0b2161c1906a653792d90df048b",
		gas: 400000000,
		gasPrice: 20000000000
		}
	}
};
