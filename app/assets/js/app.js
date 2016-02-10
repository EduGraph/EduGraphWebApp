/*
 * app.js
 *
 * Definition der Web Applikation und ihrer Abhängigkeiten, sowie Konfiguration (Routing).
 */
var studysearchApp = angular.module('studysearchApp', ['ngMaterial', 'chart.js', 'ngRoute', 'leaflet-directive', 'angular-loading-bar', 'ngAnimate']);

studysearchApp.constant("studysearchConfig", {
    // SPARQL Endpoint URL
    "sparqlEndpoint": "http://fbwsvcdev.fh-brandenburg.de:8080/fuseki/EduGraphEnrichment/query",
    // SPARQL Queries cachen um Ladezeiten zu verringern
    "cacheSPARQLQueries": false,
    // Grenzwert damit Säule als Schwerpunkt gilt
    "pillarEmphasisValue": 0.3
});

/*
 * Konfiguration des Log Provider
 */
studysearchApp.config(function($logProvider){
    $logProvider.debugEnabled(false);
});

/*
 * Konfiguration des Routing.
 */
studysearchApp.config(function ($routeProvider, $locationProvider) {
    // HTML Mode
    $locationProvider.html5Mode(true);

    // Route Provider
    $routeProvider
        .when('/', {
            templateUrl: 'templates/main.tpl.html'
        })
        .when('/map', {
            templateUrl: 'templates/map.tpl.html',
            controller: 'MapCtrl'
        })
        .otherwise({
            templateUrl: 'templates/404.tpl.html',
            controller: 'Error404Ctrl'
        });
});

/*
 * Konfiguration des Angular Material Themes.
 */
studysearchApp.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default');
    /*    .primaryPalette('deep-orange')
        .accentPalette('deep-orange')
        .warnPalette('deep-orange')
        .backgroundPalette('deep-orange');*/
});

/*
 * Konfiguration des Ladebalkens.
 */
studysearchApp.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]);