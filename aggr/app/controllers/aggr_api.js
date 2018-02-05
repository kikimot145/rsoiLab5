const express = require('express');
const router = express.Router();
const request = require('request');

const readersReq = require('../requests/readers_req');
const booksReq = require('../requests/books_req');
const authorsReq = require('../requests/authors_req');
const authReq = require('../requests/auth_req');

const valCheck = require('../valid_check');

const amqp = require('amqplib/callback_api');
var ampqConn = null;

const queueCheckInterval = 10000;

var queue = 'bookIds';
function pushQueue(id) {
  amqp.connect('amqp://localhost', function(err, conn){
    conn.createChannel(function(err, ch){

	  console.log('Book: ' + id + ' added to queue [' + queue + ']');
      ch.assertQueue(queue, {durable : false});
      ch.sendToQueue(queue, Buffer.from(id.toString()));
      
	  setTimeout(function() {
		  ch.close(); 
		  conn.close();
	  },500);
	  
    });
  });
}

module.exports = (app) => {
  app.use('/api', router);
};

router.get('/oauth_code', (req, res, next) => {
	let authInfo = req.get('Authorization');
	console.log('san',authInfo);
	if (typeof (authInfo) == 'undefined' || authInfo.split(' ')[0] != 'Basic') {
		return res.status(401).send({error: 'AuthorizationHeaderInvalid'});
	}
	console.log('man');
	authReq.getOauthCode(req.query.client_id, authInfo, function (err, responseCode, body) {
		console.log('tot');
		console.dir(body);
		if (typeof body.error != 'undefined') {
			res.status(200).send({redirect: req.query.redirect_uri+'?error='+body.error});
		} else {
			res.status(200).send({redirect: req.query.redirect_uri+'?code='+body.code});
		}
	});
});

router.post('/oauth_token', (req, res, next) => {
	if (typeof req.body.redirect_uri == 'undefined') return res.status(400).send({error: 'RedirectUriUnspecified'});
	
	authReq.getOauthToken(req.body, function (err, responseCode, body) {
		if (typeof body.error != 'undefined') {
			res.redirect( req.body.redirect_uri+'?error='+body.error);
		} else {
			res.status(200).send(body);
		}
	});
});

router.get('/authors', (req, res, next) => {
	let page = valCheck.checkPositiveInt(req.query.page, 0);
	if (page < 0) return res.status(400).send({error: "Bad page param"});
	
	
	let size = valCheck.checkPositiveInt(req.query.size, 20);
	if (size < 0) return res.status(400).send({error: "Bad size param"});
	
	console.log('***\n\n' + new Date() + ':\nGet all authors');
	
	authorsReq.getAuthors(page, size, function (err, responseCode, body) {
		res.status(responseCode).send(JSON.parse(body));
	});
});

router.get('/authors/:id', (req, res, next) => {
	let id = valCheck.checkPositiveInt(req.params.id, -1);
	if (id < 0) return res.status(400).send({error: "Bad author id"});
	
	console.log('***\n\n' + new Date() + ':\nGet author ' + id);
	
	authorsReq.getAuthorById(id, function (err, responseCode, body) {
		res.status(responseCode).send(JSON.parse(body));
	});
});

router.get('/books', (req, res, next) => {
	let author = valCheck.checkPositiveInt(req.query.author, 0);
	if (author < 0) return res.status(400).send({error: "Bad author id"});
	
	let page = valCheck.checkPositiveInt(req.query.page, 0);
	if (page < 0) return res.status(400).send({error: "Bad page param"});
	
	
	let size = valCheck.checkPositiveInt(req.query.size, 20);
	if (size < 0) return res.status(400).send({error: "Bad size param"});
	
	console.log('***\n\n' + new Date() + ':\nGet all books with author ' + author);
	
	if (author == 0) {
		booksReq.getBooks(page, size, function (err, responseCode, body) {
			if (err)
				res.status(responseCode).send(JSON.parse(body));
			else {
				let books = JSON.parse(body);
				if (books.rows.length == 0) return res.status(responseCode).send(books);
				
				let cnt = 0;
				
				books.rows.forEach( function (item, index) {
					authorsReq.getAuthorById(item.authorId, function (err, responseCode, body) {
						if (!err && responseCode == 200) {
							books.rows[index].author = JSON.parse(body);
							delete books.rows[index].authorId;
						}
						if (++cnt == books.rows.length) return res.status(200).send(books);
					});
				});
			}
		});
	} else {
		booksReq.getBooksByAuthor(author, page, size, function (err, responseCode, body) {
			res.status(responseCode).send(JSON.parse(body));
		});
	}
	
});

router.get('/books/:id', (req, res, next) => {
	let id = valCheck.checkPositiveInt(req.params.id, -1);
	if (id < 0) return res.status(400).send({error: "Bad book id"});
	
	console.log('***\n\n' + new Date() + ':\nGet book ' + id);
	
	booksReq.getBookById(id, function (err, responseCode, body) {
		if (err)
			res.status(responseCode).send(JSON.parse(body));
		else {
			let book = JSON.parse(body);
			authorsReq.getAuthorById(book.authorId, function (err, responseCode, body) {
					if (!err && responseCode == 200) {
						book.author = JSON.parse(body);
						delete book.authorId;
					}
					return res.status(200).send(book);
			});
		}
	});
});


router.get('/readers/:id', (req, res, next) => {
	let id = valCheck.checkPositiveInt(req.params.id, -1);
	if (id < 0) return res.status(400).send({error: "Bad reader id"});
	
	let authInfo = req.get('authorization');
	if (typeof (authInfo) == 'undefined' || authInfo.split(' ')[0] != 'Bearer') {
		return res.status(401).send({error: 'AuthorizationHeaderInvalid'});
	}
	
	authReq.checkCredentials(authInfo, function (err, responseCode, body) {
		if (responseCode != 200) return res.status(responseCode).send(body);
		if (id != body.readerId) return res.status(403).send('IdNotCorrespondingToken');
	
		console.log('***\n\n' + new Date() + ':\nGet reader ' + id);
	
		readersReq.getReaderById(id, function (err, responseCode, body) {
			res.status(responseCode).send(JSON.parse(body));
		});
	});
});

router.patch('/readers/:id/books', (req, res, next) => {
	let id = valCheck.checkPositiveInt(req.params.id, -1);
	if (id < 0) return res.status(400).send({error: "Bad reader id"});
	
	let bookId = valCheck.checkPositiveInt(req.query.book, -1);
	if (id < 0) return res.status(400).send({error: "Bad book id"});
	
	let authInfo = req.get('authorization');
	if (typeof (authInfo) == 'undefined' || authInfo.split(' ')[0] != 'Bearer') {
		return res.status(401).send({error: 'AuthorizationHeaderInvalid'});
	}
	
	authReq.checkCredentials(authInfo, function (err, responseCode, body) {
		if (responseCode != 200) return res.status(responseCode).send(body);
		if (id != body.readerId) return res.status(403).send('IdNotCorrespondingToken');
	
		console.log('***\n\n' + new Date() + ':\nAdd book' + bookId + ' for reader ' + id);
	
		booksReq.decreaseBookCount(bookId, function (err, responseCode, body) {
			if (err || responseCode != 200 || JSON.parse(body).result != 1)
				res.status(responseCode).send(JSON.parse(body));
			else {
				readersReq.addBookToReader(id, bookId, function (err, responseCode, body) {
					if (err || responseCode != 200 || JSON.parse(body).result != 1) {
						booksReq.increaseBookCount(bookId, function (err, responseCode, body) {});
					}
					
					res.status(responseCode).send(JSON.parse(body));
				});
			}
		});
	});
});

router.delete('/readers/:id/books', (req, res, next) => {
	let id = valCheck.checkPositiveInt(req.params.id, -1);
	if (id < 0) return res.status(400).send({error: "Bad reader id"});
	
	let bookId = valCheck.checkPositiveInt(req.query.book, -1);
	if (id < 0) return res.status(400).send({error: "Bad book id"});
	
	let authInfo = req.get('authorization');
	if (typeof (authInfo) == 'undefined' || authInfo.split(' ')[0] != 'Bearer') {
		return res.status(401).send({error: 'AuthorizationHeaderInvalid'});
	}
	
	authReq.checkCredentials(authInfo, function (err, responseCode, body) {
		if (responseCode != 200) return res.status(responseCode).send(body);
		if (id != body.readerId) return res.status(403).send('IdNotCorrespondingToken');
	
		console.log('***\n\n' + new Date() + ':\nRemove book' + bookId + ' for reader ' + id);
	
		readersReq.removeBookFromReader(id, bookId, function (err, responseCode, body) {
			if (err || responseCode != 200 || JSON.parse(body).result != 1)
				res.status(responseCode).send(JSON.parse(body));
			else {
				booksReq.increaseBookCount(bookId, function (err, responseCode, body) {
					if (err || responseCode == 500) {
						pushQueue(bookId);
						return res.status(202).send({result: 1});
					}
					
					res.status(responseCode).send(JSON.parse(body));
				});
			}
		});
	});
});