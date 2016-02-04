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
        SPARQLQueryService.getUniversityByUri($routeParams.universityUri).then(
            function successCallback(response) {
                var responseData = response.data.results.bindings[0];
                for(var objectProperty in responseData){
                    $scope.university[objectProperty] = responseData[objectProperty].value;
                    $scope.addMarker('marker', parseFloat($scope.university.lat), parseFloat($scope.university.lon), $scope.university.locationName);
                    $scope.centerMap(parseFloat($scope.university.lat), parseFloat($scope.university.lon));
                }
            },
            function errorCallback(response) {
                console.log(response);
            }
        );
    };

    /*
     * Fügt einen Marker mit dem angegebenen Längen- und Breitengrad, sowie einer Nachricht auf der Leaflet Karte
     * hinzu.
     */
    $scope.addMarker = function(name, latitude, longitude, message){

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

studysearchApp.controller('MapCtrl', function($scope, $location, leafletMarkerEvents, leafletData, $mdSidenav, SPARQLQueryService, $timeout){
    $scope.universities = [];

    // Aufruf des SPARQL Endpoint
    $scope.queryUniversity = function(){
        SPARQLQueryService.getUniversities().then(
            function successCallback(response) {
                var responseData = response.data.results.bindings;
                //console.log("ResponseData:", responseData);
                for (var arrayElement in responseData) {
                    var tmpObject = {};
                    //console.log("ArrayElement:", responseData[arrayElement]);
                    for (var objectProperty in responseData[arrayElement]) {
                        //console.log("ObjectProperty:", responseData[arrayElement][objectProperty]);
                        tmpObject[objectProperty] = responseData[arrayElement][objectProperty].value
                    }
                    $scope.universities.push(tmpObject);
                    $scope.addMarker("marker"+$scope.universities.length, parseFloat(tmpObject.lat), parseFloat(tmpObject.lon), tmpObject.locationName, tmpObject.uri);
                }
                console.log($scope.universities);
            },
            function errorCallback(response) {
                console.log(response);
            }
        );
    };

    /*
     * Fügt einen Marker mit dem angegebenen Längen- und Breitengrad, sowie einer Nachricht auf der Leaflet Karte
     * hinzu.
     */
    $scope.addMarker = function(name, latitude, longitude, message, uri){
        console.log(name, latitude, longitude, message);
        $scope.markers[name] = {
            lat: latitude,
            lng: longitude,
            message: message,
            draggable: false,
            layer: 'universityLayer',
            uri: uri
        };
        //angular.extend($scope, tmpMarker);
    };

    /*
     * Initiieren der Leaflet Karte.
     */
    angular.extend($scope, {
        center: {
            lat: 51.097,
            lng: 11.316,
            zoom: 6
        },
        markers: {
        },
        events: {
            markers: {
                enable: leafletMarkerEvents.getAvailableEvents()
            }
        },
        layers: {
            baselayers: {
                toner: {
                    name: 'Stamen Toner',
                    url: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
                    type: 'xyz'
                },
                watercolor: {
                    name: 'Watercolor',
                    url: 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png',
                    type: 'xyz'
                },
                hotosm: {
                    name: 'HOTOSM',
                    url: 'http://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                    type: 'xyz'
                }
            },
            overlays: {
                universityLayer: {
                    name: 'CollegeOrUniversity',
                    type: 'markercluster',
                    visible: true
                }
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
            console.log(event,args);
            if(event.name == 'leafletDirectiveMarker.universityMap.click'){
                //$mdSidenav('info-sidenav').toggle();
                var newLocation = '/university/'+encodeURIComponent(encodeURIComponent($scope.markers[args.modelName].uri));
                console.log(newLocation);
                $location.url(newLocation);
            }
        });
    }

    $scope.queryUniversity();
    $timeout(function(){
        leafletData.getMap().then(function(map){
            map.invalidateSize();
            console.log("Size invalidated by timeout.");
        });
    });
    console.log($scope);
});