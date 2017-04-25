var map;
var placesService;
var infoWindows = [];
var showAllInfoWindows = false;
var previousHighlight = null;
var previousHighlights = [];
var polygons = [];

//console.log(JSON.stringify(previousHighlights));

$("#allInfoWindow").click(function() {

    //alert("showAllInfoWindows = true;");
    showAllInfoWindows = true;
});

$("#oneInfoWindow").click(function() {

    // alert("showAllInfoWindows = false;");
    showAllInfoWindows = false;

    for (var i = 0; i < infoWindows.length; i++) {
        infoWindows[i].close();
    }
});

// Set the zoom and pan bounds for the map
function setZoomPanBounds() {
    // Map bounds
    var allowedBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(40.329950, -74.670505),
        new google.maps.LatLng(40.356531, -74.639470)
    );
    var minZoom = 15;
    var lastValidCenter = map.getCenter();

    google.maps.event.addListener(map, "center_changed", function() {
        if (allowedBounds.contains(map.getCenter())) {
            // Still within valid bounds, so save the last valid position
            lastValidCenter = map.getCenter();
            return;
        }
        // Not valid anymore, return to last valid position
        map.panTo(lastValidCenter);
    });
    google.maps.event.addListener(map, "zoom_changed", function() {
        if (map.getZoom() < minZoom)
            map.setZoom(minZoom);
    });
}


// Center map on location of user, if possible
function geolocate() {
    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

// Create map search box
function createSearchBox() {

    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);
    //map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });


    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            var icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }

            //disperse previousHighlight
            if (previousHighlight != null) {
                previousHighlight.setOptions({
                    strokeOpacity: 0.01,
                    fillOpacity: 0.01
                });
                previousHighlight = null;
            }

            //highlight current searched place 
            var champion = null;
            var minimum = Number.MAX_VALUE;
            var contender = Number.MAX_VALUE;

            for (var i = 0; i < polygons.length; i++) {
                contender = Math.sqrt((polygons[i].center.lat() - place.geometry.location.lat())**2 + (polygons[i].center.lng() - place.geometry.location.lng())**2);
                if (contender < minimum) {
                    champion = polygons[i].polygon;
                    minimum = contender;
                }
            }
                        
            if (champion != null) { 
                previousHighlight = champion;

                champion.setOptions({
                    strokeOpacity: 0.8,
                    fillOpacity: 0.35
                });
            }

            //panTo its location
            map.panTo(place.geometry.location);
        });
        //map.fitBounds(bounds);
    });

}

function initMap(pos) {
    $.getJSON("js/mapstyle.json", function(data) {

        // Create map and assign it to div
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 40.34663, lng: -74.6565801 },
            zoom: 17,
            styles: data
        });

        // Set the zoom and pan bounds for the map
        setZoomPanBounds();

        // Center map on location of user, if possible
        geolocate();

        // Create the DIV to hold the control and call the About()
        // constructor passing in this DIV.
        //var aboutDiv = document.createElement('div');
        //var aboutControl = new createAboutButton(aboutDiv, map);

        //aboutDiv.index = 1;
        //map.controls[google.maps.ControlPosition.TOP_CENTER].push(aboutDiv);

        $.getScript('js/bldgCoords.js', function() {
            // Draw polygons once they've been loaded from bldgCoords.js
            drawPolygons();
        });

        // Create map search box
        createSearchBox();
    });
}



//Courtesy of http://moduscreate.com/placing-markers-inside-polygons-with-google-maps/
function getBoundingBox(polygon) {
    var bounds = new google.maps.LatLngBounds();

    polygon.getPath().forEach(function(element, index) {
        bounds.extend(element)
    });
    return (bounds);
}

function drawPolygons() {

    // Iterate over all locations
    for (var i = 0; i < locations.length; i++) {

        // Construct a polygon for each location
        var myPolygon = new google.maps.Polygon({
            paths: locations[i].coords,
            strokeColor: '#ff9966',
            strokeOpacity: 0.01,
            strokeWeight: 3,
            fillColor: '#ff9966',
            fillOpacity: 0.01,
        });

        // Get center of polygon
        var center = getBoundingBox(myPolygon).getCenter();

        //store polygon, its center, and its name
        polygons.push({
            'polygon':myPolygon,
            'name':locations[i].name,
            'center':center
        }); 

        // Create a marker object for each polygon
        var marker = new google.maps.Marker({
            position: center,
            map: map,
            name: locations[i].name,
            visible: false
        });

        // Insert the marker as a field in the polygon object
        myPolygon.marker = marker;

        // Assign the polygon to the map
        myPolygon.setMap(map);


        /*
        MUST USE 'this' TO AVOID CLOSURE!!!!!

        https://forums.phpfreaks.com/topic/281402-google-maps-add-click-listener-to-each-polygon/
        */

        // On-click marker listener
        marker.addListener('click', function(event) {
            showMarkerInfo(event, this);
        });

        // On-click polygon listener
        myPolygon.addListener('click', function(event) {
            showPolygonInfo(event, this);
        });

        // mouseover polygon listener
        myPolygon.addListener('mouseover', function(event) {
            this.setOptions({
                strokeOpacity: 0.8,
                fillOpacity: 0.35
            });
        });

        // mouseout polygon listener
        myPolygon.addListener('mouseout', function(event) {
            var toggle = false;

            //only unhighlight if not in toggle mode 
            previousHighlights.forEach(function(polygon){
                //If both operands are objects, then JavaScript compares internal references 
                //which are equal when operands refer to the same object in memory.
                if (this == polygon) {
                    toggle = true;
                }
            });

            if (toggle == false) {
                this.setOptions({
                    strokeOpacity: 0.01,
                    fillOpacity: 0.01
                });
            }

        });
    }
}



function showMarkerInfo(event, pMarker) {

    // If !showAllInfoWindows, close previous infowindows
    if (!showAllInfoWindows && infoWindows.length != 0) {
        for (var i = 0; i < infoWindows.length; i++) {
            infoWindows[i].close();
        }
    }

    // Replace the info window's content and position.
    infoWindow = new google.maps.InfoWindow;
    infoWindow.setContent("You clicked on " + pMarker.name + "!");
    infoWindow.open(map, pMarker);

    // Center map on info window location
    map.panTo(pMarker.position);

    // Keep track of all infoWindows
    infoWindows.push(infoWindow);
}

function showPolygonInfo(event, polygon) {

    // If !showAllInfoWindows, close previous infowindows
    if (!showAllInfoWindows && infoWindows.length != 0) {
        for (var i = 0; i < infoWindows.length; i++) {
            infoWindows[i].close();
        }
    }

    // Replace the info window's content and position.
    infoWindow = new google.maps.InfoWindow;
    infoWindow.setContent("You clicked on " + polygon.name + "!");
    infoWindow.open(map, polygon.marker);

    // Center map on info window location
    map.panTo(polygon.marker.position);

    // Keep track of all infoWindows
    infoWindows.push(infoWindow);
}
