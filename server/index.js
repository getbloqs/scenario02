const express = require('express');
const Web3 = require('web3');
const config = require('./contract.config.json');
const subdomainRedirectAbi = require('./contracts/SubdomainRedirect.json').abi;
const infuraApiKey = require('./secret.json').ropsten.infura;

// expressjs
const app = express();

// init contract
const web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/" + infuraApiKey));
const contract = web3.eth.contract(subdomainRedirectAbi).at(config.contract);

const resolveName = (name) => {
    return new Promise((resolve, reject) => {
        contract.getRegistrationByName(name, (err, res) => {
            if (!err) {
                let registeredUntil = res[2].toNumber() * 1000;
                let now = (new Date()).getTime();

                if (now <= registeredUntil) {
                    resolve(res[1]);                    
                } else {
                    reject('expired or unregisterd');
                }               
            } else {
                reject(err);
            }
        });
    });    
};

app.get('/*', (req, res) => {
    var name = '';
    if (req.subdomains.length > 0) {
        name = req.subdomains[0];
    }

    resolveName(name).then((redirect) => {
        res.redirect(redirect);
    }).catch((err) => {
        res.status(404).send(err);
    });
});

app.listen(3000);