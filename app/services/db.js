import Ember from 'ember';

/*
Add these fucntions to debug:
// this.socket.on('auth resp', this.on_auth_resp);
// this.socket.on('new server copy', this.on_new_server_copy);
*/

export default Ember.Service.extend({
    availableIn: 'controllers',
    socketIOService: Ember.inject.service('socket-io'),
    serverurl: 'https://www.copyeverythingapp.com',
    socket: false,
    
    authenticate(username, password){
	var cont = this;
	var promise = new Ember.RSVP.Promise(function(resolve){
	    function temp_handler(resp){
		resolve(resp);
		// note this doesn't appear to work, it is technically a memory leak because it doesn't
		// properly delete socketio properly, in the full version of socketio (`once` would
		// be appropriate to use here)
		cont.socket.off('auth resp', temp_handler); 
	    }
	    cont.socket.on('auth resp', temp_handler);
	    cont.socket.emit('auth', {
		username: username, 
		password: password
	    });
	});
	
	return promise;
    },
    on_connect(){
    },
    new_server_copy(){
	var cont = this;
	var promise = new Ember.RSVP.Promise(function(resolve){
	    function temp_handler(resp){
		resolve(resp);
		// note this doesn't appear to work, it is technically a memory leak because it doesn't
		// properly delete socketio properly, in the full version of socketio (`once` would
		// be appropriate to use here)
		cont.socket.off('new server copy', temp_handler); 
	    }
	    cont.socket.on('new server copy', temp_handler);
	});
	
	return promise;
    },
    new_client_copy(text){
	this.socket.emit('new client copy', text);
    },
    disconnected(){
	// console.log("disconnected");
    },
    init(){
	if(!this.socket){
            this.set('socket', this.get('socketIOService').socketFor(this.serverurl));
            this.socket.on('connect', this.on_connect);
            this.socket.on('disconnect', this.disconnected);
	}
    },
    destroy() {
	if(this.socket){
            this.socket.off('connect', this.on_connect);
            this.socket.off('disconnect', this.disconnected);
	}
    }
});
