var map;
var placesService;
var infoWindow;

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location
    });
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(map, this);
    });
}

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }
    }
}


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
            center: pos,
            zoom: 17,
            styles: data
        });
        placesService = new google.maps.places.PlacesService(map);
        infowindow = new google.maps.InfoWindow();

        var testPos = {
            lat: 40.348322,
            lng: -74.660621
        };
        placesService.nearbySearch({
            location: testPos,
            radius: 50
        }, callback);

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

        drawDillonPolygon();
    });

}


var infoWindow;

function drawAllPolygons() {

    var DillonCoords = [
        new google.maps.LatLng(40.346222, -74.658846),
        new google.maps.LatLng(40.346044, -74.658765),
        new google.maps.LatLng(40.346035, -74.658796),
        new google.maps.LatLng(40.345701, -74.658643),
        new google.maps.LatLng(40.345702, -74.658634),
        new google.maps.LatLng(40.345699, -74.658626),
        new google.maps.LatLng(40.345693, -74.658621),
        new google.maps.LatLng(40.345709, -74.658538),
        new google.maps.LatLng(40.345723, -74.658532),
        new google.maps.LatLng(40.345728, -74.658517),
        new google.maps.LatLng(40.345725, -74.658503),
        new google.maps.LatLng(40.345714, -74.658498),
        new google.maps.LatLng(40.345702, -74.658500),
        new google.maps.LatLng(40.345647, -74.658478),
        new google.maps.LatLng(40.345644, -74.658467),
        new google.maps.LatLng(40.345632, -74.658462),
        new google.maps.LatLng(40.345622, -74.658467),
        new google.maps.LatLng(40.345503, -74.658410),
        new google.maps.LatLng(40.345593, -74.658062),
        new google.maps.LatLng(40.345479, -74.658008),
        new google.maps.LatLng(40.345254, -74.658838),
        new google.maps.LatLng(40.344948, -74.658697),
        new google.maps.LatLng(40.344936, -74.658745),
        new google.maps.LatLng(40.344984, -74.658768),
        new google.maps.LatLng(40.344961, -74.658860),
        new google.maps.LatLng(40.345349, -74.659035),
        new google.maps.LatLng(40.345342, -74.659063),
        new google.maps.LatLng(40.345470, -74.659120),
        new google.maps.LatLng(40.345470, -74.659119),
        new google.maps.LatLng(40.345514, -74.658963),
        new google.maps.LatLng(40.345765, -74.659079),
        new google.maps.LatLng(40.345756, -74.659123),
        new google.maps.LatLng(40.345761, -74.659137),
        new google.maps.LatLng(40.345789, -74.659148),
        new google.maps.LatLng(40.345800, -74.659145),
        new google.maps.LatLng(40.345812, -74.659100),
        new google.maps.LatLng(40.345939, -74.659158),
        new google.maps.LatLng(40.345928, -74.659199),
        new google.maps.LatLng(40.346108, -74.659277),
        new google.maps.LatLng(40.346222, -74.658847)
    ];

    // console.log("drawing!!!!");
    // Construct the polygon.
    var DillonPolygon = new google.maps.Polygon({
        paths: DillonCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.01,
        strokeWeight: 3,
        fillColor: '#FF0000',
        fillOpacity: 0.01
    });
    DillonPolygon.setMap(map);
    console.log("finished drawing!")

    var vertices = DillonPolygon.getPath();

    // Add a listener for the click event.
    DillonPolygon.addListener('mouseover', function() {
        DillonPolygon.setOptions({
            strokeOpacity: 0.8,
            fillOpacity: 0.35
        }); 
    });

    DillonPolygon.addListener('mouseout', function() {
        DillonPolygon.setOptions({
            strokeOpacity: 0.01,
            fillOpacity: 0.01
        }); 
    });

    infoWindow = new google.maps.InfoWindow;
}

/** @this {google.maps.Polygon} */
function showDillonInfo(event) {

    // Replace the info window's content and position.
    infoWindow.setContent("You clicked on Dillon Gym!");
    infoWindow.setPosition(event.latLng);

    infoWindow.open(map);
}