var map;
var placesService;
var infoWindow = null;

// The About adds a control to the map that links to the About page
function About(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #888';
    controlUI.style.borderRadius = '4px';
    controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to find more about the team behind this app';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'About Us';
    controlUI.appendChild(controlText);

    // Setup the click event listeners to link to About page.
    controlUI.addEventListener('click', function() {
        //alert("Clicked! :-)")
        window.location.href = '/about.html';
    });
}

function initMap() {
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            createMap(pos);
        }, function() {
            handleLocationError(true);
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false);
    }

    function handleLocationError(browserHasGeolocation) {
        var pos = {
            lat: 40.34663,
            lng: -74.6565801
        };
        createMap(pos);
    }

}

function createMap(pos) {
    $.getJSON("mapstyle.json", function(data) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 40.34663, lng: -74.6565801 },
            zoom: 17,
            styles: data
        });


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

        // Create the DIV to hold the control and call the About()
        // constructor passing in this DIV.
        var aboutDiv = document.createElement('div');
        var aboutControl = new About(aboutDiv, map);

        aboutDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(aboutDiv);

        $.getScript('bldgCoords.js', function() {
            // script is now loaded and executed.
            // put your dependent JS here.
            loadPolygons();
        });


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
            });
            map.fitBounds(bounds);
        });
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

function loadPolygons() {

    // Iterate over all locations
    for (var i = 0; i < locations.length; i++) {

        // Construct a polygon for each location
        var myPolygon = new google.maps.Polygon({
            paths: locations[i].coords,
            strokeColor: '#FF0000',
            strokeOpacity: 0.01,
            strokeWeight: 3,
            fillColor: '#FF0000',
            fillOpacity: 0.01,
            name: locations[i].name
        });

        // Ger center of polygon
        var center = getBoundingBox(myPolygon).getCenter();

        // Create a marker object for each polygon
        var marker = new google.maps.Marker({
            position: center,
            map: map,
            name: locations[i].name
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
            this.setOptions({
                strokeOpacity: 0.01,
                fillOpacity: 0.01
            });
        });

    }

}



function showMarkerInfo(event, pMarker) {

    // Close previous infowindow, if any
    if (infoWindow) {
        infoWindow.close();
    }

    // Replace the info window's content and position.
    infoWindow = new google.maps.InfoWindow;
    infoWindow.setContent("You clicked on " + pMarker.name + "!");
    infoWindow.open(map, pMarker);
}

function showPolygonInfo(event, polygon) {

    // Close previous infowindow, if any
    if (infoWindow) {
        infoWindow.close();
    }

    // Replace the info window's content and position.
    infoWindow = new google.maps.InfoWindow;
    infoWindow.setContent("You clicked on " + polygon.name + "!");
    infoWindow.open(map, polygon.marker);
}