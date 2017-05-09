var toggled = false;
var count_options = 0;
var event_dict = {};
var do_once = true;
var last_click = null;

function loggedIn() {
    if ($('#notLoggedIn').css('display') == 'none') {
        return true;
    } else {
        return false;
    }
}

function showEventInfo(entry) {
    // alert(JSON.stringify(entry));
    if (entry["latitude"] == 0 || entry["longitude"] == 0) {
        if ("locationName" in entry) {
            for (var key in event_dict) {
                if (event_dict[key]["locationName"] == entry["locationName"]) {
                    entry["latitude"] = event_dict[key]["latitude"];
                    entry["longitude"] = event_dict[key]["longitude"];
                }
            }
        }
    }

    var proceed = false;

    if ('startTime' in entry && 'endTime' in entry) {
        if (parseInt(entry['startTime'].substring(0, 2)) >= start) {
            if (parseInt(entry['endTime'].substring(0, 2)) <= end) {
                proceed = true;
                console.log('proceed');
            }
        }
    } else {
        proceed = true;
        console.log('proceed');
    }

    if (proceed) {
        if (entry["latitude"] != 0 && entry["longitude"] != 0) {

            var champion = getNearestPolygon(entry["latitude"], entry["longitude"], highlightPolygon);

            //create content
            var content = "";
            content = content + '<div class="iw-subTitle">Events</div>';

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

                if (last_click == null) {
                    if ($('#info_div').css('display') != 'none') { //info div is shown
                        // Center map adjusted
                        var pos = { lat: parseFloat(entry["latitude"]), lng: (parseFloat(entry["longitude"]) - 0.002) };
                        map.panTo(pos);
                    } else {
                        var pos = { lat: parseFloat(entry["latitude"]), lng: (parseFloat(entry["longitude"])) };
                        map.panTo(pos);
                    }
                }


            }
        }
    }
}

$('#new-input').on('input', function() {
    var val = $(this).val();
    unhighlightAll();
    if (val == "") {
        unhighlightAll();
    } else {
        console.log(val);
        if (val in event_dict) {
            showEventInfo(event_dict[val]);
        }
    }
    //var opt = $('option[value="'+$(this).val()+'"]');
    //alert(opt.length ? opt.attr('id') : 'NO OPTION');
});

function timeRange() {
    var dataList = $('#titles');
    dataList.empty();
    if (do_once) { //events haven't been collected yet
        toggleSearch();
    }
    for (key in event_dict) {
        if (parseInt(event_dict[key]['startTime'].substring(0, 2)) >= start) {
            if (parseInt(event_dict[key]['endTime'].substring(0, 2)) <= end) {
                dataList.append("<option value=" + key + ">");
            }
        }
    }
}

function toggleSearch() {
    if (toggled) { //currently searching for events
        //$('#toggle_search').html('Events');
        $('#new-input').css('display', 'none');
        $('#pac-input').css('display', 'initial');
        toggled = false;

        //unpopulate dataList
        var dataList = $('#titles');
        var input = $('#new-input');

        //removes all child elements
        //dataList.remove();
    } else {
        //$('#toggle_search').html('Places');
        $('#pac-input').css('display', 'none');
        $('#new-input').css('display', 'initial');
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
            if (hostname.search('tigermaps') != -1) {
                if (loggedIn()) {
                    //xhttp.open("GET", "https://tigermaps.herokuapp.com/fetch/usgEvents", true);
                    xhttp.open("GET", "https://tigermaps.herokuapp.com/fetch/puEvents", true);
                } else {
                    xhttp.open("GET", "https://tigermaps.herokuapp.com/fetch/puEvents", true);
                }
            } else {
                if (loggedIn()) {
                    //xhttp.open("GET", "http://localhost:8080/fetch/usgEvents", true);
                    xhttp.open("GET", "http://localhost:8080/fetch/puEvents", true);
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

                                event_dict[entry['title'].replace(/\s/g, '')] = toAdd;

                            }

                        });

                        //restrict dataList based on time slider
                        for (key in event_dict) {
                            if (parseInt(event_dict[key]['startTime'].substring(0, 2)) >= start) {
                                if (parseInt(event_dict[key]['endTime'].substring(0, 2)) <= end) {
                                    dataList.append("<option value=" + key + ">");
                                }
                            }
                        }


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

function highlightPolygon(polygon) {
    previousHighlights.push(polygon);
    polygon.polygon.setOptions({
        strokeOpacity: 0.8,
        fillOpacity: 0.35
    });
}

function unhighlightAll() {
    // Clear out the old markers.
    markers.forEach(function(marker) {
        marker.setMap(null);
    });
    markers = [];

    //disperse previousHighlight
    if (previousHighlight != null) {
        previousHighlight.setOptions({
            strokeOpacity: 0.01,
            fillOpacity: 0.01
        });
        previousHighlight = null;
    }

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

// Returns the polygon closest to the given lat-lng pair.
// If a callback is given, calls it on the returned polygon.
function getNearestPolygon(lat, lng, callback) {
    var champion = null;
    var minimum = Number.MAX_VALUE;
    var contender = Number.MAX_VALUE;

    for (var i = 0; i < polygons.length; i++) {
        contender = Math.sqrt((polygons[i].center.lat() - lat) ** 2 + (polygons[i].center.lng() - lng) ** 2);
        if (contender < minimum) {
            champion = polygons[i];
            minimum = contender;
        }
    }

    // Run callback on the champion polygon
    if (champion != null && callback !== undefined && callback !== null) {
        callback(champion);
    }

    return champion;
}

function showFoodPlaces() {
    //clear last_click
    console.log("last click: " + last_click);
    var food = 0;
    if (last_click != null) {
        if (last_click == 'food') {
            food = 1; //downclick event, no other button affected
            $('#' + last_click + '_button').css('background-color', '#fff');
            last_click = null;
        } else { //intercept event, keep change last_click to food
            $('#' + last_click + '_button').css('background-color', '#fff');
            $('#food_button').css('background-color', '#ffb347');
            last_click = 'food';
        }
        unhighlightAll();
    } else { //upclick event
        $('#food_button').css('background-color', '#ffb347');
        last_click = 'food';
    }

    if (food != 1) { //dont highlight food buildings on downclick event
        var xhttp;
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        //Uncomment below when developing
        var hostname = window.location.hostname;
        if (hostname.search('tigermaps') != -1) {
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
                        var champion = getNearestPolygon(dhall["latitude"], dhall["longitude"], highlightPolygon);

                        //create content
                        var content = "";
                        var day = null;
                        var d = new Date();
                        if (d.getDay() == 0) { day = "Sunday"; } else if (d.getDay() == 1) { day = "Monday"; } else if (d.getDay() == 1) { day = "Tuesday"; } else if (d.getDay() == 1) { day = "Wednesday"; } else if (d.getDay() == 1) { day = "Thursday"; } else if (d.getDay() == 1) { day = "Friday"; } else { day = "Saturday"; }

                        content = content + '<div class="iw-subTitle">' + dhall["name"] + "<br>" + dhall["building_name"] + '</div>' + "<p style='text-align:center'>" + "<br><br>";
                        if (day != null) {
                            var days = dhall["times"]["day"];
                            var toAdd = "";
                            days.forEach(function(day_dict) {
                                if (day_dict["name"] == day) {
                                    //console.log("good");
                                    var sessions = day_dict["sessions"]["session"];
                                    sessions.forEach(function(sesh) {
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
    //clear last_click
    console.log("last click: " + last_click);
    var printer = 0;
    if (last_click != null) {
        if (last_click == 'printer') {
            printer = 1; //downclick event, no other button affected
            $('#' + last_click + '_button').css('background-color', '#fff');
            last_click = null;
        } else { //intercept event, keep change last_click to printer
            $('#' + last_click + '_button').css('background-color', '#fff');
            $('#printer_button').css('background-color', '#ffb347');
            last_click = 'printer';
        }
        unhighlightAll();
    } else { //upclick event
        $('#printer_button').css('background-color', '#ffb347');
        last_click = 'printer';
    }

    if (printer != 1) { //first time clicking
        var xhttp;
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        //Uncomment below when developing
        var hostname = window.location.hostname;
        if (hostname.search('tigermaps') != -1) {
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
                        var champion = getNearestPolygon(entry["latitude"], entry["longitude"], highlightPolygon);

                        //create content
                        var content = "";

                        content = content + '<div class="iw-subTitle">' + entry["name"] + "<br>" + entry["building_name"] + '</div>' + "<p style='text-align:center'>" + "<br><br>";
                        if ("attributes" in entry) {
                            if ("attribute" in entry["attributes"]) {
                                var obj = entry["attributes"]["attribute"];
                                if (Array.isArray(obj)) {
                                    obj.forEach(function(current_dict) {
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
    //clear last_click
    console.log("last click: " + last_click);
    var laundry = 0;
    if (last_click != null) {
        if (last_click == 'laundry') {
            laundry = 1; //downclick event, no other button affected
            $('#' + last_click + '_button').css('background-color', '#fff');
            last_click = null;
        } else { //intercept event, keep change last_click to laundry
            $('#' + last_click + '_button').css('background-color', '#fff');
            $('#laundry_button').css('background-color', '#ffb347');
            last_click = 'laundry'
        }
        unhighlightAll();
    } else { //upclick event
        $('#laundry_button').css('background-color', '#ffb347');
        last_click = 'laundry';
    }

    if (laundry != 1) { //first time clicking
        var xhttp;
        if (window.XMLHttpRequest) {
            xhttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        //Uncomment below when developing
        var hostname = window.location.hostname;
        if (hostname.search('tigermaps') != -1) {
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
                        var champion = getNearestPolygon(entry["latitude"], entry["longitude"], highlightPolygon);

                        //create content
                        var content = "";

                        content = content + '<div class="iw-subTitle">' + entry["name"] + "<br>" + entry["building_name"] + '</div>' + "<p style='text-align:center'>" + "<br><br>";

                        if ("attributes" in entry) {
                            if ("attribute" in entry["attributes"]) {
                                var obj = entry["attributes"]["attribute"];
                                if (Array.isArray(obj)) {
                                    obj.forEach(function(current_dict) {
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

function showEvents() {
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    //Uncomment below when developing
    var hostname = window.location.hostname;
    if (hostname.search('tigermaps') != -1) {
        if (loggedIn()) {
            //xhttp.open("GET", "https://tigermaps.herokuapp.com/fetch/usgEvents", true);
            xhttp.open("GET", "https://tigermaps.herokuapp.com/fetch/puEvents", true);
        } else {
            xhttp.open("GET", "https://tigermaps.herokuapp.com/fetch/puEvents", true);
        }
    } else {
        if (loggedIn()) {
            //console.log('loggedin');
            //xhttp.open("GET", "http://localhost:8080/fetch/usgEvents", true);
            xhttp.open("GET", "http://localhost:8080/fetch/puEvents", true);
        } else {
            //console.log('not loggedin');
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
}

function showEventPlaces() {
    //clear last_click
    console.log("last click: " + last_click);
    var events = 0;
    if (last_click != null) {
        if (last_click == 'events') {
            events = 1; //downclick event, no other button affected
            $('#' + last_click + '_button').css('background-color', '#fff');
            last_click = null;
        } else { //intercept event, keep change last_click to events
            $('#' + last_click + '_button').css('background-color', '#fff');
            $('#events_button').css('background-color', '#ffb347');
            last_click = 'events';
        }
        unhighlightAll();
    } else { //upclick event
        $('#events_button').css('background-color', '#ffb347');
        last_click = 'events';
    }

    if (events != 1) { //first time clicking
        showEvents();
    } //end of if statement
} // end of function



function parseEventInfo(event) {
    //create content
    var content = "";
    content = content + '<div class="iw-subTitle">Events</div>';
    if ("title" in event) {
        content = content + event["title"] + "<br>";
    }
    if ("locationName" in event) {
        content = content + event["locationName"] + "<br>";
    }
    if ("startTime" in event) {
        content = content + "<br>Start Time: " + event["startTime"] + "<br>";
    }
    if ("endTime" in event) {
        content = content + "End Time: " + event["endTime"] + "<br>";
    }
    if ("description" in event) {
        if (event["description"] != null) {
            content = content + "<br>Description: " + event["description"] + "<br>";
        }
    }
    return content;
}

function parsePrinterInfo(printer) {
    var content = "";

    content = content + '<div class="iw-subTitle">' + printer["name"] + "<br>" + printer["building_name"] + '</div>' + "<p style='text-align:center'>" + "<br><br>";

    if ("attributes" in printer) {
        if ("attribute" in printer["attributes"]) {
            var obj = printer["attributes"]["attribute"];
            if (Array.isArray(obj)) {
                obj.forEach(function(current_dict) {
                    content = content + current_dict["name"] + " : " + current_dict["value"] + "<br>";
                });
            } else {
                content = content + obj["name"] + " : " + obj["value"] + "<br>";
            }
        }
    }
    return content;
}

function parseLaundryInfo(laundry) {
    var content = '<div class="iw-subTitle">' + laundry["name"] + "<br>" + laundry["building_name"] + '</div>' + "<p style='text-align:center'>" + "<br><br>";

    if ("attributes" in laundry) {
        if ("attribute" in laundry["attributes"]) {
            var obj = laundry["attributes"]["attribute"];
            if (Array.isArray(obj)) {
                obj.forEach(function(current_dict) {
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
    return content;
}

function parseDiningInfo(dhall) {
    var content = "";
    var day = null;
    var d = new Date();
    if (d.getDay() == 0) { day = "Sunday"; } else if (d.getDay() == 1) { day = "Monday"; } else if (d.getDay() == 1) { day = "Tuesday"; } else if (d.getDay() == 1) { day = "Wednesday"; } else if (d.getDay() == 1) { day = "Thursday"; } else if (d.getDay() == 1) { day = "Friday"; } else { day = "Saturday"; }

    content = content + '<div class="iw-subTitle">' + dhall["name"] + "<br>" + dhall["building_name"] + '</div>' + "<p style='text-align:center'>" + "<br><br>";
    if (day != null) {
        var days = dhall["times"]["day"];
        var toAdd = "";
        days.forEach(function(day_dict) {
            if (day_dict["name"] == day) {
                //console.log("good");
                var sessions = day_dict["sessions"]["session"];
                sessions.forEach(function(sesh) {
                    toAdd = toAdd + sesh["name"] + " : " + sesh["hourset"] + "<br>";
                });
            }
        });
        content = content + toAdd;
    }
    content = content + "<br><a target='_blank' href='https://campusdining.princeton.edu/dining/_foodpro/location.asp'>Check Out The Menu</a>";
    return content;
}

function getBuildingInfo(buildingName, lat, lng, callback) {
    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    var hostname = window.location.hostname;
    var fetchURL = "https://tigermaps.herokuapp.com/fetch/buildingInfo?buildingName=" +
        buildingName +
        "&lat=" + lat + "&lng=" + lng;

    if (hostname.search('tigermaps') == -1) {
        var fetchURL = "http://localhost:8080/fetch/buildingInfo?buildingName=" +
            buildingName +
            "&lat=" + lat + "&lng=" + lng;
    }
    if (loggedIn()) {
        xhttp.open("GET", fetchURL, true);
    } else {
        xhttp.open("GET", fetchURL, true);
    }

    xhttp.onreadystatechange = handleReadyStateChange;
    xhttp.send(null);

    function handleReadyStateChange() {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                // update html :)
                var info = JSON.parse(xhttp.response);
                // console.log(JSON.stringify(info));

                var content = ""

                var puEvents = info["puEvents"];
                //console.log("puEvents: " + JSON.stringify(puEvents));
                puEvents.forEach(function(event) {
                    content = content + parseEventInfo(event);
                });

                if (info["puEvents"].length != 0)
                    content = content + "<br> <br>";

                var printers = info["printers"];
                //console.log("printers: " + JSON.stringify(printers));
                printers.forEach(function(printer) {
                    content = content + parsePrinterInfo(printer);
                });

                if (info["printers"].length != 0)
                    content = content + "<br> <br>";

                var dining = info["dining"];
                //console.log("dining: " + JSON.stringify(dining));
                dining.forEach(function(dhall) {
                    content = content + parseDiningInfo(dhall);
                });

                if (info["dining"].length != 0)
                    content = content + "<br> <br>";

                var laundryMachines = info["laundry"];
                //console.log("laundry: " + JSON.stringify(laundryMachines));
                laundryMachines.forEach(function(laundry) {
                    content = content + parseLaundryInfo(laundry);
                });

                // if (info["laundry"].length != 0)
                //     content = content + "</p>";

                console.log(content);

                callback(content);
            }
        }
    } //end of handleReadyStateChange()
}