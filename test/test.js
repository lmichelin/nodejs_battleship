"use strict"

let chai = require('chai');
let should = require('chai').should();
let request = require('request');
let chaiHttp = require('chai-http');
let server = require('../server.js').server;


chai.use(chaiHttp);

describe('Routes: ', function() {
	describe('Test the multiplayer game routes', function() {
		it('it should return the Main page', function(done) {
			chai.request(server)
				.get('/')
				.end(function(err, res) {
					res.should.have.status(200);
				done();
			});
		});

		it('it should return the createGame page', function(done) {
			chai.request(server)
				.get('/createGame')
				.end(function(err, res) {
					res.should.have.status(200);
				done();
			});
		});

		it('it should post a username and game name', function(done) {
			chai.request(server)
				.post('/createGame')
				.send({username: 'Francois', gameName:'MyGame'})
				.end(function(err, res) {
					res.should.have.status(200);
				done();
			});
		});

		it('it should return the setBoats page', function(done) {
			chai.request(server)
				.get('/setBoats')
				.end(function(err, res) {
					res.should.have.status(200);
				done();
			});
		});
	});

	describe('get content from pages', function() {
		it('should return the content of the setBoats page', function(done) {
			chai.request(server)
				.get('/setBoats/getBoats')
				.end(function(err, res) {
					res.should.have.status(200);
				done();
				});
		});
	})
});