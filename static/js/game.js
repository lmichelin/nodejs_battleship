// Connect client to socket.io
var socket = io();

Vue.http.options.emulateJSON = true;

// Create a vue holding the list of all available games
var game = new Vue({

	// We want to target the div with an id of 'game'
	el: '#game',

	// Game data to be tranfered on the webpage
	data: {
		// Player battleship object (see battleship.js for more information)
		battleship : {grid: [], attack_grid: []},
		errors: [],
	},

	// This function is called only when the vue instance is created
	created: function() {
		// On our or enemy attack, update the battleship object
		socket.on('attack', function(response) {
			this.battleship  = response.battleship;
		}.bind(this));

		// Get battleship data with grid and boats
        this.$http.get('/game/getBattleship').then(function(response) {
            this.battleship = response.body.battleship;
        });
	},

	// Methods we want to use in our application are registered here
	methods: {
		// Attack enemy cell on click
		attack: function(event) {
			var row = event.target.parentgetAttribute('value')
			console.log(event.target.getAttribute('value'));
		},

		attackCellClass: function(row, col) {
			var result = {};
			// Check if the grid is not undefined ! This will happen before we get updated data from the server
			if (this.battleship.attack_grid[row-1]) { // row-1 IMPORTANT
				// Return a class according to the cell value
				switch (this.battleship.attack_grid[row-1][col-1]) { // row - 1 and col - 1 because the for loop in the webpage loops from 1 to 10 ...
					case 0:
						result = {'btn-info': true};
						break;
					case 1:
						result = {'btn-default': true};
						break;
					case 2:
						reult = {'btn-success': true};
						break;
					case 3:
						result = {'btn-warning': true};
						break;
					case 4:
						result = {'btn-danger': true};
						break;
					default:
						result = {};
						break;
				}
				return result;
			}
			else {
				return result;
			}
		},

		myCellClass: function(row, col) {
			var result = {};
			// Check if the grid is not undefined ! This will happen before we get updated data from the server
			if (this.battleship.grid[row-1]) {
				// Return a class according to the cell value
				switch (this.battleship.grid[row-1][col-1]) {
					case 0:
						result = {'btn-info': true};
						break;
					case 1:
						result = {'btn-default': true};
						break;
					case 2:
						reult = {'btn-success': true};
						break;
					case 3:
						result = {'btn-warning': true};
						break;
					case 4:
						result = {'btn-danger': true};
						break;
					default:
						result = {};
						break;
				}
				return result;
			}
			else {
				return result;
			}
		},

	},
});