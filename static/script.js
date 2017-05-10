function action(row, column){
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      document.write(request.response);
      document.close();
    }
  };
  request.open("GET", "game/battleship?row=" + row + "&column=" + column);
  request.send(null);
};