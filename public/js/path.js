

window.onclick = function() {
    var targetPolygon = selectedPolygon;
    var lat = targetPolygon.center.lat();
    var lng = targetPolygon.center.lng();
    var name = targetPolygon.name;
    console.log(name);

    drawPathToCoords(name, lat, lng);
}

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
                while (pick < results.length - 1 && results[pick].name == "Princeton")
                    pick++;
                console.log(results.length);
                console.log("PICKED:");
                console.log(results[pick].name);
                console.log(results[pick].place_id);
                var place = {
                    placeId: results[pick].place_id
                }
                callback(place);
            }
            else {
                console.log("No results for place search.");
            }
            callback(place);
        }
        else {
            var place = {
                location: new google.maps.LatLng(lat, lng)
            }
            callback(place);
            console.log("Places service nearby search failed.");
        }
    });
}

function drawPathToCoords(name, lat, lng) {
    geolocateCallback(function(userLoc) {
        getPlace(name, lat, lng, function(targetPlace) {
            console.log(targetPlace);
            directionsService.route({
                origin: new google.maps.LatLng(userLoc.lat, userLoc.lng),
                destination: targetPlace,
                travelMode: google.maps.TravelMode.WALKING
            }, function(response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response);
                } else {
                    console.log("Directions failed");
                }
            });
        });
    });
}