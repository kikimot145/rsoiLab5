// Example model

module.exports = (sequelize, DataTypes) => {

	const ReaderAccount = sequelize.define('ReaderAccount', {
		readerLogin: DataTypes.STRING,
		readerPassword: DataTypes.STRING,
		hashkey: DataTypes.STRING
	}, { timestamps: false });
	
	ReaderAccount.getReaderAccount = function(readerLogin, callback){
		this.findOne( 
		{
			where: { readerLogin: readerLogin },
			rejectOnEmpty: true
		}
		).then((dbReaderAccount) => {
			callback(null, dbReaderAccount);
		}).catch(function (err) {
			//console.log(err);
			callback(err, null);
		});
	}
  return ReaderAccount;
};

