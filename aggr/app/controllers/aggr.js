const express = require('express');
const router = express.Router();
const request = require('request');

const readersReq = require('../requests/readers_req');
const booksReq = require('../requests/books_req');
const authorsReq = require('../requests/authors_req');

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

function popQueue(){
	amqp.connect('amqp://localhost', function(err, conn){
		conn.createChannel(function(err, ch){
			ch.assertQueue(queue, {durable : false});
			ch.get(queue, {noAck : true},
				function(err, bookId){	
					console.log('QErr: ' + err + ' QId: ' + bookId);
					if (!bookId) {
						return;
					} else {
						setTimeout(popQueue, 10);
					}
					
					bookId = bookId.content;
					console.log('FromQueue: ' + bookId);
			
					booksReq.increaseBookCount(bookId, function(err, responseCode, body){
						if (err || responseCode == 500) {
							pushQueue(bookId);
						} else {
							console.log('Book '+ bookId + ' | ('+responseCode+') ' + body);
						}
					});
				}
			);
		});
	});
}

setInterval(function(){
	booksReq.isAlive(function(err, responseCode, body){
		if (responseCode == 200) popQueue();
	});
}, queueCheckInterval);

module.exports = (app) => {
  app.use('/', router);
};

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
	
	console.log('***\n\n' + new Date() + ':\nGet reader ' + id);
	
	readersReq.getReaderById(id, function (err, responseCode, body) {
		res.status(responseCode).send(JSON.parse(body));
	});
});

router.patch('/readers/:id/books', (req, res, next) => {
	let id = valCheck.checkPositiveInt(req.params.id, -1);
	if (id < 0) return res.status(400).send({error: "Bad reader id"});
	
	let bookId = valCheck.checkPositiveInt(req.query.book, -1);
	if (id < 0) return res.status(400).send({error: "Bad book id"});
	
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

router.delete('/readers/:id/books', (req, res, next) => {
	let id = valCheck.checkPositiveInt(req.params.id, -1);
	if (id < 0) return res.status(400).send({error: "Bad reader id"});
	
	let bookId = valCheck.checkPositiveInt(req.query.book, -1);
	if (id < 0) return res.status(400).send({error: "Bad book id"});
	
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