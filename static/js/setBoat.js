Vue.http.options.emulateJSON = true;

// Vue that holds the battleship grid and all the boats of our page
var boats = new Vue({

    // We want to target the div with an id of 'events'
    el: "#boats",

    data: {
        battleship: {grid: []},
        errors: [],
    },

    // These functions are called only when the vue instance is created
    mounted: function() {
        // Get battleship data with grid and boats
        this.$http.get('/setBoats/getBoats').then(function(response) {
            this.battleship = response.body.battleship;
        });

        // Initialize drag and drop 500 ms after page load (IMPORTANT for Firefox compatibility)
        $(document).ready(function() {
            window.setTimeout(boats.initializeDragAndDrop, 500);
        });
    },

    methods: {
        //Make the boats draggable
        makeDraggable: function() {
            $('.draggable').draggable({
                containment : 'document',
                snap: '.case',
                snapMode: 'inner',
                revert : 'invalid',
            });
        },

        //Make grid droppable
        makeDroppable: function() {
            $('#grid').droppable({ // ce bloc servira de zone de dépôt

                // What to do after drop (on drop)
                drop: function(event, ui) {

                    // Get the draggable element (boat) position on the window (in pixels)
                    var pos_left = ui.offset.left;
                    var pos_top = ui.offset.top;

                    // Get the name of the boat that is being dragged
                    var boat_name = ui.draggable.attr('id');

                    // Set a direction (right for now)
                    var direction = 'right';

                    // Execute function to see if there are errors in boat position
                    var errors = boats.isBoatPositionNotValid(boat_name, pos_left, pos_top, direction);

                    if (errors) {
                        // Revert boat (move the boat back to its original position)
                        ui.draggable.draggable('option','revert',true); 
                        console.log(errors);
                    }
                    else {
                        // Set the boat on the droppable element 
                        ui.draggable.draggable('option','revert','invalid');

                        // Set the boat on the grid
                        boats.setBoatOnGrid(boat_name);
                        console.log(boats.battleship.grid);
                    }
                }
            });
        },

        //Initialize drag and drop
        initializeDragAndDrop: function() {
            this.makeDraggable();
            this.makeDroppable();
        },

        // match boat cell with grid cell and return grid coordinates
        findCase: function(left, top) {
            for (var i = 1; i <= this.battleship.grid.length; i++) { // IMPORTANT We need 11 values here ! If we reach the last value, it would mean that no cells matched coordinates
                var pos_top = $("#grid > .divTableBody > .divTableRow[value='" + i + "']").offset().top;
                if (pos_top == top) {
                    break;
                }
            }
            var k = Math.min(i, 10); // If there are no matches within the rows, set i back to 10 so that the rows don't return UNDEFINED
            for (var j = 1; j <= this.battleship.grid.length; j++) { // IMPORTANT We need 11 values here ! If we reach the last value, it would mean that no cells matched coordinates
                var pos_left = $("#grid > .divTableBody > .divTableRow[value='" + k + "'] > .divTableCell[value='" + j + "']").offset().left;
                //console.log(left, pos_left, top, pos_top);
                if (pos_left == left) {
                    break;
                }
            }
            console.log(String.fromCharCode(64 + j), i);
            return [i-1, j-1]; // If j-1 
        },

        /**
         * Check whether the boat's position is valid or not according to the rules of the game
         * @param  {String}  boat_name Name of the boat to be checked
         * @param  {Float}  left      Left coordinates
         * @param  {Float}  top       Top coordinates
         * @param  {String}  direction Direction of the boat: can be 'right' or 'down'
         * @return {Boolean}           Return errors array containing all error messages or false if there are no errors
         */
        isBoatPositionNotValid: function(boat_name, left, top, direction) {
            var errors = [];

            // Get our initial coordinates of the boat on the grid
            var coordinates = this.findCase(left, top);
            if (coordinates[0] == this.battleship.grid.length || coordinates[1] == this.battleship.grid.length) {
                errors.push(boat_name + ' is not in grid');
                console.log('Error because of match problem between pixels of the window and the array coordinates');
                return errors;
            }

            var boat = this.battleship.boats[boat_name];
            //console.log('Boat coordinatesList: ' + this.battleship.boats[boat_name].coordinatesList);

            // Set these coordinates in boat object
            this.setBoatPosition(boat_name, coordinates, direction);

            //Set all boat coordinates in the boat object
            this.setBoatCoordinatesList(boat_name);

            
            // console.log('Boat position: ' + boat.coordinates + ' ' + boat.direction); // FOR DEBUGS
            // console.log('Boat coordinatesList: ' + boat.coordinatesList); // FOR DEBUG
            for (var i = 0; i < boat.coordinatesList.length; i++) {
                if (!this.isInGrid(boat.coordinatesList[i])) {
                    errors.push(boat.name + ' is not in grid');
                    console.log('unbelievable error');
                    break;
                }
                if (!this.isZoneAvailable(boat.coordinatesList[i])) {
                    errors.push('Zone error, ' + boat.name + ' will be too close to another ship');
                    break;
                }
            }
            if (errors.length == 0) {
                return false;
            }
            return errors;
        },

        /**
         * Set position of the boat
         * @param {String} boat_name Boat name that has to be placed
         * @param {tuple} initial_coordinates Coordinates of the position of the first case
         * @param {string} direction can be 'right', 'down'
         */
        setBoatPosition: function(boat_name, initial_coordinates, direction) {
            this.battleship.boats[boat_name].coordinates = initial_coordinates;
            this.battleship.boats[boat_name].direction = direction;
        },

        /**
         * Set the coordinatesList equal to the position of the boat when a initial position and direction have been chosen
         * @param {String} boat_name Name of the boat whose coordinates have to be set
         */
        setBoatCoordinatesList: function(boat_name) {
            var boat = this.battleship.boats[boat_name];
            boat.coordinatesList[0] = boat.coordinates;
            switch (boat.direction) {
                case 'down':
                    for (var i = 0; i < boat.size; i++) {
                        boat.coordinatesList[i] = [boat.coordinates[0] + i, boat.coordinates[1]];
                    }
                    break;
                case 'right':
                    for (var i = 0; i < boat.size; i++) {
                        boat.coordinatesList[i] = [boat.coordinates[0], boat.coordinates[1] + i];
                    }
                    break;
            }
        },

        /**
         * Test to check wether these coordinates can be placed on the grid
         * @param  {tuple}  coordinates coordinates of the zone
         * @return {Boolean}
         */
        isInGrid: function(coordinates) {
            if (Math.min(9, Math.max(coordinates[0],0)) != coordinates[0] ) {
                return false;
            }
            if (Math.min(9, Math.max(coordinates[1],0)) != coordinates[1] ) {
                return false;
            }
            return true;
        },

        /**
         * Checks wether the zone is availbale in and around the zone
         * @param  {tuple}  coordinates Coordinates of the zone
         * @param  {Array}  currentGrid Player gris
         * @return {Boolean}             false or true
         */
        isZoneAvailable: function(coordinates) {
            console.log(coordinates);
            var x = coordinates[0];
            var y = coordinates[1];

            for (var i = x-1; i <= x+1; i++) {
                for (var j = y-1; j <= y+1; j++) {
                    if (i>=0 && i<=9 && j>=0 && j<=9) {
                        console.log(this.battleship);
                        if (this.battleship.grid[i][j] != 0) {
                            console.log('it returned false !!');
                            return false;
                        }
                    }
                }
            }
            return true;
        },

        /**
         * Set the boat on the battleship grid ... This will set the isSet variable of the boat to true !
         * @param {String} boat_name The name of the boat that will be set on the grid
         */
        setBoatOnGrid: function(boat_name) {
            var boat = this.battleship.boats[boat_name];
            for (var i = 0; i < boat.size; i++) {
                this.battleship.grid[boat.coordinatesList[i][0]][boat.coordinatesList[i][1]] = 1;
            }
            boat.isSet = true;
        },
    },
});