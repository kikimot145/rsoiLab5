const express = require('express');
const router = express.Router();
const db = require('../models');

module.exports = (app) => {
  app.use('/', router);
};

router.get('/status', (req, res, next) => {
	console.log('***\n\n' + new Date() + ':\nAlive check');
	res.status(200).send({status: "online"});
});

router.get('/books', (req, res, next) => {
	let author = req.query.author;
	let page  = req.query.page;
	let size = req.query.size;
	
	page  = (typeof(page) != 'undefined') ? page : 0;
	size = (typeof(size) != 'undefined') ? size : 20;
	
	console.log('***\n\n' + new Date() + ':\nGet all books with author ' + author);
	
	if (typeof(author) == 'undefined') {
		db.Book.getAllBooks(page,size, function (err, data) {
			res.status(200).send(data);
		});
	} else {
		db.Book.getAllBooksByAuthorId(author,page,size, function (err, data) {
			res.status(200).send(data);
		});
	}
	
});

router.get('/books/:id', (req, res, next) => {
	let id = req.params.id;
	
	console.log('***\n\n' + new Date() + ':\nGet book ' + id);
	
	db.Book.getBook(id, function (err, data) {
		res.status(200).send(data);
	});
});

router.patch('/books/:id', (req, res, next) => {
	let id = req.params.id;
	
	console.log('***\n\n' + new Date() + ':\nDecrease count on book ' + id);
	
	db.Book.decreaseCount(id, function (err, data) {
		res.status(200).send({result: data[0]});
	});
});

router.delete('/books/:id', (req, res, next) => {
	let id = req.params.id;
		
	console.log('***\n\n' + new Date() + ':\nGot request for make appointment ' + id + ' unlocked');
	
	db.Book.increaseCount(id, function (err, data) {
		res.status(200).send({result: data[0]});
	});
});
