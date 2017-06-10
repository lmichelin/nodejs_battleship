var clientServer = function(gameServer, io) {

	var self = this;

	self.io = io;

	self.gameServer = gameServer;

	self.init = function() {
		// Fired upon a connection
		self.io.on('connection', function(socket) {
			self.handleConnection(socket);
		});
	};

	self.handleConnection = function(socket) {
		var username = self.getUsername(socket);
		var game = self.getUserGame(socket);

		// If the user has created or joined a game ...
		if (game) {
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

			// If the user is the player who joined the game, send connect status to all players
			else {
				self.sendConnectStatus(socket);
			}
		}

		// If the user is joining a game, send him available games
		else {
			self.sendAvailableGames(socket);
		}

		// When the user sends a startGame, redirect both users to the setBoats page
		socket.on('startGame', function() {
			self.sendSetBoatStatus(socket);
		});

		// If both users are connected and user boats have been set
		if (game) {
			if (!game.isAvailable()) {
				// Get enemy player
				var enemyPlayer = self.getEnemyPlayer(socket);

				// If the other player has not set the boats yet, send the message to the user
				if (!enemyPlayer.battleship.areBoatsSet) {
					self.sendWaitForBoatStatus(socket);
					// Since self user is the first to have his boats set, give him the first turn !
					self.gameServer.players[self.getUsername(socket)].isTurn = true;
				}

				// If both players have boats set start game !
				else {
					self.sendStartGameStatus(socket);
				}

				// Set the attack event (if it is the turn of the user, he may maake attack events)
				socket.on('attack', function(attackCoordinates) {
					if (enemyPlayer.battleship.areBoatsSet && gameServer.players[username].isTurn) {
						// Get attack coordinates
						coordinates = [attackCoordinates.row, attackCoordinates.col];

						// Execute attack function
						self.getUserBattleship(socket).attackEnemy(coordinates, enemyPlayer);

						// Check if the user has won
						if (enemyPlayer.battleship.isFleetDestroyed()) {
							self.sendGameOverStatus(socket);
						}

						//  If there is no victory ...
						else {
							// Change user's turn:
							gameServer.players[username].isTurn = false;
							enemyPlayer.isTurn = true;

							// Send the response to both users
							self.sendNextTurnStatus(socket);
						}
					}
				});
			}
		}
	}

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
		}
		else {
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
		var response = {message: 'You have lost ! Better luck next time !', battleship: self.getEnemyPlayer(socket).battleship};
		socket.broadcast.to(self.getEnemyPlayer(socket).socketId).emit('finish', response);
		response = {message: 'You won !', battleship: self.getUserBattleship(socket)};
		socket.emit('finish', response);
	}

	self.sendNextTurnStatus = function(socket) {
		response = {message: 'It is your turn to play', battleship: self.getEnemyPlayer(socket).battleship};
		socket.broadcast.to(self.getEnemyPlayer(socket).socketId).emit('attack', response);

		response = {message: "It is " + self.getEnemyPlayer(socket).username + "'s turn to play", battleship: self.getUserBattleship(socket)};
		socket.emit('attack', response);
	}
};

module.exports = clientServer;
