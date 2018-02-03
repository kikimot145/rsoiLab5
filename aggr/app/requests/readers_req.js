const host = 'http://127.0.0.1:3002';
const request = require('request');
		
module.exports = {
    getReaderById : function(args, callback) {
		const id = args.id;
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
    },
	
	addBookToReader : function (args, callback) {
		const readerId = args.readerId;
		const bookId = args.bookId;
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
	},
	
	removeBookFromReader : function (args, callback) {
		const readerId = args.readerId;
		const bookId = args.bookId;
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
}