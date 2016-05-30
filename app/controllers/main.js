/* jshint node: true */

import Ember from 'ember';
const {clipboard} = require('electron');


export default Ember.Controller.extend({
    db: Ember.inject.service('db'),
    cp_content: [],
    active_id: 0,
    cur_contents: '',
    history_length: 10,
    poll_frequency: 1000,
    init: function(){
	var text = clipboard.readText();

	if(this.cur_contents !== ''){
	    this.push_history(text);
	}

	
	var db = this.get('db');
        var control = this;
        var promise = db.new_server_copy();
	promise.then(function(text){
	    clipboard.writeText(text);
	    control.push_history(text);
	}, function(){
	    console.log("Failed");
	});
	
	this.update_clipboard.bind(this)();
    },
    push_history : function(text){
	if(this.cp_content.length >= this.history_length){
	    this.cp_content.splice(0, 1);
	}
	
	this.cp_content.pushObject({type: 'Text', content: text, active: true});
	Ember.set(this.cp_content[this.active_id], "active", false);
	this.active_id = this.cp_content.length - 1;
	this.cur_contents = text;
    },
    update_clipboard : function(){
	var text = clipboard.readText();

	if(text !== this.cur_contents){
	    this.push_history(text);
	    var db = this.get('db');
	    db.new_client_copy(text);
	}
	
	setTimeout(this.update_clipboard.bind(this), this.poll_frequency);
    },
    actions: {}
});
