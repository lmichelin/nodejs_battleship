Vue.http.options.emulateJSON = true;

// Vue that holds the battleship grid and all the boats of our page
var boats = new Vue({

    // We want to target the div with an id of 'events'
    el: "#boats",

    data: {
        battleship: {},
    },

    // These functions are called only when the vue instance is created
    mounted: function() {
        this.$http.get('/setBoats/getBoats').then(function(response) {
            this.battleship = response.body.battleship;
        });
    },

    methods: {
        //Make the boats draggable
        makeDraggable: function() {
            $('#<%=battleship.boats[boat].name%>').draggable({
                snap: '.case',
                grid: [45, 45],
                revert: 'invalid'
            });
        },
    },
});

$('#grid').droppable({ // ce bloc servira de zone de dépôt
    drop: function(event, ui) {
        var pos_left = ui.draggable.offset().left;
        var pos_top = ui.draggable.offset().top;
        findCase(pos_left, pos_top);
    }
});

function findCase(left, top) {
    for (var i = 0; i < battleship.grid.length; i++) {
        var pos_top = $("#grid > tbody > tr[value='" + i + "']").offset().top;
        if (pos_top == top) {
            break;
        }
    }
    for (var j = 0; j < battleship.grid.length; j++) {
        var pos_left = $("#grid > tbody > tr[value='" + i + "'] > td[value='" + j + "']").offset().left;
        if (pos_left == left) {
            break;
        }
    }
    console.log(String.fromCharCode(65 + j), i + 1);
}