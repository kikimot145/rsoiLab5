const host = 'http://127.0.0.1:3003'
const request = require('request');

module.exports = {
	getBookById : function(args, callback){
		const bookId = args.bookId;
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
	
	isAlive : function(args, callback){
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
	
    getBooks : function(args, callback){
		const page = args.page;
		const size = args.size;
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
	
	getBooksByAuthor : function(args, callback){
        const authorId = args.authorId;
		const page = args.page;
		const size = args.size;
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
	
	decreaseBookCount : function(args, callback){
        const id = args.id;
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
	
	increaseBookCount : function(args, callback){
        const id = args.id;
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