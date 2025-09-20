module.exports = {
  networks: {
    development: {
    host: "127.0.0.1",
    port: 8545, // Changé à 8545
    network_id: "*",
    gas: 6721975,
    gasPrice: 20000000000
    }
  },

  mocha: {
    timeout: 100000
  },

  compilers: {
    solc: {
    version: "0.8.19", // Version plus stable
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
        }
      }
    }
  }
};