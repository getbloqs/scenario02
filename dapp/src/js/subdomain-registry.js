if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

if (contract) {
    contract = web3.eth.contract(contract.abi).at('0x4e13fd01d2ce1561c14cb80285d19779f2b950f7');
}

subdomainRegistry = {

    getRegistrationFee : function() {
        return new Promise(function(resolve, reject) {
            contract.registrationFee.call(function (err, res) {
                if (!err) {
                    resolve( web3.toDecimal(web3.fromWei(res, 'ether')) );
                } else {
                    reject();
                }
            });
        });
    },

    createRegistration : function(name, redirect) {
        return new Promise(function(resolve, reject) {
            subdomainRegistry.getRegistrationFee()
                .then(function (fee) {
                    contract.createRegistration(
                        name,
                        redirect,
                        { value: web3.toWei(fee, 'ether') },
                        function(err, res) {                            
                            if (!err) {
                                resolve(res);
                            } else {
                                reject(err);
                            }
                        }
                    );
                });            
        });
    },

    registrationCount : function() {
        return new Promise(function(resolve, reject) {
            contract.registrations.call(function (err, res) {
                if (!err) {
                    resolve( web3.toDecimal(res) );
                } else {
                    reject();
                }
            });
        });
    },

    getRegistration : function(index) {
        return new Promise(function(resolve, reject) {
            contract.getRegistration(index, function(err, res) {
                if (!err) {
                    resolve(res);
                } else {
                    reject(err);
                }
            });
        });
    }

};