function showFoodPlaces() {
  var xhttp;
  if (window.XMLHttpRequest) {
      xhttp = new XMLHttpRequest();
      } else {
      // code for IE6, IE5
      xhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  //Uncomment below when developing
  //xhttp.open("GET", "http://localhost:8080/fetch/dining", true);

  //Uncomment below for pushing to github/heroku
  xhttp.open("GET", "https://tigermaps.herokuapp.com/fetch/dining", true);

  xhttp.onreadystatechange = handleReadyStateChange;
  xhttp.send(null);

  function handleReadyStateChange() {
    if (xhttp.readyState == 4) {
      if (xhttp.status == 200) {
        //update html :)
        var dining = JSON.parse(xhttp.response);
        //console.log(JSON.stringify(dining));
        //console.log(typeof(dining));


        //unhighlight previousHighlights
        for (var i = 0; i < previousHighlights.length; i++) {
            previousHighlights[i].setOptions({
                strokeOpacity: 0.01,
                fillOpacity: 0.01
            });
        }

        //reset previousHighlights
        previousHighlights = [];

        //find current toggle buildings
        dining.forEach(function(dhall) {
          var champion = null;
          var minimum = Number.MAX_VALUE;
          var contender = Number.MAX_VALUE;

          for (var i = 0; i < polygons.length; i++) {
              contender = Math.sqrt((polygons[i].center.lat() - dhall["latitude"])**2 + (polygons[i].center.lng() - dhall["longitude"])**2);
              if (contender < minimum) {
                  champion = polygons[i].polygon;
                  minimum = contender;
              }
          }

          //highlight the winner and add to previousList
          if (champion != null) { 
            previousHighlights.push(champion);

            champion.setOptions({
                strokeOpacity: 0.8,
                fillOpacity: 0.35
            });
          }
        });
      }
    }
  }


}
