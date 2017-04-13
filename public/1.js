//Dillon Gym
function drawPolygon1() {

    var PolygonCoords = [
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
    var myPolygon = new google.maps.Polygon({
        paths: PolygonCoords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.01,
        strokeWeight: 3,
        fillColor: '#FF0000',
        fillOpacity: 0.01
    });


    myPolygon.setMap(map);

    var vertices = myPolygon.getPath();
    var center = getBoundingBox(myPolygon).getCenter();

    var marker = new google.maps.Marker({
        position: center,
        map: map
    });

    //marker.setLabel("Dillon Gym");
    marker.addListener('click', function(event) {
        showInfo(event, this);
    });

    myPolygon.addListener('click', function(event) {
        showInfo(event, marker);
    });

    // Add a listener for the click event.
    myPolygon.addListener('mouseover', function(event) {
        myPolygon.setOptions({
            strokeOpacity: 0.8,
            fillOpacity: 0.35
        });
    });

    myPolygon.addListener('mouseout', function(event) {
        myPolygon.setOptions({
            strokeOpacity: 0.01,
            fillOpacity: 0.01
        });
    });

    function showInfo(event, marker) {
        // Replace the info window's content and position.
        //infoWindow.setPosition(event.latLng);
        var infoWindow = new google.maps.InfoWindow;
        infoWindow.setContent("You clicked on Dillon Gym!");
        infoWindow.open(map, marker);
    }

}

drawPolygon1();
