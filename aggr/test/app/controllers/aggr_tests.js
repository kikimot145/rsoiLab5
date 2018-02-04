'use strict';
process.env.NODE_ENV = 'development';

var chai        = require('chai'),
    chaiHttp    = require('chai-http'),
    server      = require('./../../../app.js'),
    should      = chai.should();


chai.use(chaiHttp);
	
const expect = require('chai').expect;

describe('authors', () => {
	let author3 = {"id":3,"fio":"Вронский Александр Петрович"};
	it ('request of all authors /authors?page=0&size=1', function(done){
		chai.request(server)
		.get('/authors?page=0&size=1')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.rows.length.should.be.eql(1);
		res.body.rows[0].should.be.eql(author3);
		res.body.count.should.be.eql(4);
		done();
		});
	});
	
	it ('request of all authors /authors', function(done){
		chai.request(server)
		.get('/authors')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.rows.length.should.be.eql(4);
		res.body.rows[0].should.be.eql(author3);
		res.body.count.should.be.eql(4);
		done();
		});
	});
	
	it ('request of /author/3', function(done){
		chai.request(server)
		.get('/authors/3')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(author3);
		done();
		});
	});
});

describe('books', () => {
	let book3WithAuthor = {
				id: 3,
				title: "Голуби",
				year: 1995,
				author: {
					id: 1,
					fio: "Демьянов Андрей Викторович"
				}
			};
			
	it ('request /books', function(done){
		chai.request(server)
		.get('/books')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.rows.length.should.be.eql(5);
		res.body.rows[0].should.be.eql(book3WithAuthor);
		res.body.count.should.be.eql(5);
		done();
		});
	});
	
	let book3 = {
				id: 3,
				title: "Голуби",
				year: 1995,
				authorId: 1
			};
	
	it ('request /books?author=1&page=0&size=1)', function(done){
		chai.request(server)
		.get('/books?author=1&page=0&size=1')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.rows.length.should.be.eql(1);
		res.body.rows[0].should.be.eql(book3);
		res.body.count.should.be.eql(2);
		done();
		});
	});
	
	let book6Full = {
			id: 6,
			title: "Реванш",
			about: "Спортивная драма.",
			author: {
				id: 4,
				fio: "Радищев Максим Викторович"
			},
			year: 1999,
			count: 1,
			createdAt: "2018-01-16T21:00:00.000Z",
			updatedAt: "2018-01-16T21:00:00.000Z"
		};
	it ('request /books/6', function(done){
		chai.request(server)
		.get('/books/6')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(book6Full);
		done();
		});
	});
});


describe('readers', () => {
	let reader1 = {
				id: 1,
				fio: "Корнеев Сергей Петрович"
			};
	it ('request /readers/1', function(done){
		chai.request(server)
		.get('/readers/1')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(reader1);
		done();
		});
	});
	
	let resultPassed = {result: 1};
	let resultNotPassed = {result: 0};
	
	it ('request PATCH /readers/1/books?book=3', function(done){
		chai.request(server)
		.patch('/readers/1/books?book=3')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(resultPassed);
		done();
		});
	});
	
	it ('request PATCH /readers/1/books?book=3 again', function(done){
		chai.request(server)
		.patch('/readers/1/books?book=3')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(resultNotPassed);
		done();
		});
	});
	
	it ('request PATCH /readers/1/books?book=2 which is anavailable', function(done){
		chai.request(server)
		.patch('/readers/1/books?book=2')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(resultNotPassed);
		done();
		});
	});
	
	it ('request DELETE /readers/1/books?book=3', function(done){
		chai.request(server)
		.delete('/readers/1/books?book=3')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.result.should.be.eql(1);
		done();
		});
	});
	
	it ('request DELETE /readers/1/books?book=3 again', function(done){
		chai.request(server)
		.delete('/readers/1/books?book=3')
		.end(function(err, res) {
		res.should.have.status(200);
		res.body.should.be.a('object');
		res.body.should.be.eql(resultNotPassed);
		done();
		});
	});
	
});