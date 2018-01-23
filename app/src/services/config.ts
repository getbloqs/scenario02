export class Config {

    static getConfig() : Promise<any> {
        return new Promise((resolve, reject) => {
            fetch('contract.config.json')
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    }
                }).then(response => {
                    resolve(response);
                }); 
        });        
    }

    static getAbi(filename:string) : Promise<any> {
        return new Promise((resolve, reject) => {
            fetch('contracts/' + filename + '.json')
                .then((response) => {                    
                    if (response.ok) {
                        return response.json();
                    }
                }).then(response => {                    
                    resolve(response.abi);
                }); 
        });
    }

}