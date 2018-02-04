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
