var battleship = require('./battleship.js');


function AI(game) {

	/**
	 * Game in which the AI is
	 * @type {game}
	 * @this {AI}
	 */
	this.game = game;

	/**
	 * AI Battleship object
	 * @type {battleship}
	 * @this {AI}
	 */
	this.battleship = new battleship();

	/**
	 * Array of all possible attack coordinates for the AI. The AI will generate random coordinates in that array which will then be reevaluated.
	 * The array will decrease in size as the number of possibilities for the AI will go down.
	 * @type {battleship}
	 * @this {AI}
	 */
	this.possibleCoordinatesArray = createArray(10);

	/**
	 * Array that will be populated if there is a hit. If there is a hit, the AI will randomly choose coordinates within that new array
	 * because it will hold the possible coordinates of the boat which is being attacked. Once the boat is sunk, the array
	 * will be empty again and the Ai will choose coordinates in the possibleCoordinatesArray.
	 * @type {Array}
	 * @this {AI}
	 */
	this.possibleCoordinatesSubArray = [];

	this.hitCoordinates = [];

	this.guessCoordinates = function() {
		var array = this.possibleCoordinatesArray;
		var subArray = this.possibleCoordinatesSubArray;

		// If the possibleCoordinatesArray is empty
		if (subArray.length == 0) {
			// Choose a random value for the row
			var row = Math.floor(Math.random() * array.length);
			// Choose a random value for the column within the row that was chosen
			var col = Math.floor(Math.random() * array[row].length);

			return array[row][col];
		}

		//If the possibleCoordinatesArray is not empty
		else {
			console.log('there is a problem');
			// Choose a random value for the row in the sub array
			var row = Math.floor(Math.random() * subArray.length);
			// Choose a random value for the column within the row that was chosen
			var col = Math.floor(Math.random() * subArray[row].length);

			return subArray[row][col];
		}

	};


	this.evaluateArray = function(coordinatesList) {
		for (coordinates of coordinatesList) {
			var x = coordinates[0];
			var y = coordinates[1];
			for (var i = x-1; i <= x+1; i++) {
				for (var j = y-1; j <= y+1; j++) {
					if (this.battleship.isInGrid([i,j])) {
						var deleteCoordinates = this.findCoordinatesOf([i,j]);
						// If coordinates are found (the element may already be deleted from the array)
						if (deleteCoordinates) {
							this.possibleCoordinatesArray[deleteCoordinates[0]].splice(deleteCoordinates[1], 1);
						}
					}
				}
				
			}
		}
	};

	this.evaluateSubArray = function() {
		// Reset the sub array first
		this.possibleCoordinatesSubArray = [];
		// If there is only one element, we need to check (attack) all the cells around it !
		if (this.hitCoordinates.length == 1) {
			var coordinates = this.hitCoordinates[0];
			var row = coordinates[0];
			var col = coordinates[1];
			for (i = row-1; i <= row+1; i++) {
				var array = [];
				if (this.battleship.isInGrid([i, col])) {
					if (this.battleship.attack_grid[i][col] == 0 && [i, col] != [row, col]) {
						array.push([i, col]);
						this.possibleCoordinatesSubArray.push(array);
					}
				}
			}
			for (j=col-1; j<=col+1; j++) {
				var array = [];
				if (this.battleship.isInGrid([row, j])) {
					if (this.battleship.attack_grid[row][j] == 0 && [row, j] != [row, col]) {
						array.push([row, j]);
						this.possibleCoordinatesSubArray.push(array);
					}
				}
			}
		}

		// If there is more than one element, there are at maximum two possibilities because we have a direction !
		else if (this.hitCoordinates.length > 1 ) {
			// Get the direction of the boat
			var row = this.hitCoordinates[0][0];
			if (this.hitCoordinates[1][0] == row) {
				// The direction of the enemy boat is horizontal
				var x = this.hitCoordinates[0][0];
				var y = this.hitCoordinates[0][1];
				if (this.battleship.isInGrid([x, y-1])) {
					this.possibleCoordinatesSubArray.push([x, y-1]);
				}
			}
			else {
				// The direction of the enemy boat is vertical
				var length = this.hitCoordinates.length;
				var x = this.hitCoordinates[length-1][0];
				var y = this.hitCoordinates[length-1][1];
				if (this.battleship.isInGrid([x, y-1])) {
					this.possibleCoordinatesSubArray.push([x, y-1]);
				}
			}
		}
	};

	this.findCoordinatesOf = function(coordinates) {
		for (row in this.possibleCoordinatesArray) {
			for (col in this.possibleCoordinatesArray[row]) {
				if (this.possibleCoordinatesArray[row][col] == coordinates) {
					return [row, col];
				}
			}
		}
		return false;
	};

	this.attackEnemy = function(attack_coordinates, enemyPlayer) {
		var x = attack_coordinates[0];
		var y = attack_coordinates[1];

		

		// Check if there is a hit
		if (enemyPlayer.battleship.checkPosition(x,y)) {
			this.hitCoordinates.push([x,y]);

			// Send attack to the player
			this.battleship.attackEnemy(attack_coordinates, enemyPlayer);


			if(enemyPlayer.battleship.findHitBoat(x,y).isSunk) {
				this.evaluateArray(this.hitCoordinates);

				// Reinitialize hit coordinates
				this.hitCoordinates = [];
			}
		}

		// If no boats hit, evaluate the new array 
		else {
			// Send attack to the player
			this.battleship.attackEnemy(attack_coordinates, enemyPlayer);
			this.evaluateArray([[x,y]]);
		}

		this.evaluateSubArray();
	};
}

module.exports = AI;

function createArray(n) {
	var array = [];
	for (i=0; i < n; i++) {
		var subArray = []
		for (j=0; j < n; j++) {
			subArray.push([i,j]);
		}
		array.push(subArray);
	}
	return array;
};