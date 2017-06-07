// Connect client to socket.io
var socket = io();

Vue.http.options.emulateJSON = true;

// Create a vue holding the list of all available games
var listGames = new Vue({

	// We want to target the div with an id of 'events'
	el: '#listGames',

	// Here we can register any values or collections that hold data
	// for the application
	data: {
		gamesList : {},
		picked : ''
	},

	// This function is called only when the vue instance is created
	created: function() {
		socket.on('listGames', function(availableGames) {
			this.gamesList  = availableGames;
			//console.log(this.gamesList); // FOR DEBUG
		}.bind(this));
	},

	// Methods we want to use in our application are registered here
	methods: {
		Choose: function(event) {
			if (this.picked == '') {
				alert('Please choose a game from the list');
			}
			else {
				this.$http.post('/join/game', {picked: this.picked})
					.then(function(response) {
						window.location.href = response.data.redirect;
					});
				}
			}
		}
	});