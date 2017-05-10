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
  var command = { "row":row, "column":column }
  request.setRequestHeader("Content-Type", "application/X-www-form-urlencoded");
  request.send("command=" + JSON.stringify(command));
}
