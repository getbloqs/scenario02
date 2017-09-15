
Vue.component('registration-form', {
    template : '#registration-form' ,
    props : ['open'] ,
    data: function() { 
        return {
            subdomain : '' ,
            redirect : '' ,
            isInvalidRedirect : false ,
            isInvalidSubdomain : false ,
            success : false ,
            error : false
        }
    } ,    
    computed : {
        styling : function() {
            return {
                display : (this.open ? 'block' : 'none')
            };
        }
    },    
    methods : {
        closeAlert : function() {
            this.success = this.error = false;
        },

        close : function() {
            this.$emit('closed');
        },

        register : function() {
            if (/^[A-Za-z0-9]{1,30}$/.test(this.subdomain)) {
                this.isInvalidSubdomain = false;
            } else {
                this.isInvalidSubdomain = true;
            }

            if (/^https?:\/\/([a-z0-9\-]*\.)+[a-z]{2,}.*$/.test(this.redirect)) {
                this.isInvalidRedirect = false;
            } else {
                this.isInvalidRedirect = true;
            }

            if (!this.isInvalidRedirect && !this.isInvalidSubdomain) {
                var that = this;
                subdomainRegistry.createRegistration(this.subdomain, this.redirect)
                    .then(function() {
                        that.subdomain = that.redirect = '';
                        that.$emit('success');
                    })
                    .catch(function(err) {
                        that.$emit('error');                        
                    });                
            }            
        }
    }
});

var app = new Vue({
    el : '#vue' ,
    data : {
        registrations : [] ,
        open : false ,
        success : false ,
        error : false
    },
    created : function() {
        var that = this;

        subdomainRegistry.registrationCount()
            .then(function (count) {
                var firstIndex = 0;
                var lastIndex = 9;
                
                if (count > 10) {
                    lastIndex = count - 1;
                    firstIndex = count - 10;
                } else {
                    lastIndex = count - 1;
                }

                var items = [];
                for (var i = lastIndex; i >= firstIndex; i--) {
                    
                    subdomainRegistry.getRegistration(i).then(function (res) {
                        
                        items.push({
                            name : res[0] ,
                            link : res[1] ,
                            validUntil : (new Date(res[2].toNumber() * 1000)).toLocaleDateString()
                        });

                        if (items.length == (lastIndex + 1)) {
                            that.registrations = items;
                        }                        
                    });
                }                
                
            });
    },
    methods : {
        openRegistrationForm : function() {
            this.open = true;
        } ,
        closeAlert : function() {
            this.success = this.error = false;
        }
    }

});
