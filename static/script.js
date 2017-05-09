function action(row, column){
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      document.getElementById("output").innerHTML = request.response;
    }
  };
  request.open("GET", "battleship?row=" + row + "&column=" + column);
  request.send(null);
}
