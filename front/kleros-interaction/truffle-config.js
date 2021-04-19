const HDWalletProvider = require('@truffle/hdwallet-provider');
const mnemonic = "code strong luxury grant pudding peace very tennis siege autumn allow gun"
const privateKey = "0xF3A84803557DBcDf7260bc45bE7D444fb21aEeA6"

module.exports = {
  compilers: {
    solc: {
      version: "0.4.25",
      settings: {
        optimizer: {
          enabled: true,
          runs: 1500
        }
      }
    
    },
  },
  networks: {
    test: {
      host: 'localhost',
      port: 8545,
      network_id: '*',
      gas: 8000000
    },
    kovan: {
      provider: () => new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/ef2f784e2bd845769dacaa9046eb76c3`),
      network_id: 42,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip dry run before migrations? (default: fals
    }

  }
}
