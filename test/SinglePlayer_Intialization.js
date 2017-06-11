"use strict"

var chai = require('chai');
var expect = require('chai').expect;
let chaiHttp = require('chai-http');
var server = require('../server.js').server;
var gameServer = require('../server.js').gameServer;
chai.use(chaiHttp);

var player = chai.request.agent(server);

describe('SinglePlayer game between player and AI', function() {
	describe('Initialize singleplayer game', function() {
		it('it should return the Main page', function(done) {
			chai.request(server)
				.get('/')
				.end(function(err, res) {
					expect(res).to.have.status(200);
				done();
				});
		});

		it('Player one should create a game on the createGame page', function(done) {
			expect(player).to.have.property('cookie');
			player
				.get('/solo')
				.end(function(err, res) {
					expect(res.statusCode).to.equal(200);
					expect(res).to.redirectTo('http://127.0.0.1:8000/setBoats');
					
				done();
				});
		});
	});
});