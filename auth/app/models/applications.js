const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {

	const Application = sequelize.define('Application', {
		client_id: DataTypes.STRING,
		client_secret: DataTypes.STRING
	}, { timestamps: false });
	
	Application.getApplication = function(client_id, callback){
		this.findOne( 
		{
			where: { client_id: client_id },
			rejectOnEmpty: true
		}
		).then((dbApplication) => {
			return callback(null, dbApplication);
		}).catch(function (err) {
			return callback(err, null);
		});
	}
	
	return Application;
};

