declare var web3;
declare var Web3;

export class SubdomainRegistryImpl {

    protected account:string;
    protected web3:any;
    protected subdomainRegistry:any;

    public registrations:number;
    
    static init(account:string, abiSubdomainRegistry:any) : any {
        let instance = new SubdomainRegistryImpl();

        if (typeof web3 !== 'undefined') {
            instance.web3 = new Web3(web3.currentProvider);
        } else {
            return false;
        }

        instance.subdomainRegistry = instance.web3.eth.contract(abiSubdomainRegistry).at(account);

        instance.subdomainRegistry.registrations.call((err, res) => {
            if (!err) {
                instance.registrations = res;
            }
        });

        return instance;
    }

    getRegistrationCount() : Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.subdomainRegistry.registrations.call((err, res) => {
                if (!err) {
                    resolve(res.toNumber());
                } else {
                    reject();
                }
            });
        });
    }

    renewRegistration(name:string) : Promise<void> {
        return new Promise<void> ((resolve, reject) => {
            this.getRegistrationFee()
                .then(fee => {                               
                    this.subdomainRegistry.renewRegistration(name, {
                        value : this.web3.toWei(fee, 'ether')
                    }, (err, res) => {                        
                        if (!err) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
        });
    }

    updateRegistration(name:string, redirect:string) : Promise<void> {
        return new Promise<void> ((resolve, reject) => {
            this.subdomainRegistry.updateRegistration(name, redirect, (err, res) => {                        
                if (!err) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    createRegistration(name:string, redirect:string) : Promise<void> {
        return new Promise<void> ((resolve, reject) => {
            this.getRegistrationFee()
                .then(fee => {                               
                    this.subdomainRegistry.createRegistration(name, redirect, {
                        value : this.web3.toWei(fee, 'ether')
                    }, (err, res) => {                        
                        if (!err) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
        });
    }
    
    getRegistrationFee() : Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.subdomainRegistry.registrationFee.call((err, res) => {
                if (!err) {
                    resolve(this.web3.toDecimal(this.web3.fromWei(res, 'ether')));
                } else {
                    reject();
                }
            });           
        });
    }

    getRegistration(index:number) : Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.subdomainRegistry.getRegistrationByIndex(index, (err, res) => {
                if (!err) {
                    resolve({
                        name            : res[0] ,
                        redirect        : res[1] ,
                        registeredUntil : (res[2].toNumber() * 1000) ,
                        owner           : res[3]
                    });
                } else {
                    reject(err);
                }
            });
        });
    }

    getRegistrations(lastIndex:number) : Promise<Array<any>> {
        return new Promise<Array<any>>((resolve, reject) => {
            let start = (lastIndex - 4) > 0 ? (lastIndex - 4) : 0;
            let promises = [];

            for (let i = start; i <= lastIndex; i++) {
                promises.push(this.getRegistration(i));
            }

            Promise.all(promises).then((results) => {
                resolve(results);
            });
        });
    }

}