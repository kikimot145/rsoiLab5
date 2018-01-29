module.exports = (sequelize, DataTypes) => {

	const Reader = sequelize.define('Reader', {
		fio: DataTypes.STRING,
		books: DataTypes.ARRAY(DataTypes.INTEGER)
	});
	
	Reader.getReader = function(readerId, callback){
		this.findById(readerId, 
		{
			attributes: ['id','fio'],
			rejectOnEmpty: true
		}
		).then((data) => {
			callback(null, data);
		}).catch(function (err) {
			callback(err, [0]);
		});
	}
	
	Reader.addBookToReader = function(readerId, bookId, callback){
		this.findById(readerId, 
		{
			attributes: ['books'],
			rejectOnEmpty: true
		}
		).then((data) => {
			let idx = data.books.indexOf(parseInt(bookId));
			if (idx < 0) {
				this.update(
					{'books': sequelize.fn('array_append', sequelize.col('books'), bookId)},
					{'where': {'id': readerId}}
				).then((result) => {
					callback(null, result);
				});
			} else {
				throw 'ReaderAlreadyHasBook';
			}
		}).catch(function (err) {
			callback(err, [0]);
		});
	}
	
	Reader.deleteBookFromReader = function(readerId, bookId, callback){
		this.findById(readerId, 
		{
			attributes: ['books'],
			rejectOnEmpty: true
		}
		).then((data) => {
			let idx = data.books.indexOf(parseInt(bookId));
			if (idx >= 0) {
				data.books.splice(idx, 1);
				
				this.update(
					{'books': data.books},
					{'where': {'id': readerId}}
				).then((result) => {
					callback(null, result);
				});
			} else {
				throw 'ReaderHasNoBook';
			}
		}).catch(function (err) {
			callback(err, [0]);
		});
	}
	
	return Reader;
};

