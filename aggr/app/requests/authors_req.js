const host = 'http://127.0.0.1:3001';
const request = require('request');
const serviceAuth = require('./service_auth');

const authorsServiceAuth = new serviceAuth('aggr', 'aggrSec', host);

function _getAuthorById (id, callback){
    const url = host+'/authors/' + id;
		
	console.log('GET ' + url);
		
	request.get(url, {method: 'GET', uri: url}, function(errors, response, body){
		if(errors) {
			console.log('err: ' + errors);
			if (errors.code == 'ECONNREFUSED')
				return callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			
			callback(errors, null, null);
		} else {
			console.log('res: ' + body);
			callback(null, response.statusCode, body);
		}
	}).auth(null, null, true, authorsServiceAuth.getToken());
}


	
function _getAuthors (page, size, callback) {
    const url = host+'/authors?page=' + page + '&size=' + size;
		
	console.log('GET ' + url);
		
	request.get(url, {method: 'GET', uri: url}, function(errors, response, body){
		if(errors) {
		console.log('err: ' + errors);
			if (errors.code == 'ECONNREFUSED')
				return callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			
			callback(errors, null, null);
		} else {
			console.log('res: ' + body);
			callback(null, response.statusCode, body);
		}
	}).auth(null, null, true, authorsServiceAuth.getToken());
}

module.exports = {
    
	
	getAuthorById : function(id, callback){ 
        _getAuthorById(id, function(errors, responseCode, body){
			if (responseCode == 401) {
				authorsServiceAuth.refreshToken(function () {
					_getAuthorById(id, function(errors, responseCode, body) {
						callback(errors, responseCode, body);
					});
				});
				
			} else {
				callback(errors, responseCode, body);
			}
		});
    },
	
	getAuthors : function (page, size, callback) {
        _getAuthors(page, size, function(errors, responseCode, body){
			if (responseCode == 401) {
				authorsServiceAuth.refreshToken(function () { 
					_getAuthors(page, size, function(errors, responseCode, body) {
						callback(errors, responseCode, body);
					});
				});
			} else {
				callback(errors, responseCode, body);
			}
		});
    },
}