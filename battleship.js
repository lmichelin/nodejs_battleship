
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
		[1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
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
		if (array[x][y] == 1) {
			return true;
		}
		else {
			return false;
		}
	};	

	/** Attack function: Will either hit or miss target. Changes the value of the grid: 0 is water, 1 is boat, 2 is test but miss, 3 is test with a hit ...
	* @this {battleship}
	* @param {tuple} (x,y) Attack coordinates
	*/
	this.attack = function(x,y) {
		if (checkPosition(x,y)) {
			this.grid[x][y] = 3;
		}
		else {
			this.grid[x][y] = 2;
		}
	};

};

module.exports = battleship;