const host = 'http://127.0.0.1:3002';
const request = require('request');
const serviceAuth = require('./service_auth');

const readersServiceAuth = new serviceAuth('aggr', 'aggrSec', host);

function _getReaderById(id, callback) {
	const url = host+'/readers/' + id;
	
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
	});
}
	
function _addBookToReader(readerId, bookId, callback) {
	const url = host+'/readers/' + readerId + '/books?book=' + bookId;
		
	console.log('PATCH ' + url);
	
	request.patch(url, {method: 'PATCH', uri: url}, function(err, response, body){
		if(err) {
			console.log('err: ' + errors);
			if (errors.code == 'ECONNREFUSED')
				return callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			
			callback(errors, null, null);
		} else {
			console.log('res: ' + body);
			callback(null, response.statusCode, body);
		}
	});
}

function _removeBookFromReader(readerId, bookId, callback) {
	const url = host+'/readers/' + readerId + '/books?book=' + bookId;
	
	console.log('DELETE ' + url);

	request.delete(url, {method: 'DELETE', uri: url}, function(err, response, body){
		if(err) {
			console.log('err: ' + errors);
			if (errors.code == 'ECONNREFUSED')
				return callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			
			callback(errors, null, null);
		} else {
			console.log('res: ' + body);
			callback(null, response.statusCode, body);
		}
	});
}

module.exports = {
    getReaderById : function(id, callback) {
		_getReaderById(id, function(errors, responseCode, body){
			if (responseCode == 401) {
				readersServiceAuth.refreshToken(function () {
					_getReaderById(id, function(errors, responseCode, body) {
						callback(errors, responseCode, body);
					});
				});
				
			} else {
				callback(errors, responseCode, body);
			}
		});
    },
	
	addBookToReader : function (readerId, bookId, callback) {
		_addBookToReader(readerId, bookId, function(errors, responseCode, body){
			if (responseCode == 401) {
				readersServiceAuth.refreshToken(function () {
					_addBookToReader(readerId, bookId, function(errors, responseCode, body) {
						callback(errors, responseCode, body);
					});
				});
				
			} else {
				callback(errors, responseCode, body);
			}
		});
	},
	
	removeBookFromReader : function (readerId, bookId, callback) {
		_removeBookFromReader(readerId, bookId, function(errors, responseCode, body){
			if (responseCode == 401) {
				readersServiceAuth.refreshToken(function () {
					_removeBookFromReader(readerId, bookId, function(errors, responseCode, body) {
						callback(errors, responseCode, body);
					});
				});
				
			} else {
				callback(errors, responseCode, body);
			}
		});
	}
}