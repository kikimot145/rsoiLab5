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

function _getOauthCode (client_id, authInfo, callback){
    const url = host+'/oauth_code?client_id='+client_id;
		
	console.log('POST ' + url);
		
	request.post(url, {method: 'POST', uri: url, json: true, body: {authHeader: authInfo}}, function(errors, response, body){
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

function _getOauthToken (reqBody, callback){
    const url = host+'/oauth_token';
		
	console.log('POST ' + url);
		
	request.post(url, {method: 'POST', uri: url, json: true, body: reqBody}, function(errors, response, body){
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
    },
	
	getOauthCode : function(client_id, authInfo, callback){ 
        _getOauthCode (client_id, authInfo, function(errors, responseCode, body){
			if (responseCode == 401) {
				authServiceAuth.refreshToken(function () {
					_getOauthCode (client_id, authInfo, function(errors, responseCode, body) {
						callback(errors, responseCode, body);
					});
				});
				
			} else {
				callback(errors, responseCode, body);
			}
		});
    },
	
	getOauthToken : function(reqBody, callback){ 
        _getOauthToken (reqBody, function(errors, responseCode, body){
			if (responseCode == 401) {
				authServiceAuth.refreshToken(function () {
					_getOauthToken (reqBody, function(errors, responseCode, body) {
						callback(errors, responseCode, body);
					});
				});
				
			} else {
				callback(errors, responseCode, body);
			}
		});
    }
}