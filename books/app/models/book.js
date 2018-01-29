module.exports = (sequelize, DataTypes) => {

	const Book = sequelize.define('Book', {
		title: DataTypes.STRING,
		about: DataTypes.STRING,
		authorId: DataTypes.INTEGER,
		year: DataTypes.INTEGER,
		count: DataTypes.INTEGER
	});
	
	Book.getAllBooks = function(page, size, callback){
		this.findAndCountAll({
			attributes: ['id','title','authorId','year'],
			order: [['title', 'ASC']],
			offset: page*size,
			limit: size
		}
		).then((data) => {
			callback(null, data);
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	Book.getAllBooksByAuthorId = function(authorId, page, size, callback){
		this.findAndCountAll({
			attributes: ['id','title','authorId','year'],
			where: { authorId: authorId},
			order: [['title', 'ASC']],
			offset: page*size,
			limit: size
		}
		).then((data) => {
			callback(null, data);
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	Book.getBook = function(bookId, callback){
		this.findById(bookId, 
		{
			rejectOnEmpty: true
		}
		).then((data) => {
			callback(null, data);
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	Book.decreaseCount = function(bookId, callback){
		this.findById(bookId, 
		{
			attributes: ['count'],
			rejectOnEmpty: true
		}
		).then((data) => {
			if (data.count == 0) {
				throw 'BookIsNotAvailable'
			} else {
				this.update(
					{'count': (data.count-1)},
					{'where': [{'id': bookId}]}
				).then((result) => {
					callback(null, result);
				});
			}
		}).catch(function (err) {
			callback(err, [0]);
		});
	}
	
	Book.increaseCount = function(bookId, callback){
		this.findById(bookId, 
		{
			attributes: ['count'],
			rejectOnEmpty: true
		}
		).then((data) => {
			this.update(
				{'count': (data.count+1)},
				{'where': [{'id': bookId}]}
			).then((result) => {
				callback(null, result);
			});
		}).catch(function (err) {
			callback(err, null);
		});
	}
	
	return Book;
};

