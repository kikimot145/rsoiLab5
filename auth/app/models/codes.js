const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {

	const Code = sequelize.define('Code', {
		code: DataTypes.STRING,
		client_id: DataTypes.STRING,
		readerId: DataTypes.INTEGER,
	}, { timestamps: false });
	
	Code.getCode = function(code, callback){
		this.findOne( 
		{
			where: { code: code },
			rejectOnEmpty: true
		}
		).then((dbCode) => {
			return callback(null, dbCode);
		}).catch(function (err) {
			return callback(err, null);
		});
	}
	
	Code.createCode = function(client_id, readerId, callback){
		let code = crypto.randomBytes(32).toString('base64');
		
		this.create({code: code, client_id: client_id, readerId: readerId}).then((result) => {
			callback(null, result);
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	return Code;
};

