var chai = require('chai');
var expect = require('chai').expect;
var request = require('request');
let chaiHttp = require('chai-http');
var server = require('../server').server;

chai.use(chaiHttp);

describe('Status of all the pages', function() {
	describe('Main page', function() {
		it('status', function() {
			chai.request(server)
				.get('/')
				.end(function(err, res) {
					expect(res.statusCode).to.equal(200);
				});
		});


		it('content', function() {
			chai.request(server)
				.get('/join')
				.end(function(err, res) {
					expect(res.statusCode).to.equal(200);
				});
		});
	});

	describe('Game page', function() {
		it('status', function() {
			chai.request(server)
				.get('/createGame')
				.end(function(err, res) {
					expect(res.statusCode).to.equal(200);
				});
		});
	});

});