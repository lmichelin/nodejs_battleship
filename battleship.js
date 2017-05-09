/**
 * Boat Object
 * @param  {string} name  Name of the boat category
 * @param  {integer} size Number of spaces occupied (size of the boat)
 */
function boat (name, size) {
	/**
	 * Name of the boat
	 * @type {string}
	 * @this {boat}
	 */
	this.name = name;

	/**
	 * Size of the boat
	 * @this {boat}
	 * @type {Integer}
	 */
	this.size = size;

	/**
	 * Tells wether the boat is sunk or not
	 * @type {Boolean}
	 * @default false
	 * @this {boat}
	 */
	this.isSunk = false;

	/**
	 * Placement direction on the grid ('right', 'down')
	 * @type {String}
	 * @default down
	 * @this {boat}
	 */
	this.direction = 'down';

	/**
	 * Coordinates of the first case
	 * @type {tuple}
	 * @default (0,0)
	 * @this {boat}
	 */
	this.coordinates = [0,0];

	/**
	 * Checks wether a boat has been set on the grid or not
	 * @type {Boolean}
	 * @this {boat}
	 * @default false
	 */
	this.isSet = false;

	/**
	 * Set position of the boat
	 * @param {tuple} initial_coordinates Coordinates of the position of the first case
	 * @param {string} direction can be 'right', 'down'
	 * @this {boat}
	 */
	this.setPosition = function (initial_coordinates, direction) {
		this.coordinates = initial_coordinates;
		this.direction = direction;
	};

	/**
	 * List of the grid coordiantes of the boat
	 * @type {Array}
	 * @default (0,0, ... 0)
	 * @this {boat}
	 */
	this.coordinatesList = new Array(this.size).fill([0,0]);

	/**
	 * Set the coordinatesList equal to the position of the boat when a initial positio and direction have been chosen
	 * @this {boat}
	 */
	this.setCoordinatesList = function() {
		switch (this.direction) {
			case 'down':
				for (var i = 0; i < this.size; i++) {
					this.coordinatesList[i] = this.coordinates + [i,0];
				}
				break;
			case 'right':
				for (var i = 0; i < this.size; i++) {
					this.coordinatesList[i] = this.coordinates + [0,i];
				}
				break;
		}
	};

};


/** @type {Object} Battleship class
* Contains all the different methods and variables for the battleship game
* @param {string} player Player name
*/
function battleship(player) {

	/**
	 * Player name
	 * @type {string}
	 */
	this.player = player;

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


	/** Attack function: Will either hit or miss target. Changes the value of the grid: 0 is water, 1 is boat, 2 is test but miss, 3 is test with a hit, 4 is sunk ...
	* @this {battleship}
	* @param {tuple} (x,y) Attack coordinates
	*/
	this.attack = function(x,y) {
		if (this.checkPosition(x,y)) {
			this.grid[x][y] = 3;
		}
		else {
			this.grid[x][y] = 2;
		}
	};

	/**
	 * Sets boat on grid
	 * @param {object boat} boat Boat object
	 * @this {battleship}
	 */
	this.setBoat = function (boat) {
		if (boat.isSet) {
			// Error: boat is already set on grid
		}
		if (boat.coordinatesList[boat.size-1] == [0,0]) {
			// Error: coordinates not set ...
		}
		for (var i = 0; i < boat.coordinatesList.length; i++) {
			if (!isInGrid(boat.coordinatesList[i])) {
				//Grid problem not in grid
			}
			if (!isZoneAvailable(boat.coordinatesList[i], this.grid)) {
				// Zone problem
			}
		}
		switch (boat.direction) {
			case 'down':
				for (var i = 0; i < boat.size; i++) {
					this.grid[boat.coordinates[0] + i][boat.coordinates[1]];
				}

				break;
			case 'right':
			for (var i = 0; i < boat.size; i++) {
				this.grid[boat.coordinates[0]][boat.coordinates[1] + i];
			}
				break;
		}
		boat.isSet = true;
	};

};

/**
 * Test to check wether the boat can be placed on these coordinates
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

module.exports = {battleship, boat};
