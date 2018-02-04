const host = 'http://127.0.0.1:3001';
const request = require('request');

module.exports = {
    getAuthorById : function(id, callback){
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
		});
    },
	
	getAuthors : function (page, size, callback) {
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
		});
	}
}