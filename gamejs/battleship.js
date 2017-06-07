var boat = require('./boat.js'); // Require boat object

/** @type {Object} Battleship class
* @class battleship class with one per player with all the grids and methods
* Contains all the different methods and variables for the battleship game
* @param {string} player Player name
*/
function battleship() {

	/** This is the main grid for the game
	* @this {battleship}
	* @return {array} [The array representing the grid]
	*/
	this.grid =  [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];

	/**
	 * Second grid for attack management
	 * It will be entirely based on the second player or AI
	 * @type {Array}
	 */
	this.attack_grid = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];

	/** Function to determine wether a boat is on the desired coordinates
	* @this {battleship}
	* @param {integers} (x,y) Position coordinates
	* @return {boolean} true if the value is 1, or false
	*/
	this.checkPosition = function (x, y) {
		if (this.grid[x][y] == 1) {
			return true;
		}
		else {
			return false;
		}
	};

	/** Attack Enemy function: Will either hit or miss target. Changes the value of the enemy grid: 0 is water, 1 is boat, 2 is test but miss, 3 is test with a hit, 4 is sunk ...
	* @this {battleship}
	* @param {object} enemy_battleship battleship object of the opponent
	* @param {tuple} (x,y) Attack coordinates
	*/
	this.attackEnemy = function(x,y, enemy_battleship) {
		if (this.attack_grid[x][y] == 2) {
			console.error('This zone has already been hit !!')
		}
		if (enemy_battleship.checkPosition(x,y)) {
			enemy_battleship.grid[x][y] = 3;
			this.attack_grid[x][y] = 3;
		}
		else {
			enemy_battleship.grid[x][y] = 2;
			this.attack_grid[x][y] = 2;
		}
	};

	this.attackMyCoordinates = function(x,y) {
		if (this.checkPosition(x,y)) {
			this.grid[x][y] = 3;
		}
		else {
			this.grid[x][y] = 2;
		}
	};

	var carrier = new boat('carrier', 5);
	var battleship = new boat('battleship', 4);
	var cruiser = new boat('cruiser', 3);
	var submarine = new boat('submarine', 3);
	var destroyer = new boat('destroyer', 2);

	/**
	 * Dictionnary with all the boats on this battleship player game
	 * @this {battleship}
	 * @type {dictionnary}
	 */
	this.boats = {
		'carrier': carrier,
		'battleship': battleship,
		'cruiser': cruiser,
		'submarine': submarine,
		'destroyer': destroyer,
	};

	/**
	 * Are boats set or not on the grid
	 * @type {Boolean}
	 * @this {battleshîp}
	 * @default false
	 */
	this.areBoatsSet = false;

	/**
	 * Checks wether it is the player's turn
	 * @type {Boolean}
	 * @default false
	 */
	this.isTurn = false;

	/**
	 * Checks if boat position is valid before setting the boat
	 * @param {String} boat_name name of the boat
	 * @return {errors} false if no errors, errors if errors
	 */
	this.positionIsNotValid = function(boat_name) {
		var boat = this.boats[boat_name];
		var errors = [];
		for (var i = 0; i < boat.coordinatesList.length; i++) {
			if (!isInGrid(boat.coordinatesList[i])) {
				errors.push(boat.name + ' is not perfectly in grid')
			}
			if (!isZoneAvailable(boat.coordinatesList[i], this.grid)) {
				errors.push('Zone error, ' + boat.name + ' will be too close to another ship')
			}
		}
		if (errors.length == 0) {
			return false;
		}
		return errors;
	};

	/**
	 * Sets boat on grid
	 * @param {String} boat Boat name
	 * @this {battleship}
	 */
	this.setBoat = function (boat_name) {
		// This function should not be called if no tests have been made before !
		if (this.positionIsNotValid(boat_name)) {
			throw new Error({message: 'Position is not valid'});
		}

        var boat = this.boats[boat_name];
        for (var i = 0; i < boat.size; i++) {
            this.grid[boat.coordinatesList[i][0]][boat.coordinatesList[i][1]] = 1;
        }
        boat.isSet = true;
	};
};



/**
 * Test to check wether these coordinates can be placed on the grid
 * @param  {tuple}  coordinates coordinates of the zone
 * @return {Boolean}
 */
function isInGrid(coordinates) {
    if (Math.min(9, Math.max(coordinates[0],0)) != coordinates[0] ) {
        return false;
    }
    if (Math.min(9, Math.max(coordinates[1],0)) != coordinates[1] ) {
        return false;
    }
    return true;
};

/**
 * Checks wether the zone is availbale in and around the zone
 * @param  {tuple}  coordinates Coordinates of the zone
 * @param  {Array}  currentGrid Player gris
 * @return {Boolean}             false or true
 */
function isZoneAvailable(coordinates, currentGrid) {
	var x = coordinates[0];
	var y = coordinates[1];

	for (var i = x-1; i <= x+1; i++) {
		for (var j = y-1; j <= y+1; j++) {
			if (i>=0 && i<=9 && j>=0 && j<=9) {
				if (currentGrid[i][j] != 0) {
					return false;
				}
			}
		}
	}
	return true;
};



module.exports = battleship;