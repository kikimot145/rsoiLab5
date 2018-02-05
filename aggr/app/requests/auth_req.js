const host = 'http://127.0.0.1:3004';
const request = require('request');
const serviceAuth = require('./service_auth');

const authServiceAuth = new serviceAuth('aggr', 'aggrSec', host);

function _checkCredentials (readerCredentials, callback){
    const url = host+'/readers_accounts';
		
	console.log('POST ' + url);
		
	request.post(url, {method: 'POST', uri: url, json: true, body: {authHeader: readerCredentials}}, function(errors, response, body){
		if(errors) {
			console.log('err: ' + errors);
			if (errors.code == 'ECONNREFUSED')
				return callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			
			callback(errors, null, null);
		} else {
			console.log('res: ' + body);
			callback(null, response.statusCode, body);
		}
	}).auth(null, null, true, authServiceAuth.getToken());
}

module.exports = {
	
	checkCredentials : function(readerCredentials, callback){ 
        _checkCredentials (readerCredentials, function(errors, responseCode, body){
			if (responseCode == 401) {
				authServiceAuth.refreshToken(function () {
					_checkCredentials (readerCredentials, function(errors, responseCode, body) {
						callback(errors, responseCode, body);
					});
				});
				
			} else {
				callback(errors, responseCode, body);
			}
		});
    }
}