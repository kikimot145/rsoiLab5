const express = require('express');
const router = express.Router();
const db = require('../models');

module.exports = (app) => {
  app.use('/', router);
};

router.get('/authors', (req, res, next) => {
	let page = req.query.page;
	let size = req.query.size;
	
	page  = (typeof(page) != 'undefined') ? page : 0;
	size = (typeof(size) != 'undefined') ? size : 20;
	
	console.log('***\n\n' + new Date() + ':\nGet all authors');
	
	db.Author.getAuthors(page, size, function (err, data) {
		res.status(200).send(data);
	});
});

router.get('/authors/:id', (req, res, next) => {
	let id = req.params.id;
	
	console.log('***\n\n' + new Date() + ':\nGet author ' + id);
	
	db.Author.getAuthor(id, function (err, data) {
		res.status(200).send(data);
	});
});


