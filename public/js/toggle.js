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

function inVertical() {
    return false;
    /*
    if ($('#vertical_container').css('display') == 'none') {
        return false;
    } else {
        return true;
    }
    */
}

//xml_special_to_escaped_one_map , escaped_one_to_xml_special_map
//encodeXml and decodeXml courtesy of DracoBlue at
//https://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/

var xml_special_to_escaped_one_map = {
    '&': '&amp;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&apos;'
};

var escaped_one_to_xml_special_map = {
    '&amp;': '&',
    '&quot;': '"',
    '&lt;': '<',
    '&apos;':"'",
    '&gt;': '>'
};

function encodeXml(string) {
    return string.replace(/([\&"<>'])/g, function(str, item) {
        return xml_special_to_escaped_one_map[item];
    });
};

function decodeXml(string) {
    return string.replace(/(&quot;|&lt;|&gt;|&amp;|&apos;)/g,
        function(str, item) {
            return escaped_one_to_xml_special_map[item];
    });
}


function showEventInfo(entry) {
    // alert(JSON.stringify(entry));
    //console.log(entry["title"]);
    //console.log(typeof(entry["longitude"]));
    var winners = [];

    if (parseFloat(entry["latitude"]) == 0.0 || parseFloat(entry["longitude"]) == 0.0 || entry["latitude"] == null || entry['longitude'] == null) {
        var words = null;
        if (entry["locationName"] != null) { 
            //search by locationName words
            words = entry["locationName"].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g," ");
            words = words.split(' ');
        } else if (entry["title"] != null) {
             //search by title words
            words = entry["title"].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g," ");
            words = words.split(' '); 
        }

        if (words != null) {
            for (var i = 0; i < words.length; i++) {
                words[i] = words[i].toLowerCase();
                //console.log(words[i]);
            }
            for (var i = 0; i < polygons.length; i++) {
                var keyword = polygons[i].name.split(' ')[0].toLowerCase();
                //console.log(keyword);
                if ($.inArray(keyword, words) != -1) {
                    winners.push(polygons[i]);//.position;
                    //console.log('winner is ' + polygons[i].name);
                }
            }

            /*
            if (winner != null) {
                entry["latitude"] = winner.center.lat();
                entry["longitude"] = winner.center.lng();

                //console.log(entry["latitude"]);
                //console.log(entry["longitude"]);
            } else {
                entry["latitude"] = null;
                entry["longitude"] = null;
            }
            */

        }
    }

    // assert that event lies within time slider range
    //this code is redudany since timeRange() automatically limits the availabile
    //dataList options absed on slider values
    var proceed = false;

    if ('startTime' in entry && 'endTime' in entry && 'startDate' in entry && 'endDate' in entry) {
        if (parseInt(entry['startTime'].substring(0, 2)) >= start_time) {
            if (parseInt(entry['endTime'].substring(0, 2)) <= end_time) {
                var startDate = new Date(entry['startDate']).getTime();
                var endDate = new Date(entry['endDate']).getTime();
                if (startDate >= dates[start_date].getTime()) {
                    if (endDate <= dates[end_date].getTime()) {
                        proceed = true;
                        console.log('proceed');
                    }
                }
            }
        }
    } else {
        proceed = true;
        //console.log('proceed');
    }  

    if (proceed) {
        if (winners.length != 0) {
            //clear boundary variable
            //toggle_bounds = new google.maps.LatLngBounds();

            winners.forEach(function(winner){
                entry["latitude"] = winner.center.lat();
                entry["longitude"] = winner.center.lng();
                goProceed(entry);
            });
            //map.fitBounds(toggle_bounds);
        } else {
            goProceed(entry);
        }  
    }

}

function goProceed(entry) {

    if (entry["latitude"] != "0" && entry["longitude"] != "0" && entry["latitude"] != null && entry['longitude'] != null) {
        //console.log('inside');
        var champion = getNearestPolygon(entry["latitude"], entry["longitude"], highlightPolygon);

        //create content
        var content = "";
        content = content + '<div class="iw-subTitle">Events</div>';

        if (entry["title"] != null) {
            content = content + "<p style='text-align:center'>" + entry["title"] + "<br>";
        }
        if (entry["locationName"] != null) {
            content = content + entry["locationName"] + "<br>";
        }
        if (entry["startTime"] != null) {
            content = content + "<br>Start Time: " + entry["startTime"] + "<br>";
        }

        if (entry["endTime"] != null) {
            content = content + "End Time: " + entry["endTime"] + "<br>";
        }
        if (entry["description"] != null) {
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
                //if ($('#info_div').css('display') != 'none') { //info div is shown
                if (false) {
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

//CITP Lecture Series : David Parkes - Robust Methods to Elicit Informative Feedback
//CITP Lecture Series : David Parkes - Robust Methods to Elicit Informative Feedback

/*

*/

$('#new-input').on('input', function() {
    var val = $(this).val();
    console.log('at least getting called');
    unhighlightAll();
    if (val == "") {
        unhighlightAll();
    } else {
        /*
        for (var key in event_dict) {
            console.log(key);
        }
        */
        
        /*
        var select = document.getElementById('subtitles');
        console.log(select.options[select.selectedIndex].value);
        */
                
        console.log(val);
        if (val in event_dict) {
            last_click = null;
            console.log('showEventInfo');
            showEventInfo(event_dict[val]);
        }

    }
    //var opt = $('option[value="'+$(this).val()+'"]');
    //alert(opt.length ? opt.attr('id') : 'NO OPTION');
});

function printSelect() {
    var new_input = document.getElementById('new-input');
    console.log(new_input.value);
    //console.log($('#subtitles').val());
}

function timeRange() {
    var dataList = $('#subtitles');
    dataList.empty();
    if (do_once) { //events haven't been collected yet
        toggleSearch();
        do_once = false;
    }

    //restrict dataList based on time slider
    for (key in event_dict) {
        if (parseInt(event_dict[key]['startTime'].substring(0, 2)) >= start_time) {
            if (parseInt(event_dict[key]['endTime'].substring(0, 2)) <= end_time) {
                //console.log('should be adding ' + key);
                if ("startDate" in event_dict[key] && "endDate" in event_dict[key]) {
                    var startDate = new Date(event_dict[key]['startDate']).getTime();
                    var endDate = new Date(event_dict[key]['endDate']).getTime();
                    if (startDate >= dates[start_date].getTime()) {
                        if (endDate <= dates[end_date].getTime()) {
                            //console.log('adding ' + key);
                            //dataList.append("<option value=" + key + ">");
                            dataList.append("<option >" + key + "</option>");
                        }
                    }                            
                } else {
                    //console.log('adding ' + key);
                    //dataList.append("<option value=" + key + ">");
                    dataList.append("<option >" + key + "</option>");
                }

            }
        }
    }

    //adapt search bar once datalist has been populated
    adaptSearch();
}

function adaptSearch() {

    //this function checks if the current browser supports datalist object
    //if it does not, it uses a slightly suboptimal work-around
    //function not written by our group, it is courtesy of Github contributor thgreasi
    //located at https://github.com/thgreasi/datalist-polyfill

    var nativedatalist = !!('list' in document.createElement('input')) && 
        !!(document.createElement('datalist') && window.HTMLDataListElement);

    if (!nativedatalist) {
        $('input[list]').each(function () {
            var availableTags = $('#' + $(this).attr("list")).find('option').map(function () {
                return this.value;
            }).get();
            $(this).autocomplete({ source: availableTags });
        });
    }

}

function collectEvents(rule, collection) {
    console.log(collection);

    var xhttp;
    if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
    } else {
        // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    var hostname = window.location.hostname;
    if (hostname.search('tigermaps') != -1) {
        xhttp.open("GET", "https://tigermaps.herokuapp.com/fetch/" + collection, false);
    } else { 
        //development mode
        xhttp.open("GET", "http://localhost:8080/fetch/" + collection, false);
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
                        //console.log(entry['title']);
                        var toAdd = {};
                        //store the relevant information for future reference
                        if ("longitude" in entry) {
                            toAdd["longitude"] = entry["longitude"];
                        }
                        if ("latitude" in entry) {
                            toAdd["latitude"] = entry["latitude"];
                        }
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
                            toAdd["description"] = entry["description"]; 
                        }
                        if ("startDate" in entry) {
                            toAdd["startDate"] = entry["startDate"];
                        }
                        if ("endDate" in entry) {
                            toAdd["endDate"] = entry["endDate"];
                        }
                        if (entry['title'] != null) {
                            var title = decodeXml(entry['title'].replace(/\s/g, ''));
                            toAdd["title"] = decodeXml(entry["title"]);
                            event_dict[toAdd["title"]] = toAdd;
                        } else {
                            //Don't store any event that cannot be indexed by title
                        }
                    
                    }

                });

                //console.log('going forth');

                if (rule == 2) {
                    //console.log('going forth');
                    collectEvents(1,'usgEvents');
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
}

function toggleSearch() {
    if (toggled) { //currently searching for events
        //$('#toggle_search').html('Events');
        $('#new-input').css('display', 'none');
        $('#pac-input').css('display', 'initial');
        toggled = false;

        //unpopulate dataList
        var dataList = $('#subtitles');
        dataList.empty();

        //removes all child elements
        //dataList.remove();
    } else {
        //$('#toggle_search').html('Places');
        $('#pac-input').css('display', 'none');
        $('#new-input').css('display', 'initial');
        toggled = true;

        if (do_once) {
            do_once = false;

            //clear dataList 
            var dataList = $('#subtitles');
            dataList.empty();

            //clear event_dict (storage)
            event_dict = {};

            if (loggedIn()) {
                collectEvents(2, 'puEvents');
            } else {
                collectEvents(1, 'puEvents');
            }

            console.log('complete');


            //restrict dataList based on time slider
            for (key in event_dict) {
                if (parseInt(event_dict[key]['startTime'].substring(0, 2)) >= start_time) {
                    if (parseInt(event_dict[key]['endTime'].substring(0, 2)) <= end_time) {
                        //console.log('should be adding ' + key);
                        if ("startDate" in event_dict[key] && "endDate" in event_dict[key]) {
                            var startDate = new Date(event_dict[key]['startDate']).getTime();
                            var endDate = new Date(event_dict[key]['endDate']).getTime();
                            if (startDate >= dates[start_date].getTime()) {
                                if (endDate <= dates[end_date].getTime()) {
                                    //console.log('adding ' + key);
                                    //dataList.append("<option value=" + key + ">");
                                    dataList.append("<option >" + key + "</option>");
                                }
                            }                            
                        } else {
                            //console.log('adding ' + key);
                            //dataList.append("<option value=" + key + ">");
                            dataList.append("<option >" + key + "</option>");
                        }

                    }
                }
            }
        } //do_once end

        //adapt search bar once select options have been populated
        adaptSearch();
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
        contender = Math.sqrt(Math.pow((polygons[i].center.lat() - lat),2) + Math.pow((polygons[i].center.lng() - lng), 2));
        if (contender < minimum) {
            champion = polygons[i];
            minimum = contender;
        }
    }

    // Run callback on the champion polygon
    if (champion != null && callback !== undefined && callback !== null) {
        if (toggle_bounds != null) {
            toggle_bounds.extend(champion.center);
        }
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
            if (inVertical()) {
                $('#' + last_click + '_button_v').css('background-color', '#fff');
            } else {
                $('#' + last_click + '_button').css('background-color', '#fff');
            }
            last_click = null;
        } else { //intercept event, keep change last_click to food
            if (inVertical()) {
                $('#' + last_click + '_button_v').css('background-color', '#fff');
                $('#food_button_v').css('background-color', '#ffb347');
                console.log('orange');
            } else {
                $('#' + last_click + '_button').css('background-color', '#fff');
                $('#food_button').css('background-color', '#ffb347');
                console.log('orange');
            }
            last_click = 'food';
        }
        unhighlightAll();
    } else { //upclick event
        if (inVertical()) {
            $('#food_button_v').css('background-color', '#ffb347');
            console.log('orange');
        } else {
            $('#food_button').css('background-color', '#ffb347');
            console.log('orange');          
        }
        last_click = 'food';
    }

    //clear boundary variable
    toggle_bounds = new google.maps.LatLngBounds();

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
                        var dhall_name = dhall["name"].split(' ')[0];

                        //create content
                        var content = "";
                        content = content + '<div class="iw-subTitle">' + dhall["name"] + "<br>" + dhall["building_name"] + '</div>' + "<p style=''>" + "";
                        
                        //fetch data synchronously
                        var xreq;
                        if (window.XMLHttpRequest) {
                            xreq = new XMLHttpRequest();
                        } else {
                            // code for IE6, IE5
                            xreq = new ActiveXObject("Microsoft.XMLHTTP");
                        }
                        //Uncomment below when developing
                        var hostname = window.location.hostname;
                        if (hostname.search('tigermaps') != -1) {
                            xreq.open("GET", "https://tigermaps.herokuapp.com/fetch/menuInfo?dhall=" + dhall_name, false);
                        } else { 
                            xreq.open("GET", "http://localhost:8080/fetch/menuInfo?dhall=" + dhall_name, false);
                        }

                        xreq.onreadystatechange = handleChange;
                        xreq.send(null);

                        function handleChange() {
                            if (xreq.readyState == 4) {
                                if (xreq.status == 200) {
                                    var menu = JSON.parse(xreq.response);
                                    content = content + "<span style='text-align:center'> Lunch: </span>";
                                    for (var descriptor in menu.lunch) {
                                        content = content + "<br><br>" + descriptor + " : ";
                                        menu.lunch[descriptor].forEach(function(item){
                                        content = content + "<br>" + item;
                                        });
                                    }  
                                    content = content + "<br><br><br><span style='text-align:center'> Dinner: </span>";
                                    for (var descriptor in menu.dinner) {
                                        content = content + "<br><br>" + descriptor + " : ";
                                        menu.dinner[descriptor].forEach(function(item){
                                        content = content + "<br>" + item;
                                        });
                                    }  
                                }
                            }
                        }


                        /*
                        var day = null;
                        var d = new Date();
                        if (d.getDay() == 0) { day = "Sunday"; } else if (d.getDay() == 1) { day = "Monday"; } else if (d.getDay() == 1) { day = "Tuesday"; } else if (d.getDay() == 1) { day = "Wednesday"; } else if (d.getDay() == 1) { day = "Thursday"; } else if (d.getDay() == 1) { day = "Friday"; } else { day = "Saturday"; }
                        */

                        /*
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
                        */

                        content = content + "</p>";

                        //show the marker and add listener
                        if (champion != null) {
                            champion.marker.setVisible(true);
                            champion.marker.addListener('click', function(event) {
                                showMarkerInfo(event, this, content);
                            });
                        }

                    });

                    //adjust boundaries of map
                    map.fitBounds(toggle_bounds);
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
            if (inVertical()) {
                $('#' + last_click + '_button_v').css('background-color', '#fff');
            } else {
                $('#' + last_click + '_button').css('background-color', '#fff');
            }  
            last_click = null;
        } else { //intercept event, keep change last_click to printer
            if (inVertical()) {
                $('#' + last_click + '_button_v').css('background-color', '#fff');
                $('#printer_button_v').css('background-color', '#ffb347');
            } else {
                $('#' + last_click + '_button').css('background-color', '#fff');
                $('#printer_button').css('background-color', '#ffb347');
            }
            last_click = 'printer';
        }
        unhighlightAll();
    } else { //upclick event
        if (inVertical()) {
            $('#printer_button_v').css('background-color', '#ffb347');
        } else {
            $('#printer_button').css('background-color', '#ffb347');
        }
        last_click = 'printer';
    }

    //clear boundary variable
    toggle_bounds = new google.maps.LatLngBounds();

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

                    //adjust boundaries of map
                    map.fitBounds(toggle_bounds);

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
            if (inVertical()) {
                $('#' + last_click + '_button_v').css('background-color', '#fff');
            } else {
                $('#' + last_click + '_button').css('background-color', '#fff');
            }
            last_click = null;
        } else { //intercept event, keep change last_click to laundry
            $('#' + last_click + '_button').css('background-color', '#fff');
            if (inVertical()) {
                $('#laundry_button_v').css('background-color', '#ffb347');
                console.log('orange');
            } else {
                $('#laundry_button').css('background-color', '#ffb347');
                console.log('orange');
            }
            last_click = 'laundry'
        }
        unhighlightAll();

    } else { //upclick event

        if (inVertical()) {
            $('#laundry_button_v').css('background-color', '#ffb347');
            console.log('orange');
        } else {
            $('#laundry_button').css('background-color', '#ffb347');
            console.log('orange');
        }
        
        last_click = 'laundry';
    }

    //clear boundary variable
    toggle_bounds = new google.maps.LatLngBounds();

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

                    //adjust boundaries of map
                    map.fitBounds(toggle_bounds);

                }
            }
        } //end of handleReadyStateChange()

    } //end of if statement
} // end of function


/*

function showEvents() {
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
    } 
}
*/

function showEvents() { //keeping this function seperate allows us to update event results in real time
                        //when slider is manipulated
    if (do_once) { //collect all event data
        toggleSearch();
        do_once = false;
    }

    for (key_title in event_dict) {
        //console.log(key_title);
        showEventInfo(event_dict[key_title]);
    }

    //adjust boundaries of map
    map.fitBounds(toggle_bounds);
}

function showEventPlaces() {
    //clear last_click
    console.log("last click: " + last_click);
    var events = 0;
    if (last_click != null) {
        if (last_click == 'events') {
            events = 1; //downclick event, no other button affected
            if (inVertical()) {
                $('#' + last_click + '_button_v').css('background-color', '#fff');
            } else {
                $('#' + last_click + '_button').css('background-color', '#fff');
            }
            last_click = null;
        } else { //intercept event, keep change last_click to events
            if (inVertical()) {
                $('#' + last_click + '_button_v').css('background-color', '#fff');
            } else {
                $('#' + last_click + '_button').css('background-color', '#fff');
            }
            last_click = 'events';
        }
        unhighlightAll();
    } else { //upclick event
        if (inVertical()) {
            $('#events_button').css('background-color', '#ffb347');
        } else {
            $('#events_button').css('background-color', '#ffb347');
        }
        last_click = 'events';
    }

    //clear boundary variable
    toggle_bounds = new google.maps.LatLngBounds();

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

                callback(content);
            }
        }
    } //end of handleReadyStateChange()
}