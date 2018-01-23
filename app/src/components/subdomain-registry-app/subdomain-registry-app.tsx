import { Component, State } from '@stencil/core';
import { Config } from '../../services/config';
import { SubdomainRegistryImpl } from '../../services/subdomain-registry';

@Component({
    tag: 'subdomain-registry-app' ,
    styleUrl : 'subdomain-registry-app.scss'
})
export class SubdomainRegistryApp {

    @State() countRegistrations:number = 0;
    @State() registrations:any = [];
    @State() noWeb3 = true;

    componentWillLoad() {
        Promise.all([
            Config.getConfig() ,
            Config.getAbi('SubdomainRedirect')
        ]).then( (response:any[]) => {
            let result = SubdomainRegistryImpl.init(response[0].contract, response[1]);

            if (result == false) {
                this.noWeb3 = true;
            } else {
                this.noWeb3 = false;
                window['subdomainRegistry'] = SubdomainRegistryImpl.init(response[0].contract, response[1]);
                this.load();
            }            
        });           
    }

    load() {
        window['subdomainRegistry'].getRegistrationCount().then(res => {
            this.countRegistrations = res;
            return window['subdomainRegistry'].getRegistrations(res - 1);
        }).then(registrations => {
            this.registrations = registrations;
        });
    }

    render() {
        if (this.noWeb3) {
            return (<div class="container"><div class="alert alert-danger">There is no Web3 Provider available in your browser. Please checkout <a href="https://metamask.io/">MetaMask</a></div></div>);
        } else {
            return (
                <div class="container">
                    
                    <div class="jumbotron">
                        <h1 class="display-4">Subdomain registry</h1>
                        
                        <p>This is a demo for registering subdomains and provide a link for redirection. Currently, there are <b>{this.countRegistrations}</b> subdomains registered.</p>

                        <subdomain-registry-form></subdomain-registry-form><subdomain-renew-form></subdomain-renew-form><subdomain-update-form></subdomain-update-form>    
                        
                    </div>
    
                    <subdomain-registrations registrations={this.registrations}></subdomain-registrations>
    
                </div>
            );
        }

        
    }

}