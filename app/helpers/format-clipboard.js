import Ember from 'ember';

export function formatClipboard(params) {
    if(params[0].length > 40){
	return (params[0].substr(0, 40) + '...');
    }else{
	return params[0];
    }
}

export default Ember.Helper.helper(formatClipboard);
