var events = 0;
var food = 0;
var laundry = 0;
var printer = 0;
var toggled = false;
var count_options = 0;
var event_dict = {};
var do_once = true;

function loggedIn() {
  if ($('#notLoggedIn').css('display') == 'none') {
    return true;
  } else {
    return false;
  }
}

function showEventInfo(entry) {
  var champion = getNearestPolygon(entry["latitude"],entry["longitude"]);

  //create content
  var content = "";
  if ("title" in entry) {
    content = content + "<p style='text-align:center'>" + entry["title"] + "<br>";
  }
  if ("locationName" in entry) {
    content = content + entry["locationName"] + "<br>";
  }
  if ("startTime" in entry) {
    content = content + "<br>Start Time: " + entry["startTime"] + "<br>";
  }
  if ("endTime" in entry) {
    content = content + "End Time: " + entry["endTime"] + "<br>";
  }
  if ("description" in entry) {
    if (entry["description"] != null) {
      content = content + "<br>Description: " + entry["description"] + "<br></p>";
    }             
  }
  
  //show the marker and add listener
  if (champion != null) {
    champion.marker.setVisible(true);      
    champion.marker.addListener('click', function(event) {
        showMarkerInfo(event, this, content);
    });
  } 
}

//below function provided by 
//http://stackoverflow.com/questions/30022728/perform-action-when-clicking-html5-datalist-option
function listenForSelection() {
  var val = $('#new-input').value;
  var opts = $('#titles').childNodes;
  for (var i = 0; i < opts.length; i++) {
    if (opts[i].value === val) {
      // An item was selected from the list!
      if (val in event_dict) {
        showEventInfo(event_dict[val]);
      }
      break;
    }
  }
}

function toggleSearch() {
  if (toggled) { //currently searching for events
    $('#toggle_search').html('Places');
    $('#new-input').css('display','none');
    $('#pac-input').css('display','initial');
    toggled = false;

    //unpopulate dataList
    var dataList = $('#titles');
    var input = $('#new-input');

    //removes all child elements
    //dataList.remove();
  } else {
    $('#toggle_search').html('Events');
    $('#pac-input').css('display','none');
    $('#new-input').css('display','initial');
    toggled = true;

    if (do_once) {
      do_once = false;

      //populate dataList
      var dataList = $('#titles');
      var input = $('#new-input');

      var xhttp;
      if (window.XMLHttpRequest) {
          xhttp = new XMLHttpRequest();
          } else {
          // code for IE6, IE5
          xhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }

      var hostname = window.location.hostname;
      if (hostname.search('tigermaps')  != -1) {
          if (loggedIn()) {
            xhttp.open("GET", "https://tigermaps.herokuapp.com/fetch/usgEvents", true);
          } else {
            xhttp.open("GET", "https://tigermaps.herokuapp.com/fetch/puEvents", true);
          }     
      } else {
          if (loggedIn()) {
            xhttp.open("GET", "http://localhost:8080/fetch/usgEvents", true);
          } else {
            xhttp.open("GET", "http://localhost:8080/fetch/puEvents", true); 
          }      
      }

      xhttp.onreadystatechange = handleReadyStateChange;
      xhttp.send(null);

      function handleReadyStateChange() {
        if (xhttp.readyState === 4) {
          if (xhttp.status === 200) {
            // Parse the JSON
            var jsonOptions = JSON.parse(xhttp.response);

            // Loop over the JSON array.
            jsonOptions.forEach(function(entry) {
              if ("title" in entry) {

                // Add the <option> element to the <datalist>.
                dataList.append("<option value=" + entry['title'].replace(/\s/g,'') + ">");
                var toAdd = {};
                //store the relevant information for future reference
                toAdd["latitude"] = entry["latitude"];
                toAdd["longitude"] = entry["longitude"];

                if ("locationName" in entry) {
                  toAdd["locationName"] = entry["locationName"];
                }
                if ("startTime" in entry) {
                  toAdd["startTime"] = entry["startTime"];
                }
                if ("endTime" in entry) {
                  toAdd["endTime"] = entry["endTime"];
                }
                if ("description" in entry) {
                  if (entry["description"] != null) {
                    toAdd["description"] = entry["description"];
                  }             
                }

                event_dict[entry['title'].replace(/\s/g,'')] = toAdd;

              }

            });

          } else {
          // An error occured :(
          console.log("Couldn't load datalist options :(");
          }
        } else {
          // An error occured :(
          console.log("Couldn't load datalist options :(");
        } 
      }   
    } //do_once end
  }
}

    

function unhighlightAll() {
  //unhighlight previousHighlights
  for (var i = 0; i < previousHighlights.length; i++) {

      //unhilight polygon
      previousHighlights[i].polygon.setOptions({
          strokeOpacity: 0.01,
          fillOpacity: 0.01
      });

      //remove old marker and add new one to get rid of listener
      var old_marker = previousHighlights[i].marker;
      var new_marker = new google.maps.Marker({
           position: old_marker.getPosition(),
           map: old_marker.getMap(),
           name: old_marker.name,
           visible: old_marker.getVisible()
      });

      old_marker.setMap(null);
      new_marker.setVisible(false);

      previousHighlights[i]['marker'] = new_marker;
  }

  //reset previousHighlights
  previousHighlights = [];
}

function getNearestPolygon(lat, lng) {
  var champion = null;
  var minimum = Number.MAX_VALUE;
  var contender = Number.MAX_VALUE;

  for (var i = 0; i < polygons.length; i++) {
      contender = Math.sqrt((polygons[i].center.lat() - lat)**2 + (polygons[i].center.lng() - lng)**2);
      if (contender < minimum) {
          champion = polygons[i];
          minimum = contender;
      }
  }

  //highlight the winner and add to previousList
  if (champion != null) { 
    previousHighlights.push(champion);

    champion.polygon.setOptions({
        strokeOpacity: 0.8,
        fillOpacity: 0.35
    });
  }

  return champion;
}

function showFoodPlaces() {
  if (food != 1) { //first time clicking (add all)
    food = 1;
    $('#food_button').css('background-color', '#ffb347');
  } else { 
    //second time clicking (remove all)
    food = 0;
    $('#food_button').css('background-color', '#fff');
    unhighlightAll();
  }

  if (food == 1) { //first time clicking
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
        } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //Uncomment below when developing
    var hostname = window.location.hostname;
    if (hostname.search('tigermaps')  != -1) {
      xhttp.open("GET", "https://tigermaps.herokuapp.com/fetch/dining", true);
    } else {
      xhttp.open("GET", "http://localhost:8080/fetch/dining", true); 
    }

    xhttp.onreadystatechange = handleReadyStateChange;
    xhttp.send(null);

    function handleReadyStateChange() {
      if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
          //update html :)
          var dining = JSON.parse(xhttp.response);
          //console.log(JSON.stringify(dining));
          //console.log(typeof(dining));

          //find current toggle buildings
          dining.forEach(function(dhall) {
            var champion = getNearestPolygon(dhall["latitude"],dhall["longitude"]);

            //create content
            var content = "";
            var day = null;
            var d = new Date();
            if (d.getDay() == 0) {day = "Sunday";}
            else if (d.getDay() == 1) {day = "Monday";}
            else if (d.getDay() == 1) {day = "Tuesday";}
            else if (d.getDay() == 1) {day = "Wednesday";}
            else if (d.getDay() == 1) {day = "Thursday";}
            else if (d.getDay() == 1) {day = "Friday";}
            else {day = "Saturday";}

            content = content + "<p style='text-align:center'>" + dhall["name"] + "<br>" + dhall["building_name"] + "<br><br>";
            if (day != null) {
              var days = dhall["times"]["day"];
              var toAdd = "";
              days.forEach(function(day_dict){
                if (day_dict["name"] == day) {
                  //console.log("good");
                  var sessions = day_dict["sessions"]["session"];
                  sessions.forEach(function(sesh){
                    toAdd = toAdd + sesh["name"] + " : " + sesh["hourset"] + "<br>";
                  });
                }
              });
              content = content + toAdd;
            }
            content = content + "<br><a target='_blank' href='https://campusdining.princeton.edu/dining/_foodpro/location.asp'>Check Out The Menu</a></p>";

            //show the marker and add listener
            if (champion != null) {
              champion.marker.setVisible(true);      
              champion.marker.addListener('click', function(event) {
                  showMarkerInfo(event, this, content);
              });
            } 

          });
        }
      }
    } //end of handleReadyStateChange()

  } //end of if statement
} // end of function

function showPrinterPlaces() {
  if (printer != 1) { //first time clicking (add all)
    printer = 1;
    $('#printer_button').css('background-color', '#ffb347');
  } else { 
    //second time clicking (remove all)
    printer = 0;
    $('#printer_button').css('background-color', '#fff');
    unhighlightAll();
  }

  if (printer == 1) { //first time clicking
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
        } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //Uncomment below when developing
    var hostname = window.location.hostname;
    if (hostname.search('tigermaps')  != -1) {
      xhttp.open("GET", "https://tigermaps.herokuapp.com/fetch/printers", true);
    } else {
      xhttp.open("GET", "http://localhost:8080/fetch/printers", true); 
    }

    xhttp.onreadystatechange = handleReadyStateChange;
    xhttp.send(null);

    function handleReadyStateChange() {
      if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
          //update html :)
          var printers = JSON.parse(xhttp.response);
          //console.log(JSON.stringify(dining));
          //console.log(typeof(dining));

          //find current toggle buildings
          printers.forEach(function(entry) {
            var champion = getNearestPolygon(entry["latitude"],entry["longitude"]);

            //create content
            var content = "";

            content = content + "<p style='text-align:center'>" + entry["name"] + "<br>" + entry["building_name"] + "<br><br>";
            if ("attributes" in entry) {
              if ("attribute" in entry["attributes"]) {
                var obj = entry["attributes"]["attribute"];
                if (Array.isArray(obj)) {
                  obj.forEach(function(current_dict){
                    content = content + current_dict["name"] + " : " + current_dict["value"] + "<br>";
                  });
                } else {
                  content = content + obj["name"] + " : " + obj["value"] + "<br>";
                }

              }
            }

            //show the marker and add listener
            if (champion != null) {
              champion.marker.setVisible(true);      
              champion.marker.addListener('click', function(event) {
                  showMarkerInfo(event, this, content);
              });
            } 

          });
        }
      }
    } //end of handleReadyStateChange()

  } //end of if statement
} // end of function

function showLaundryPlaces() {
  if (laundry != 1) { //first time clicking (add all)
    laundry = 1;
    $('#laundry_button').css('background-color', '#ffb347');
  } else { 
    //second time clicking (remove all)
    laundry = 0;
    $('#laundry_button').css('background-color', '#fff');
    unhighlightAll();
  }

  if (laundry == 1) { //first time clicking
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
        } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //Uncomment below when developing
    var hostname = window.location.hostname;
    if (hostname.search('tigermaps')  != -1) {
      xhttp.open("GET", "https://tigermaps.herokuapp.com/fetch/laundry", true);
    } else {
      xhttp.open("GET", "http://localhost:8080/fetch/laundry", true); 
    }

    xhttp.onreadystatechange = handleReadyStateChange;
    xhttp.send(null);

    function handleReadyStateChange() {
      if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
          //update html :)
          var laundry = JSON.parse(xhttp.response);
          //console.log(JSON.stringify(dining));
          //console.log(typeof(dining));

          //find current toggle buildings
          laundry.forEach(function(entry) {
            var champion = getNearestPolygon(entry["latitude"],entry["longitude"]);

            //create content
            var content = "";

            content = content + "<p style='text-align:center'>" + entry["name"] + "<br>" + entry["building_name"] + "<br><br>";
            if ("attributes" in entry) {
              if ("attribute" in entry["attributes"]) {
                var obj = entry["attributes"]["attribute"];
                if (Array.isArray(obj)) {
                  obj.forEach(function(current_dict){
                    if (current_dict["name"] == "LaundryView") {
                      content = content + current_dict["name"] + " : <a target='_blank' href='" + current_dict["value"] + "'>Link</a><br>";
                    } else {
                      content = content + current_dict["name"] + " : " + current_dict["value"] + "<br>";
                    }
                  });
                } else {
                  if (current_dict["name"] == "LaundryView") {
                    content = content + current_dict["name"] + " : <a target='_blank' href='" + current_dict["value"] + "'>Link</a><br>";
                  } else {
                    content = content + current_dict["name"] + " : " + current_dict["value"] + "<br>";
                  }
                }

              }
            }

            //show the marker and add listener
            if (champion != null) {
              champion.marker.setVisible(true);      
              champion.marker.addListener('click', function(event) {
                  showMarkerInfo(event, this, content);
              });
            } 

          });
        }
      }
    } //end of handleReadyStateChange()

  } //end of if statement
} // end of function

function showEventPlaces() {
  if (events != 1) { //first time clicking (add all)
    events = 1;
    $('#event_button').css('background-color', '#ffb347');
  } else { 
    //second time clicking (remove all)
    events = 0;
    $('#event_button').css('background-color', '#fff');
    unhighlightAll();
  }

  if (events == 1) { //first time clicking
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
        } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //Uncomment below when developing
    var hostname = window.location.hostname;
    if (hostname.search('tigermaps')  != -1) {
        if (loggedIn()) {
          xhttp.open("GET", "https://tigermaps.herokuapp.com/fetch/usgEvents", true);
        } else {
          xhttp.open("GET", "https://tigermaps.herokuapp.com/fetch/puEvents", true);
        }     
    } else {
        if (loggedIn()) {
          xhttp.open("GET", "http://localhost:8080/fetch/usgEvents", true);
        } else {
          xhttp.open("GET", "http://localhost:8080/fetch/puEvents", true); 
        }      
    }

    xhttp.onreadystatechange = handleReadyStateChange;
    xhttp.send(null);

    function handleReadyStateChange() {
      if (xhttp.readyState == 4) {
        if (xhttp.status == 200) {
          //update html :)
          var puEventsList = JSON.parse(xhttp.response);
          //console.log(JSON.stringify(puEventsList));
          //console.log(typeof(dining));

          //find current toggle buildings
          puEventsList.forEach(function(entry) {
            showEventInfo(entry);
          });
        }
      }
    } //end of handleReadyStateChange()

  } //end of if statement
} // end of function

