import { Component, State } from '@stencil/core';

@Component({
    tag: 'subdomain-renew-form' ,
    styleUrl : 'subdomain-renew-form.scss'
})
export class SubdomainRenewForm {

    @State() open:boolean = false;
    @State() error:boolean = false;
    @State() name:string = '';

    close() {
        this.open = false;
        this.name = '';
        this.error = false;
    }

    save() {
        window['subdomainRegistry'].renewRegistration(this.name).then(() => {                        
            this.close();
        }).catch(() => {
            this.error = true;
        });        
    }

    handleNameChange(event) {
        this.name = event.target.value;
    }

    render() {
        return (
            <span>
                <button onClick={() => { this.open = true; }} class="btn btn-primary">Renew Registration</button>
                
                <div class="modal fade show" style={{display:(this.open ? 'block' : 'none')}} id="registry-form" tabindex="-1" role="dialog" aria-labelledby="registry-form-label" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="registry-form-label">Renew subdomain registration</h5>
                                <button onClick={ () => this.close() } type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">

                                {this.error
                                    ? <div class="alert alert-danger" role="alert">This name doesn't exist or you are not the owner of the subdomain.</div>
                                    : ""
                                }
                              
                                <form>
                                    <div class="form-group">
                                        <label>Subdomain name</label>
                                        <input value={this.name} onInput={() => this.handleNameChange(event)} type="text" class="form-control" placeholder="Subdomain name" />
                                    </div>                                                                  
                                </form>

                            </div>
                            <div class="modal-footer">
                                <button onClick={ () => this.save() } type="button" class="btn btn-primary">Renew</button>
                                <button onClick={ () => this.close() } type="button" class="btn btn-secondary">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                {this.open
                    ? <div class="modal-backdrop fade show"></div>
                    : ""
                }              

            </span>
        );
    }

}