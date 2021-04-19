const Arbitrable = artifacts.require(
  'https://github.com/kleros/kleros-interaction/blob/master/contracts/standard/permission/ArbitrableTokenList.sol'
  //buscar en kleros-interaction
)

// module.exports = function(deployer) {
//   deployer.deploy(Arbitrable,
//     '0x75e7F993270677b87779e573c5C63aF45D00e876',
//     _arbitratorExtraData, //0
//     _registrationMetaEvidence, //reglas del jurado //hash al pdf
//     _clearingMetaEvidence, //reglas para remocion de cto //hash al pdf
//     _governor, //address nuestro 0xe141125f634199Bf4a6FE3077A6537e535d67f41
//     _requesterBaseDeposit, //0.005
//     _challengerBaseDeposit, // 0.005
//     _challengePeriodDuration, // 36000
//     _sharedStakeMultiplier, // 0
//     _winnerStakeMultiplier, // 0
//     _loserStakeMultiplier // 0
//   )
// }
//0xcb2C23c04653264483373fC74581AD7DF2FD3878 contract address 
//0xF3A84803557DBcDf7260bc45bE7D444fb21aEeA6 account
//0x620ee4f25af7a78b639157405e578e6c419be414aae92a7b83389e44b6a6ab30 tx hash

module.exports = function(deployer) {
  deployer.deploy(Arbitrable,
    '0x75e7F993270677b87779e573c5C63aF45D00e876',
    '0', //0
    '_registrationMetaEvidence', //reglas del jurado //hash al pdf
    '_clearingMetaEvidence', //reglas para remocion de cto //hash al pdf
    '0xe141125f634199Bf4a6FE3077A6537e535d67f41', //address nuestro 0xe141125f634199Bf4a6FE3077A6537e535d67f41
    '100', //0.005
    '100', // 0.005
    '3600', // 36000
    '0', // 0
    '0', // 0
    '0' // 0
  )
}