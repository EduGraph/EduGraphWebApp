studysearchApp.controller('InstitutionListCtrl', function($scope, SPARQLQueryService) {
    $scope.universities = SPARQLQueryService.getUniversities();
});

studysearchApp.controller('UniversityCtrl', function($scope, $routeParams, SPARQLQueryService) {
    $scope.university = {};
    $scope.university.lat = 0;
    $scope.university.lon = 0;
    $scope.university.locationName = '';

    // Aufruf des SPARQL Endpoint
    $scope.queryUniversity = function(){
        var promise = SPARQLQueryService.getUniversityByUri($routeParams.universityUri);
        var university = promise.then(
            function successCallback(response) {
                console.log(response);
                $scope.university.name = response.data.results.bindings[0].name.value;
                $scope.university.url = response.data.results.bindings[0].url.value;
                $scope.university.lat = response.data.results.bindings[0].lat.value;
                $scope.university.lon = response.data.results.bindings[0].lon.value;
                $scope.university.locationName = response.data.results.bindings[0].locationName.value;
                console.log($scope.university);
            },
            function errorCallback(response) {
                console.log(response);
            }
        );
    };
    //$scope.addMarkers(parseFloat($scope.university.lat.value), parseFloat($scope.university.lon.value), $scope.university.locationName.value);
    //$scope.centerMap(parseFloat($scope.university.lat.value), parseFloat($scope.university.lon.value));

    /*
     * Fügt einen Marker mit dem angegebenen Längen- und Breitengrad, sowie einer Nachricht auf der Leaflet Karte
     * hinzu.
     */
    $scope.addMarkers = function(latitude, longitude, message){
        angular.extend($scope, {
            markers: {
                marker: {
                    lat: latitude,
                    lng: longitude,
                    message: message,
                    draggable: false
                }
            }
        });
    };

    /*
     * Zentriert die Leaflet Karte auf den angegebenen Längen- und Breitengrad
     *
     * @param {number} latitude - Breitengrad
     * @param {number} longitude - Längengrad
     * @param {number} zoom - Zoom
     */
    $scope.centerMap = function(latitude, longitude, zoom){
        if(typeof zoom === 'undefined') { zoom = 12; }
        angular.extend($scope, {
            center: {
                lat: latitude,
                lng: longitude,
                zoom: 12
            }
        });
    };

    /*
     * Initiieren der Leaflet Karte.
     */
    angular.extend($scope, {
        center: {
            lat: $scope.university.lat,
            lng: $scope.university.lon,
            zoom: 12
        },
        markers: {
            marker: {
                lat: $scope.university.lat,
                lng: $scope.university.lon,
                message: $scope.university.locationName,
                draggable: false
            }
        },
        defaults: {
            scrollWheelZoom: true
        }
    });

    $scope.queryUniversity();
});

studysearchApp.controller('SearchCtrl', function($scope){

});

studysearchApp.controller('MapCtrl', function($scope, leafletMarkerEvents, $mdSidenav){
    /*
     * Initiieren der Leaflet Karte.
     */
    angular.extend($scope, {
        center: {
            lat: 50,
            lng: 16,
            zoom: 12
        },
        markers: {
            marker: {
                lat: 50,
                lng: 16,
                message: 'Test',
                draggable: false
            }
        },
        events: {
            markers: {
                enable: leafletMarkerEvents.getAvailableEvents()
            }
        },
        defaults: {
            scrollWheelZoom: true
        }
    });

    $scope.eventDetected = "No events yet...";

    var markerEvents = leafletMarkerEvents.getAvailableEvents();
    for (var k in markerEvents){
        var eventName = 'leafletDirectiveMarker.universityMap.' + markerEvents[k];
        $scope.$on(eventName, function(event, args){
            console.log(event);
            if(event.name == 'leafletDirectiveMarker.universityMap.click'){
                $mdSidenav('info-sidenav').toggle();
            }
        });
    }
});