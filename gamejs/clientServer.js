var clientServer = function(gameServer, io) {

	// To avoid conflicts with socket iom rename this to self
	var self = this;

	self.io = io;

	// Get the game server object
	self.gameServer = gameServer;

	// Initialize socket io
	self.init = function() {
		// Fired upon a connection
		self.io.on('connection', function(socket) {

			// If the player is registered 
			if (self.getUsername(socket)) {

				// Check if the player has already joined a game
				if (self.getUserGame(socket)) {

					// If gametype is solo 
					if (self.getUserGame(socket).gameType == 'solo') {
						self.handleSoloConnection(socket);

						// If game type is multiplayer
					} else {
						self.handleMultiplayerInitialization(socket);
						self.handleMultiplayerGameConnection(socket);
					}

					// If the player is joining a game, send him available games
				} else {
					self.sendAvailableGames(socket);
				}

				// The user is not registered (could happen if server restarts ...) ! Send him back to the first page
			} else {
				self.handleDisconnect(socket);
			}
		});
	};

	/**
	 * Socket io handler for the solo game type (the opponent is an ai)
	 * @param  {socket} socket socket of the connected user
	 * @this {clientServer}
	 */
	self.handleSoloConnection = function(socket) {
		var player = self.gameServer.players[self.getUsername(socket)];
		var game = self.getUserGame(socket);

		// Let the user begin !
		player.isTurn = true;
		// Enemy player is AI
		var enemyPlayer = game.player_two;

		// Set AI boats
		enemyPlayer.battleship.randomSetBoats();

		socket.on('attack', function(attackCoordinates) {
			if (player.isTurn) {
				// Get attack coordinates
				var coordinates = [attackCoordinates.row, attackCoordinates.col];

				// Execute attack function
				self.getUserBattleship(socket).attackEnemy(coordinates, enemyPlayer);
				self.sendIAResponse(socket);

				// Check if the user has won
				if (enemyPlayer.battleship.isFleetDestroyed()) {
					self.sendGameOverStatus(socket);
					//Disconnect player after 5 seconds
					setTimeout(function() {
						self.handleDisconnect(socket);
					}, 5000);
				}
				else {
					// Set the turn to the AI
					player.isTurn = false;

					var AIAttack_coordinates = enemyPlayer.guessCoordinates();
					enemyPlayer.attackEnemy(AIAttack_coordinates, player);

					// Check if the AI has won
					if (self.getUserBattleship(socket).isFleetDestroyed()) {
						self.sendGameOverStatus(socket);
						//Disconnect player after 5 seconds
						setTimeout(function() {
							self.handleDisconnect(socket);
						}, 5000);
					}

					setTimeout(function () {
						player.isTurn = true;
						self.sendSoloResponse(socket);
					}, 2000);
				}

			}
		})
	};

	/**
	 * Socket io handler for th initialization page (registers the user id and puts him within a game with another user
	 * before setting the boats)
	 * @param  {socket} socket socket of the connected user
	 * @this {clientServer}
	 */
	self.handleMultiplayerInitialization = function(socket) {
		var username = self.getUsername(socket);
		var game = self.getUserGame(socket);
		var player_one = game.player_one;
		var player_two = game.player_two;

		// If the user has created or joined a game, put them in the game room
		self.joinGameRoom(socket);

		//Save player socket ID
		self.gameServer.players[username].saveSocketId(socket.id);

		// If the user is the player who created the game, send wait status (he has to wait for a player to join)
		if (username == player_one.username) {
			self.sendWaitStatus(socket);
		}

		// If the user is the player who joined the game, send connect status the other player in the game telling him a player has joined
		else {
			self.sendConnectStatus(socket);
		}

		// When the user sends a startGame, redirect both users to the setBoats page
		socket.on('startGame', function() {
			self.sendSetBoatStatus(socket);
		});
	}

	/**
	 * Socket io handler for the game page (main page for the game)
	 * @param  {socket} socket socket of the connected user
	 * @this {cleintServer}
	 */
	self.handleMultiplayerGameConnection = function(socket) {
		var username = self.getUsername(socket);

		var game = self.getUserGame(socket);

		// If both users are connected and user boats have been set
		if (!game.isAvailable()) {
			// Get enemy player
			var enemyPlayer = self.getEnemyPlayer(socket);

			// If the other player has not set the boats yet, send the message to the user
			if (!enemyPlayer.battleship.areBoatsSet) {
				self.sendWaitForBoatStatus(socket);
				// Since our user is the first to have his boats set, give him the first turn !
				self.gameServer.players[self.getUsername(socket)].isTurn = true;
			}

			// If both players have boats set start game !
			else {
				self.sendStartGameStatus(socket);
			}

			// Set the attack event (if it is the turn of the user, he may make attack events)
			socket.on('attack', function(attackCoordinates) {
				if (enemyPlayer.battleship.areBoatsSet && gameServer.players[username].isTurn) {
					// Get attack coordinates
					var coordinates = [attackCoordinates.row, attackCoordinates.col];

					// Execute attack function
					self.getUserBattleship(socket).attackEnemy(coordinates, enemyPlayer);

					// Check if the user has won
					if (enemyPlayer.battleship.isFleetDestroyed()) {
						self.sendGameOverStatus(socket);
						//Disconnect players
						self.disconnectAllPlayersInGame(socket);
					}

					//  If there is no victory ...
					else {
						// Change user's turn:
						self.gameServer.players[username].isTurn = false;
						enemyPlayer.isTurn = true;

						// Send the response to both users
						self.sendNextTurnStatus(socket);
					}
				}
			});
		}
	}


	/******************************** Methods *************************************/

	self.getUserGame = function(socket) {
		return self.gameServer.players[socket.handshake.session.username].game;
	}

	self.getUsername = function(socket) {
		return socket.handshake.session.username;
	}

	self.getUserBattleship = function(socket) {
		return self.gameServer.players[self.getUsername(socket)].battleship;
	}

	self.sendWaitStatus = function(socket) {
		var status = {
			status: 'waiting',
			message: 'Waiting for players to join the game...',
		}
		socket.emit('status', status);
	}

	self.sendConnectStatus = function(socket) {
		var game = self.getUserGame(socket);
		var player_one = game.player_one;
		var player_two = game.player_two;

		// Send message to player one !
		var status = {
			status: 'connected',
			message: "Player " + player_two.username + " is connected ! You are ready to start the game !",
		}
		socket.broadcast.to(player_one.socketId).emit('status', status);

		// Send a messsage to player_two
		status.message = "You are  connected with " + player_one.username + " !";
		socket.emit('status', status);
	}

	self.joinGameRoom = function(socket) {
		var game = self.getUserGame(socket);
		socket.join(game.name);
	}

	self.sendAvailableGames = function(socket) {
		socket.emit('listGames', self.gameServer.availableGames);
	}

	self.sendSetBoatStatus = function(socket) {
		var game = self.getUserGame(socket);
		var response = {
			redirect: '/setBoats'
		};
		// Send the redirect url to everyone inside the created game room
		self.io.sockets.in(game.name).emit('setBoats', response)
	}

	self.getEnemyPlayer = function(socket) {
		var game = self.getUserGame(socket);
		var username = self.getUsername(socket);
		if (game.player_one.username == username) {
			return game.player_two;
		} else {
			return game.player_one;
		}
	}

	self.sendWaitForBoatStatus = function(socket) {
		var username = self.getUsername(socket);
		var enemyPlayer = self.getEnemyPlayer(socket);
		var response = {
			message: 'Waiting for ' + enemyPlayer.username + " to set his boats",
		}
		socket.emit('wait', response);
	}

	self.sendStartGameStatus = function(socket) {
		var response = {
				message: 'It is your turn to play',
			}
			// Send message to both players according to whose turn it is to play
		socket.broadcast.to(self.getEnemyPlayer(socket).socketId).emit('wait', response);
		response.message = "It is " + self.getEnemyPlayer(socket).username + "'s turn to play";
		socket.emit('wait', response);
	}

	self.sendGameOverStatus = function(socket) {
		var response = {
			message: 'You have lost ! Better luck next time !',
			battleship: self.getEnemyPlayer(socket).battleship
		};
		socket.broadcast.to(self.getEnemyPlayer(socket).socketId).emit('finish', response);
		response = {
			message: 'You won !',
			battleship: self.getUserBattleship(socket)
		};
		socket.emit('finish', response);
	}

	self.sendNextTurnStatus = function(socket) { 
		response = {
			message: 'It is your turn to play',
			battleship: self.getEnemyPlayer(socket).battleship
		};
		socket.broadcast.to(self.getEnemyPlayer(socket).socketId).emit('attack', response);

		response = {
			message: "It is " + self.getEnemyPlayer(socket).username + "'s turn to play",
			battleship: self.getUserBattleship(socket)
		};
		socket.emit('attack', response);
	}

	self.sendIAResponse = function(socket) {
		response = {
			message: "It is AI's turn to play",
			battleship: self.getUserBattleship(socket)
		};
		socket.emit('attack', response);
	}

	self.sendSoloResponse = function(socket) {
		response = {
			message: "It is your turn to play",
			battleship: self.getUserBattleship(socket)
		};
		socket.emit('attack', response);
	}

	self.handleDisconnect = function(socket) {
		var response = {
			message: 'You are not connected',
			redirect: '/'
		}
		socket.emit('logout', response);
		socket.disconnect();
	}

	self.disconnectAllPlayersInGame = function(socket) {
		setTimeout(function() {
			// Disconnect enemy player
			self.handleDisconnect(self.io.sockets.connected[self.getEnemyPlayer(socket).socketId]);
			// Disconnect the player
			self.handleDisconnect(socket);
		}, 5000);
	}
};

module.exports = clientServer;
