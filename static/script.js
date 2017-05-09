function action(row, column){
  var request = new XMLHttpRequest();
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      document.write(request.response);
      document.close();
    }
  };
  request.open("GET", "battleship?row=" + row + "&column=" + column);
  request.send(null);
  $.post("battleship/post", function(boat, status){
        alert("Data: " + boat + "\nStatus: " + status);
    });
};

