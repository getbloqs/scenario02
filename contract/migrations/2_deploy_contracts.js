const fs = require('fs');
const SubdomainRedirect = artifacts.require("SubdomainRedirect");

var infura = '';
if (fs.existsSync(__dirname + '/../secret.json')) {
  infura = require(__dirname + '/../secret.json').infura;
}

const deploy = (deployer) => {
    return deployer.deploy(SubdomainRedirect);
};

const updateConfig = (contract, uri) => {
  var pathToDevConfig1 = __dirname + '/../../app/contract.config.json';
  var pathToDevConfig2 = __dirname + '/../../server/contract.config.json';

  var stream1 = fs.createWriteStream(pathToDevConfig1);
  var stream2 = fs.createWriteStream(pathToDevConfig2);

  stream1.write(JSON.stringify({
    'contract' : contract
  }));
  stream1.end();

  stream2.write(JSON.stringify({
    'contract' : contract
  }));
  stream2.end();
}; 

module.exports = function(deployer, network) {  
  deploy(deployer).then(() => {
    return SubdomainRedirect.deployed();
  }).then((instance) => {
    if (network == 'development') {
      updateConfig(instance.address, 'http://127.0.0.1:7545');
    } else if (network == 'ropsten') {
      updateConfig(instance.address, "https://ropsten.infura.io/" + infura);
    }    
  });  
};
