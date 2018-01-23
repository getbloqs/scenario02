import { Component, Prop } from '@stencil/core';
import { Config } from '../../services/config';
import { SubdomainRegistryImpl } from '../../services/subdomain-registry';

@Component({
    tag: 'subdomain-registrations'
})
export class SubdomainRegistrations {

    @Prop() registrations:any[] = []; 

    render() {      
        if (this.registrations && this.registrations.length > 0) {
            return (
                <div class="row">
                    <div class="col-12">
                        <h2>Last registrations</h2>

                        <table class="table table-hover">
                            <thead>
                                <tr>                                
                                    <th scope="col">Registration</th>
                                    <th scope="col">Registered until</th>
                                    <th scope="col">Owner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.registrations.map((registration) => 
                                <tr>
                                    <td><a href={registration.redirect}>{registration.name}</a></td>
                                    <td>{(new Date(registration.registeredUntil)).toLocaleDateString()}</td>
                                    <td><a href={'https://ropsten.etherscan.io/address/' + registration.owner}>{registration.owner}</a></td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                </div>
            );
        } else {
            return (<div></div>);
        }
    }

}