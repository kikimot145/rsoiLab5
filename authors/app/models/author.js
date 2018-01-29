module.exports = (sequelize, DataTypes) => {

	const Author = sequelize.define('Author', {
		fio: DataTypes.STRING
		},
		{ timestamps: false }
	);
	
	Author.getAuthors = function(page, size, callback){
		this.findAndCountAll({
			attributes: ['id','fio'],
			order: [['fio', 'ASC']],
			offset: page*size,
			limit: size
		}
		).then((data) => {
			callback(null, data);
		}).catch(function (err) {
			callback(err, null);
		});
	};
	
	Author.getAuthor = function(authorId, callback){
		this.findById(authorId, 
		{
			rejectOnEmpty: true
		}
		).then((data) => {
			callback(null, data);
		}).catch(function (err) {
			callback(err, null);
		});
	};

	return Author;
};

