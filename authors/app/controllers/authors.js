const express = require('express');
const router = express.Router();
const db = require('../models');


const basicAuth = require('express-basic-auth');
const bearerToken = require('express-bearer-token');

const crypto = require('crypto');



module.exports = (app) => {
  app.use('/', router);
};


const tokenLivingTime = 10000; // ms = 10sec
var authState = { token: null, tokenExpires: null};
router.use('/service_auth', basicAuth({
    users: { 'aggr': 'aggrSec' }
}));

router.get('/service_auth', (req, res, next) => {
	authState.token = crypto.randomBytes(16).toString('base64');
	authState.tokenExpires = Date.now() + tokenLivingTime;
	
	console.dir(authState);
	res.status(200).send(authState);
});


router.use('/authors', bearerToken());

router.use('/authors', (req, res, next) => {
	console.log('TokenCheck:'+req.token+'/'+authState.token);
	console.log('TimeCheck:'+Date.now()+'/'+authState.tokenExpires);
	if (typeof req.token == 'undefined' || 
		req.token != authState.token ||
		authState.tokenExpires < Date.now())
	{
		return res.status(401).send({error: 'Invalid Token'});
	} else {
		next();
	}
});

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


