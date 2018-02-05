

const express = require('express');
const config = require('./config/config');

const app = express();

app.use(function(req, res, next) {
	
	res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
	res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, DELETE, PATCH")
	console.log('tava');
	next();
});

module.exports = require('./config/express')(app, config);

app.listen(config.port, () => {
  console.log('Express server listening on port ' + config.port);
});

