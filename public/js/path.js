/*window.onclick = function() {
    var targetPolygon = selectedPolygon;
    var lat = targetPolygon.center.lat();
    var lng = targetPolygon.center.lng();
    var name = targetPolygon.name;

    drawPathToCoords(name, lat, lng);
}*/

function getPlace(name, lat, lng, callback) {
    var request = {
        location: new google.maps.LatLng(lat, lng),
        radius: 10,
        name: name
    };
    placesService.nearbySearch(request, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            if (results.length > 0) {
                var pick = 0;
                while (pick < results.length - 1 && results[pick].name == "Princeton") {
                    pick++;
                }

                var place = {
                    placeId: results[pick].place_id
                }
                callback(place);
            } else {
                var place = {
                    location: new google.maps.LatLng(lat, lng)
                }
                callback(place);
            }
        } else {
            var place = {
                location: new google.maps.LatLng(lat, lng)
            }
            callback(place);
        }
    });
}

function drawPathToCoords(name, lat, lng) {

    if (userLocation != null) {
        getPlace(name, lat, lng, function(targetPlace) {
            directionsService.route({
                origin: new google.maps.LatLng(userLocation.lat, userLocation.lng),
                destination: targetPlace,
                travelMode: google.maps.TravelMode.WALKING
            }, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setMap(map);
                    directionsDisplay.setDirections(response);
                } else {
                    console.log("Directions failed");
                }
            });
        });
    } else {
        geolocateCallback(function(userLoc) {
            getPlace(name, lat, lng, function(targetPlace) {
                directionsService.route({
                    origin: new google.maps.LatLng(userLoc.lat, userLoc.lng),
                    destination: targetPlace,
                    travelMode: google.maps.TravelMode.WALKING
                }, function(response, status) {
                    if (status == google.maps.DirectionsStatus.OK) {
                        directionsDisplay.setMap(map);
                        directionsDisplay.setDirections(response);
                    } else {
                        console.log("Directions failed");
                    }
                });
            });
        });
    }
}

function clearPath() {
    directionsDisplay.setMap(null);
}