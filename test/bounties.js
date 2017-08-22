const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
const Bounties = artifacts.require("./Bounties.sol");

contract('Bounties', function(accounts) {
    
        it('standard bounty progress', function() {
            let issueLink    = 'https://github.com/getbitpocket/bitpocket-mobile-app/issues/19';
            let solutionLink = 'https://github.com/getbitpocket/bitpocket-mobile-app/some-pull-request';
            let bounties, initialAccountBalance;           

            return Promise.all([
                Bounties.new() ,
                web3.eth.getBalance(accounts[4])
            ]).then((results) => {
                bounties = results[0];
                initialAccountBalance = results[1];
                // add bounties for an issue
                return Promise.all([
                    bounties.addBounty(issueLink, { from:accounts[1] , value:1000 }) ,
                    bounties.addBounty(issueLink, { from:accounts[2] , value:2000 }) ,
                    bounties.addBounty(issueLink, { from:accounts[3] , value:3000 })
                ]);
            }).then(() => {
                // add solution as claim
                return bounties.claimBounty(issueLink, solutionLink, { from:accounts[4] });
            }).then(() => {
                // add support for claim
                return Promise.all([
                    bounties.supportClaim(issueLink, solutionLink, { from:accounts[1]}) ,
                    bounties.supportClaim(issueLink, solutionLink, { from:accounts[2]})
                ]);
            }).then(() => {
                // clear bounty by claimant
                return bounties.clearBounty(issueLink, { from:accounts[4] });
            }).then(() => {
                return Promise.all([
                    bounties.getBountyInfo(issueLink) ,
                    web3.eth.getBalance(accounts[4])
                ]);
            }).then(results => {                
                let start = (initialAccountBalance + '').substr(-5);
                let end   = (results[1] + '').substr(-5);
                
                assert.equal(results[0][2], accounts[4]);
                assert.equal(end - start, 6000); // the balance should be 6000 higher
            });
        });
    
    });
