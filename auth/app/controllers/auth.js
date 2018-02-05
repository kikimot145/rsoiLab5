const express = require('express');
const router = express.Router();
const db = require('../models');

const basicAuth = require('express-basic-auth');
const bearerToken = require('express-bearer-token');
const Base64 = require('js-base64').Base64;

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


router.use('/readers_accounts', bearerToken());

router.use('/readers_accounts', (req, res, next) => {
	console.log('TokenCheck:'+req.token+'/'+authState.token);
	console.log('TimeCheck:'+Date.now()+'/'+authState.tokenExpires);
	if (typeof req.token == 'undefined' || 
		req.token != authState.token ||
		authState.tokenExpires < Date.now())
	{
		return res.status(401).send({error: 'InvalidToken'});
	} else {
		next();
	}
});

router.post('/readers_accounts', (req, res, next) => {
	let authHeader = req.body.authHeader;
	let type = authHeader.split(' ')[0];
	let authInfo = authHeader.split(' ')[1];
	
	if (type == 'Basic') {
		authInfo = Base64.decode(authInfo);
		console.log('Auth user|'+authInfo+'|');
		authInfo = authInfo.split(':');
		let login = authInfo[0];
		let pass = authInfo[1];
		
		db.ReaderAccount.getReaderAccount(login, function (errors, readerAccount) {
			if (errors == 'SequelizeEmptyResultError') {
				return res.status(404).send({error: 'ReaderAccountNotFound'});
			} else if (errors) {
				console.log(errors);
				return res.status(500).send({error: 'DBError'});
			} else if (readerAccount.readerPassword != crypto.createHmac('sha256', readerAccount.hashkey).update(pass).digest("hex")) { 
				return res.status(200).send({error: 'ReaderPasswordIncorrect'});
			} else {
				db.AccessToken.createAccessToken(readerAccount.id, true, function (errors, dbAccessToken) {
					if (errors) return res.status(500).send({error: 'DBError'});
					
					return res.status(200).send({readerId: readerAccount.id, token: dbAccessToken.token});
				});
			}
		});
	} else if (type == 'Bearer') {
		db.AccessToken.getAcessToken(authInfo, function (errors, tokenInfo) {
			if (errors == 'SequelizeEmptyResultError') {
				return res.status(404).send({error: 'InvalidToken'});
			} else if (errors) {
				return res.status(500).send({error: 'DBError'});
			} else {
				return res.status(200).send(tokenInfo);
			}
		});
	} else {
		return res.status(400).send({error: 'InvalidAuthtype'});
	}
});

router.post('/oauth_code', (req, res, next) => {
	let authHeader = req.body.authHeader;
	let type = authHeader.split(' ')[0];
	let authInfo = authHeader.split(' ')[1];
	
	if (type == 'Basic') {
		authInfo = Base64.decode(authInfo);
		console.log('Auth user|'+authInfo+'|');
		authInfo = authInfo.split(':');
		let login = authInfo[0];
		let pass = authInfo[1];
		
		db.ReaderAccount.getReaderAccount(login, function (errors, readerAccount) {
			if (errors == 'SequelizeEmptyResultError') {
				return res.status(404).send({error: 'ReaderAccountNotFound'});
			} else if (errors) {
				console.log(errors);
				return res.status(500).send({error: 'DBError'});
			} else if (readerAccount.readerPassword != crypto.createHmac('sha256', readerAccount.hashkey).update(pass).digest("hex")) { 
				return res.status(200).send({error: 'ReaderPasswordIncorrect'});
			} else {
				db.Code.createCode(req.query.client_id, readerAccount.id, function (errors, dbCode) {
					if (errors) return res.status(500).send({error: 'DBError'});
					
					return res.status(200).send({readerId: readerAccount.id, code: dbCode.code});
				});
			}
		});
	} else {
		return res.status(400).send({error: 'InvalidAuthtype'});
	}
});