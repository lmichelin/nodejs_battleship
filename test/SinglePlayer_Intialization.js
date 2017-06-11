"use strict"

var chai = require('chai');
var expect = require('chai').expect;
let chaiHttp = require('chai-http');
var server = require('../server.js').server;
var gameServer = require('../server.js').gameServer;
chai.use(chaiHttp);

var player = chai.request.agent(server);
var username;

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

		it('Player should create a game on the createGame page', function(done) {
			player
				.get('/solo')
				.end(function(err, res) {
					expect(res.statusCode).to.equal(200);
					expect(res).to.redirectTo('http://127.0.0.1:8000/setBoats');
					username = res.req._headers.cookie.substr(16, 32);
					// console.log(res.req._headers.cookie);
					// console.log(username);
					// console.log(gameServer.players);
					expect(gameServer.players).to.include.any.keys(username);
					expect(gameServer.games).to.include.any.keys(username);
					expect(gameServer.availableGames).not.to.include.any.keys('MyGame');
				done();
				});
		});

		it('Player should get the setBoats content', function(done) {
			player
				.get('/setBoats/getBoats')
				.end(function(err, res) {
					expect(res.statusCode).to.equal(200);
					expect(res.body).to.have.property('battleship');
					expect(res.body.battleship).to.have.property('grid');
					expect(res.body.battleship.grid).to.be.an('array');
					expect(res.body.battleship).to.have.property('boats');
					expect(res.body.battleship.boats).to.be.an('Object');
				done();
			});
		});
	});
});