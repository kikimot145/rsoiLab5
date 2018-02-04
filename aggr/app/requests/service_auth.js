/* global require */
/* global module */

'use strict';
const request = require('request');


class serviceAuth {
	constructor(appId, appSecret, service_url) {
		
		this.appId = appId;
		this.appSecret = appSecret;
		this.tokenExpires = Date.now();
		this.service_url = service_url;
		
		this.token = null;
		
	}
	
	refreshToken(callback) {
		let _this = this;
		request.get(_this.service_url+'/service_auth', {method: 'GET', uri: _this.service_url+'/service_auth'}, function(errors, response, body){
			if (!errors && response.statusCode == 200) {
				_this.token = JSON.parse(body).token;
				_this.tokenExpires = JSON.parse(body).tokenExpires;
			}
			
			callback();
		}).auth(_this.appId, _this.appSecret, true);
	}
	
	getToken() {
		console.log('getToken');
		console.dir(this);
		let _this = this;
		
		if (!_this.token || (_this.tokenExpires - Date.now()) < 500) {
			request.get(_this.service_url+'/service_auth', {method: 'GET', uri: _this.service_url+'/service_auth'}, function(errors, response, body){
				if (!errors && response.statusCode == 200) {
					_this.token = JSON.parse(body).token;
					_this.tokenExpires = JSON.parse(body).tokenExpires;
				}
			}).auth(_this.appId, _this.appSecret, true);	
		}
		
		return _this.token;
	}
}

module.exports = serviceAuth;