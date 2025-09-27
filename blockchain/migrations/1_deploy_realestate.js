const RealEstate = artifacts.require("RealEstate");

module.exports = async function (deployer, network, accounts) {
  const notaryAddress = accounts[0]; // Deuxième compte comme notaire
  await deployer.deploy(RealEstate, notaryAddress);
  console.log(" RealEstate déployé !");
};