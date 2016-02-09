studysearchApp.controller('CourseListCtrl', function($scope, SPARQLQueryService) {
    $scope.courses = [
        {
            courseName: 'Wirtschaftsinformatik',
            courseDescription: 'Die Wirtschaftsinformatik ist eine Wissenschaft, die sich mit Entwicklung und Anwendung von Informations- und Kommunikationssystemen in Wirtschaftsunternehmen befasst.'
        }
    ];

    $scope.queryCourses = function(){
        $scope.courses= SPARQLQueryService.getCourses().then(
            function successCallback(response) {
                console.log(response);
            },
            function errorCallback(response) {
                console.log(response);
            }
        );
    }
});

studysearchApp.controller('UniversityCtrl', function($scope, $routeParams, SPARQLQueryService) {
    $scope.university = {};

    // Aufruf des SPARQL Endpoint
    $scope.queryUniversity = function(){
        SPARQLQueryService.getUniversityByUri($routeParams.universityUri).then(
            function successCallback(response) {
                var responseData = response.data.results.bindings[0];
                for(var objectProperty in responseData){
                    $scope.university[objectProperty] = responseData[objectProperty].value;
                    $scope.addMarker('marker', parseFloat($scope.university.universityLatitude), parseFloat($scope.university.universityLongitude), $scope.university.universityLabel);
                    $scope.centerMap(parseFloat($scope.university.universityLatitude), parseFloat($scope.university.universityLongitude));
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
            lat: 51.097,
            lng: 11.316,
            zoom: 6
        },
        markers: {},
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

    // Info Card
    $scope.labels = ["Sonstiges", "Betriebswirtschaft", "Wirtschaftsinformatik", "Infomatik"];
    $scope.data = [0.16, 0.2, 0.41, 0.23];
    $scope.colours = ["#ECEFF1", "#FDB45C", "#F7464A", "#97BBCD"];

    $scope.radar_labels = ["Administration", "Beratung", "Informatik", "IT-Management", "SW-Entwicklung"];
    $scope.radar_data = [[0.23, 0.2, 0.23, 0.41, 0.23]];

    this.isOpen = false;

    // Info Card End

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
                    $scope.addMarker("marker"+$scope.universities.length, parseFloat(tmpObject.universityLatitude), parseFloat(tmpObject.universityLongitude), tmpObject.universityLabel, tmpObject.universityURI);
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
                hotosm: {
                    name: 'HOTOSM',
                    url: 'http://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
                    type: 'xyz'
                },
                toner: {
                    name: 'Stamen Toner',
                    url: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
                    type: 'xyz'
                },
                watercolor: {
                    name: 'Watercolor',
                    url: 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png',
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
        maxbounds: {
            northEast: {
                lat: 55.4524,
                lng: 17.644
            },
            southWest: {
                lat: 45.6179,
                lng: 5.2295
            }
        },
        defaults: {
            minZoom: 5,
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

studysearchApp.controller('Error404Ctrl', function($scope, $location){
    $scope.errorURL = $location.absUrl();
});