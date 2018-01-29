const express = require('express');
const router = express.Router();
const db = require('../models');

module.exports = (app) => {
  app.use('/', router);
};

router.get('/readers/:id', (req, res, next) => {
	let id = req.params.id;
	
	console.log('***\n\n' + new Date() + ':\nGet reader ' + id);
	
	db.Reader.getReader(id, function (err, data) {
		res.status(200).send(data);
	});
});

router.patch('/readers/:id/books', (req, res, next) => {
	let id = req.params.id;
	
	let bookId = req.query.book;
	
	console.log('***\n\n' + new Date() + ':\nAdd book' + bookId + ' for reader ' + id);
	
	db.Reader.addBookToReader(id, bookId, function (err, data) {
		res.status(200).send({result: data[0]});
	});
});

router.delete('/readers/:id/books', (req, res, next) => {
	let id = req.params.id;
	
	let bookId = req.query.book;
	
	console.log('***\n\n' + new Date() + ':\nRemove book' + bookId + ' for reader ' + id);
	
	db.Reader.deleteBookFromReader(id, bookId, function (err, data) {
		res.status(200).send({result: data[0]});
	});
});