Vue.http.options.emulateJSON = true;

// Vue that holds the battleship grid and all the boats of our page
var boats = new Vue({

    // We want to target the div with an id of 'events'
    el: "#boats",

    data: {
        battleship: {grid: []},
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
                //containment : '#grid',
                snap: '.case',
                grid: [43, 43],
                revert: 'invalid'
            });
        },

        //Make grid droppable
        makeDroppable: function() {
            $('#grid').droppable({ // ce bloc servira de zone de dépôt
                drop: function(event, ui) {
                    var pos_left = ui.draggable.offset().left;
                    var pos_top = ui.draggable.offset().top;
                    console.log(pos_left, pos_top);
                    // var pos = $("#grid > .divTableBody > .divTableRow[value='" + 5 + "']").offset().top;
                    // console.log(pos);
                    boats.findCase(pos_left, pos_top);
                }
            });
        },

        //Initialize drag and drop
        initializeDragAndDrop: function() {
            this.makeDraggable();
            this.makeDroppable();
        },

        // match boat cell with grid cell ...
        findCase: function(left, top) {
            for (var i = 1; i <= this.battleship.grid.length; i++) {
                var pos_top = $("#grid > .divTableBody > .divTableRow[value='" + i + "']").offset().top;
                if (pos_top == top) {
                    break;
                }
            }
            for (var j = 1; j <= this.battleship.grid.length; j++) {
                var pos_left = $("#grid > .divTableBody > .divTableRow[value='" + i + "'] > .divTableCell[value='" + j + "']").offset().left;
                console.log(left, pos_left, top, pos_top);
                if (pos_left == left) {
                    break;
                }
            }
            console.log(String.fromCharCode(64 + j), i, j);
        }
    },
});