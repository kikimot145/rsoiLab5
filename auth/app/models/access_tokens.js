const crypto = require('crypto');

const accessTokenLiveTime = 7200000;
const accessTokenUnusedLiveTime = 1800000;

module.exports = (sequelize, DataTypes) => {

	const AccessToken = sequelize.define('AccessToken', {
		token: DataTypes.STRING,
		readerId: DataTypes.INTEGER,
		expires: DataTypes.DATE,
		unusedExpires: DataTypes.DATE
	}, { timestamps: false });
	
	AccessToken.getAcessToken = function(token, callback){
		this.findOne( 
		{
			where: { token: token },
			rejectOnEmpty: true
		}
		).then((dbAccessToken) => {
			let now = Date.now();
			if (dbAccessToken.expires < now || dbAccessToken.unusedExpires < now) {
				return callback({error: 'TokenExpireced'}, result);
			} else {
				if (dbAccessToken.unusedExpires != dbAccessToken.expires) dbAccessToken.unusedExpires = Date.now() + accessTokenUnusedLiveTime;
				dbAccessToken.update( {unusedExpires: dbAccessToken.unusedExpires},
				{
					where: { id: dbAccessToken.id },
					rejectOnEmpty: true
				}
				).then((result) => {
					return callback(null, dbAccessToken);
				})
			}
		}).catch(function (err) {
			return callback(err, null);
		});
	}
	
	AccessToken.createAccessToken = function(readerId, isUnusedExperice, callback){
		let token = crypto.randomBytes(32).toString('base64');
		
		let now = Date.now();
		let expires = now+accessTokenLiveTime;
		let unusedExpires = isUnusedExperice ? now+accessTokenUnusedLiveTime : expires;
		
		this.create({token: token, readerId: readerId, expires: expires, unusedExpires: unusedExpires}).then((result) => {
			callback(null, result);
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	AccessToken.resetAccessToken = function(id, isUnusedExperice, callback){
		let token = crypto.randomBytes(32).toString('base64');
		
		let now = Date.now();
		let expires = now+accessTokenLiveTime;
		let unusedExpires = isUnusedExperice ? now+accessTokenUnusedLiveTime : expires;
		
		this.update(
			{token: token, expires: expires, unusedExpires: unusedExpires},
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
			).then((dbAccessToken) => {
				callback(null, dbAccessToken);
			});
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	return AccessToken;
};

