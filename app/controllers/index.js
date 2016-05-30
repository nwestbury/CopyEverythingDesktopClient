//app/controllers/index.js
import Ember from 'ember';

function test_email(input){
    var email_pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return !email_pattern.test(input);
}

function test_pass(input){
    return input.length < 8;
}

function valid(){
   return !test_email(this.get('username')) && !test_pass(this.get('password'));
}

export default Ember.Controller.extend({
    db: Ember.inject.service('db'),
    is_valid: Ember.computed('username', 'password', valid),
    is_disabled: function(){return this.get('disabled') || !this.get('is_valid');}.property('disabled', 'is_valid'),
    username: '', password: '',
    message: {'type': '', 'text': ''},
    processing: true,
    first_login: true,
    disabled: false,
    loading: false,
    actions: {
	login(){
	    var db = this.get('db');
	    
	    if(this.first_login){
		db.init();
		this.first_login = false;
	    }
	    
            this.set('disabled', true);
            this.set('loading', true);
	    
            var control = this;
            var promise = db.authenticate(this.username, this.password);
	    promise.then(function(value){
		control.set('loading', false);
                if(value[0]){
		    control.replaceRoute('main');
                }else{
		    control.set('message.text', value[1]);
                    control.set('message.type', 'danger');
		    control.set('disabled', false);
	        }
	    }, function(){
		control.set('disabled', false);
		control.set('loading', false);
	        control.set('message.text', "Login Failed!");
                control.set('message.type', 'danger');
	    });
        },  
	email_validation: {
	    'errorMessage': 'Please provide email in a valid format',
	    'isError': test_email
	},
	pass_validation: {
	    'errorMessage': 'The password is over 8 characters long.',
	    'isError': test_pass
	}
    }
});
