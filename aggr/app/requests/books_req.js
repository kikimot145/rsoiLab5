const host = 'http://127.0.0.1:3003'
const request = require('request');
const serviceAuth = require('./service_auth');

const booksServiceAuth = new serviceAuth('aggr', 'aggrSec', host);


function _getBookById(bookId, callback){
	const url = host+'/books/' + bookId;
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
	}).auth(null, null, true, booksServiceAuth.getToken());
}
	
function _getBooks(page, size, callback){
	const url = host+'/books?page=' + page + '&size=' + size;
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
	}).auth(null, null, true, booksServiceAuth.getToken());
}
	
function _getBooksByAuthor(authorId, page, size, callback){
	const url = host+'/books?author=' + authorId + '&page=' + page + '&size=' + size;
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
	}).auth(null, null, true, booksServiceAuth.getToken());
}
	
function _decreaseBookCount(id, callback){
    const url = host+'/books/' + id;
	
	console.log('PATCH ' + url);
	
	request.patch(url, {method: 'PATCH', uri: url}, function(errors, response, body){
		if(errors) {
			console.log('err: ' + errors);
			if (errors.code == 'ECONNREFUSED')
				return callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			
			callback(errors, null, null);
		} else {
			console.log('res: ' + body);
			callback(null, response.statusCode, body);
		}
	}).auth(null, null, true, booksServiceAuth.getToken());
}

function _increaseBookCount(id, callback){
    const url = host+'/books/' + id;
	
	console.log('DELETE ' + url);
	
	request.delete(url, {method: 'DELETE', uri: url}, function(errors, response, body){
		if(errors) {
			console.log('err: ' + errors);
			if (errors.code == 'ECONNREFUSED')
				return callback(errors, 500, '{\"error\": \"Service unavailable\"}' );
			
			callback(errors, null, null);
		} else {
			console.log('res: ' + body);
			callback(null, response.statusCode, body);
		}
	}).auth(null, null, true, booksServiceAuth.getToken());
}
	
module.exports = {
	isAlive : function(callback){
		const url = host+'/status';

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
    },
	
	getBookById : function(bookId, callback){
		_getBookById(bookId, function(errors, responseCode, body){
			if (responseCode == 401) {
				booksServiceAuth.refreshToken(function () {
					_getBookById(bookId, function(errors, responseCode, body) {
						callback(errors, responseCode, body);
					});
				});
				
			} else {
				callback(errors, responseCode, body);
			}
		});
    },
	
    getBooks : function(page, size, callback){
		_getBooks(page, size, function(errors, responseCode, body){
			if (responseCode == 401) {
				booksServiceAuth.refreshToken(function () {
					_getBooks(page, size, function(errors, responseCode, body) {
						callback(errors, responseCode, body);
					});
				});
				
			} else {
				callback(errors, responseCode, body);
			}
		});
    },
	
	getBooksByAuthor : function(authorId, page, size, callback){
        _getBooksByAuthor(authorId, page, size, function(errors, responseCode, body){
			if (responseCode == 401) {
				booksServiceAuth.refreshToken(function () {
					_getBooksByAuthor(authorId, page, size, function(errors, responseCode, body) {
						callback(errors, responseCode, body);
					});
				});
				
			} else {
				callback(errors, responseCode, body);
			}
		});
    },
	
	decreaseBookCount : function(id, callback){
		_decreaseBookCount(id, function(errors, responseCode, body){
			if (responseCode == 401) {
				booksServiceAuth.refreshToken(function () {
					_decreaseBookCount(id, function(errors, responseCode, body) {
						callback(errors, responseCode, body);
					});
				});
				
			} else {
				callback(errors, responseCode, body);
			}
		});
    },
	
	increaseBookCount : function(id, callback){
        _increaseBookCount(id, function(errors, responseCode, body){
			if (responseCode == 401) {
				booksServiceAuth.refreshToken(function () {
					_increaseBookCount(id, function(errors, responseCode, body) {
						callback(errors, responseCode, body);
					});
				});
				
			} else {
				callback(errors, responseCode, body);
			}
		});
    }
}