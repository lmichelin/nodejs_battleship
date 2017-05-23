function action(row, column){
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      console.log(request.response);
      document.write(request.response);
      document.close();
    }
  };

  request.open("POST", "game/post");
  var coordinates = { "row":row, "column":column };
  console.log(JSON.stringify(coordinates));
  request.setRequestHeader("Content-Type", "application/X-www-form-urlencoded");
  request.send("coordinates=" + JSON.stringify(coordinates));
}

function setboat(boat, size) {
  var current_boat = battleship.boats[boat];
  console.log(current_boat);
}


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
