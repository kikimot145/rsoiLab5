const crypto = require('crypto');

const refreshTokenLiveTime = 86400000;

module.exports = (sequelize, DataTypes) => {

	const RefreshToken = sequelize.define('RefreshToken', {
		token: DataTypes.STRING,
		accessTokenId: DataTypes.INTEGER,
		expires: DataTypes.DATE
	}, { timestamps: false });
	
	RefreshToken.getRefreshToken = function(token, callback){
		this.findOne( 
		{
			where: { token: token },
			rejectOnEmpty: true
		}
		).then((dbRefreshToken) => {
			let now = Date.now();
			if (dbRefreshToken.expires < now) {
				return callback({error: 'TokenExpireced'}, result);
			} else {
				return callback(null, dbRefreshToken);
			}
		}).catch(function (err) {
			return callback(err, null);
		});
	}
	
	RefreshToken.createRefreshToken = function(accessTokenId, callback){
		let token = crypto.randomBytes(32).toString('base64');
		
		let now = Date.now();
		let expires = now+refreshTokenLiveTime;
		
		this.create({token: token, accessTokenId: accessTokenId, expires: expires}).then((result) => {
			callback(null, result);
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	RefreshToken.resetRefreshToken = function(id, callback){
		let token = crypto.randomBytes(32).toString('base64');
		
		let now = Date.now();
		let expires = now+refreshTokenLiveTime;
		
		this.update(
			{token: token, expires: expires},
			{
				where: { id: id },
				rejectOnEmpty: true
			}
		).then((result) => {
			this.findOne( 
			{
				where: { id: id },
				rejectOnEmpty: true
			}
			).then((dbRefreshToken) => {
				callback(null, dbRefreshToken);
			});
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	return RefreshToken;
};

