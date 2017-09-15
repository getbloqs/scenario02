var SubdomainRedirect = artifacts.require("./SubdomainRedirect.sol");

module.exports = function(deployer) {
  deployer.deploy(SubdomainRedirect);
};
