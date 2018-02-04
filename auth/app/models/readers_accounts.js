// Example model

module.exports = (sequelize, DataTypes) => {

	const ReaderAccount = sequelize.define('ReaderAccount', {
		readerLogin: DataTypes.STRING,
		readerPassword: DataTypes.STRING,
		hashkey: DataTypes.STRING
	});
	
	ReaderAccount.getReaderAccount = function(readerAccount, readerPassword, callback){
		this.findOne( 
		{
			where: { readerAccount: readerAccount },
			rejectOnEmpty: true
		}
		).then((dbReaderAccount) => {
			callback(null, dbReaderAccount);
		}).catch(function (err) {
			callback(err, null);
		});
	}
  return ReaderAccount;
};

