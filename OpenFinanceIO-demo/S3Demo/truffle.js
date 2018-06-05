module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
	networks: {
		development: {
		host: "localhost",
		port: 8545,
		network_id: "3", // Match any network id
		from: "0x4ec87ae6c8b1c0b2161c1906a653792d90df048b",
		gas: 20000000,
		gasPrice: 2000000000
		}
	},
	mocha: {
   		 reporter: 'eth-gas-reporter',
    		reporterOptions : {
      		currency: 'CHF',
      		gasPrice: 20000000000
    		}
  
	}
};
