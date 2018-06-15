module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration
	networks: {
		testnet: {
		host: "localhost",
		port: 8545,
		network_id: 3,
		from: "0xfc60d1d90b112c2e4fa629ac484d40a0c8194e5f",
		gas: 1000000,
      	gasPrice: 10000000000
		}
	}
};