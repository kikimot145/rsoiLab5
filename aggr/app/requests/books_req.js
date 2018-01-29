const host = 'http://127.0.0.1:3003'
const request = require('request');

module.exports = {
	getBookById : function(bookId, callback){
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
		});
    },
	
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
	
    getBooks : function(page, size, callback){
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
		});
    },
	
	getBooksByAuthor : function(authorId, page, size, callback){
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
		});
    },
	
	decreaseBookCount : function(id, callback){
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
		});
    },
	
	increaseBookCount : function(id, callback){
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
		});
    }
}