/*
 * controllers.js
 */

/*
 * Top-Level Controller für die Steuerung anwendungsübergreifender Programmteile
 */
studysearchApp.controller('AppCtrl', function($scope){
    $scope.filter = {
        'pillars': {
            'BAM': false, // Business Administration Management
            'BIS': false, // Business Information Systems
            'CSC': false // Computer Science
        },
        'jobs': {
            'ADM': false,
            'CON': false,
            'INF': false,
            'ITM': false,
            'SWE': false
        }
    };
});

/*
 * Startseiten Controller
 *
 * Controller für die Startseite
 */
studysearchApp.controller('MainCtrl', function($scope) {
    $scope.toggleCheckBox = function(group, id){
        $scope.$parent.filter[group][id] = $scope.$parent.filter[group][id] ? false : true;
    };
});

/*
 * Karten Controller
 *
 * Controller für die Kartenansicht.
 */
studysearchApp.controller('MapCtrl', function($scope, $location, leafletMarkerEvents, leafletData, $mdSidenav, SPARQLQueryService, $timeout){
    // Deklaration des Universitätslisten Arrays
    $scope.universities = [];

    // Deklaration und Initialisierung der Universitätsinfo Diagramme
    $scope.pillarChartLabels = ["Sonstiges", "Betriebswirtschaft", "Wirtschaftsinformatik", "Informatik"];
    $scope.pillarChartData = [0, 0, 0, 0];
    $scope.pillarChartColor = ["#ECEFF1", "#FDB45C", "#F7464A", "#97BBCD"];
    $scope.pillarChartOptions = {
        animateRotate : false,
        animateScale : false,
        tooltipTemplate: '<%=label%> <%= Math.round(circumference / 6.283 * 100) %> %' // Adds custom tooltip with percentage
    };
    $scope.jobChartLabels = ["Administration", "Beratung", "Informatik", "IT-Management", "SW-Entwicklung"];
    $scope.jobChartData = [[0, 0, 0, 0, 0]];
    $scope.jobChartOptions = {
        scaleOverride: true,
        scaleSteps: 4,
        scaleStepWidth: 0.125,
        showTooltips: false
    };

    // Controller Funktion für die SPARQL Abfrage
    $scope.queryUniversity = function(){
        var options = {};
        options.filter = $scope.$parent.filter;
        // Aufruf des SPARQL Endpoint über die SPARQLQueryService
        SPARQLQueryService.getUniversities(options).then(
            // Funktion bei Erfolg
            function successCallback(response) {
                // Leeren des aktuellen Universities Scope
                $scope.universities = [];
                $scope.markers = {};
                var responseData = response.data.results.bindings;
                for (var arrayElement in responseData) {
                    var tmpObject = {};
                    for (var objectProperty in responseData[arrayElement]) {
                        tmpObject[objectProperty] = responseData[arrayElement][objectProperty].value
                    }
                    $scope.universities.push(tmpObject);
                    // Hinzufügen der Marker auf der Karte
                    $scope.addMarker("marker"+$scope.universities.length, parseFloat(tmpObject.universityLatitude), parseFloat(tmpObject.universityLongitude), tmpObject.universityLabel, tmpObject.universityURI);
                }
            },
            // Funktion bei Fehler
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
        //console.log(name, latitude, longitude, message);
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
    var leafletInitiateOptions = {
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
                    type: 'xyz',
                    layerOptions: {
                        attribution:
                            '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap-Mitwirkende</a>. ' +
                            'Tiles courtesy of <a target="_blank" href="http://hot.openstreetmap.org/">Humanitarian OpenStreetMap Team</a>'
                    }
                },
                toner: {
                    name: 'Stamen Toner',
                    url: 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
                    type: 'xyz',
                    layerOptions: {
                        attribution:
                        '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap-Mitwirkende</a>. ' +
                        'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ' +
                        'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>'
                    }
                },
                watercolor: {
                    name: 'Watercolor',
                    url: 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.png',
                    type: 'xyz',
                    layerOptions: {
                        attribution:
                        '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap-Mitwirkende</a>. ' +
                        'Map tiles by <a href="http://stamen.com/">Stamen Design</a>, ' +
                        'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>'
                    }
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
            scrollWheelZoom: true,
            tap: true
        }
    };
    angular.extend($scope, leafletInitiateOptions);

    /*
     * Setzen von Eventbehandlung auf die Leaflet Marker
     */
    var markerEvents = leafletMarkerEvents.getAvailableEvents();
    for (var k in markerEvents){
        var eventName = 'leafletDirectiveMarker.universityMap.' + markerEvents[k];
        $scope.$on(eventName, function(event, args){
            console.log(event,args);
            if(event.name == 'leafletDirectiveMarker.universityMap.click'){
                var chosenUniversityURI = $scope.markers[args.modelName].uri;
                $scope.openUniversityByURI(chosenUniversityURI);
            }
        });
    }

    /*
     * Öffnen der Universitäts sidenav mit dem Inhalt basierend auf der angegebenen URI
     */
    $scope.openUniversityByURI = function(universityURI){
        for(var i = 0; i < $scope.universities.length; i++){
            if($scope.universities[i].universityURI == universityURI){
                $scope.chosenUniversity = $scope.universities[i];
                //console.log($scope.chosenUniversity);
            }
        }
        var bamPillar = parseFloat($scope.chosenUniversity.degreeProgramBAMPillar);
        var bisPillar = parseFloat($scope.chosenUniversity.degreeProgramCSCPillar);
        var cscPillar = parseFloat($scope.chosenUniversity.degreeProgramBISPillar);
        var other = (1.0 - (bamPillar+cscPillar+bisPillar)).toFixed(2);
        $scope.pillarChartData = [
            other, bamPillar, bisPillar, cscPillar
        ];
        //    $scope.jobChartLabels = ["Administration", "Beratung", "Informatik", "IT-Management", "SW-Entwicklung"];
        $scope.jobChartData = [[
            parseFloat($scope.chosenUniversity.degreeProgramJobADM),
            parseFloat($scope.chosenUniversity.degreeProgramJobCON),
            parseFloat($scope.chosenUniversity.degreeProgramJobINF),
            parseFloat($scope.chosenUniversity.degreeProgramJobITM),
            parseFloat($scope.chosenUniversity.degreeProgramJobSWE)
        ]];
        $scope.universityInfoSidenavLock = true;
    };

    /*
     * Deklaration und Initialisierung der Universitätsinfo sidenav und einer Funktion
     * zum öffnen und schließen.
     */
    $scope.universityInfoSidenavLock = false;
    $scope.toggleUniversityInfoSidenav = function(){
        $scope.universityInfoSidenavLock = $scope.universityInfoSidenavLock ? false : true;
    };
    $scope.$watch('universityInfoSidenavLock', function(newVal, oldVal){
        if(newVal){
            $scope.universityListSidenavLock = false;
        }
    });

    /*
     * Deklaration und Initialisierung der Universitätsliste sidenav und einer Funktion
     * zum öffnen und schließen.
     */
    $scope.universityListSidenavLock = true;
    $scope.toggleUniversityListSidenav = function(){
        $scope.universityListSidenavLock = $scope.universityListSidenavLock ? false : true;
        $scope.invalidateMap();
    };
    $scope.$watch('universityListSidenavLock', function(newVal, oldVal){
        if(newVal){
            $scope.universityInfoSidenavLock = false;
        }
    });

    /*
     * Invalidieren der Karte. Behebt einen Fehler, durch den Teile der Karte ausgegraut waren
     * und keine Kacheln geladen wurden.
     */
    $scope.invalidateMap = function(){
        leafletData.getMap().then(function(map){
            map.invalidateSize();
            //console.log("Size invalidated by timeout.");
        });
    };

    /*
     * Timeout Funktion für das invalidieren der Karte.
     */
    $timeout(function(){
        $scope.invalidateMap();
    });

    // Nach dem vollständigen Laden des Controllers, Ausführen der ersten Abfrage von Universitäten.
    $scope.queryUniversity();
});

/*
 * Controller für die Ausgabe von 404 Seiten.
 */
studysearchApp.controller('Error404Ctrl', function($scope, $location){
    $scope.errorURL = $location.absUrl();
});