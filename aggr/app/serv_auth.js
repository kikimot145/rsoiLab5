/* global require */
/* global module */

'use strict';

class servAuth {
	constructor(appId, appSecret, tokenAlive) {
		if (servAuth._instance) {
			return servAuth._instance;
		}
		
		servAuth._instance = this;
		
		this.appId = appId;
		this.appSecret = appSecret;
		this.tokenAlive = tokenAlive;
		
		this.token = null;
		this.tokenDate = 0;
		
		this.basic = appId+':'+appSecret;
	}
	
	
}

module.exports = servAuth;