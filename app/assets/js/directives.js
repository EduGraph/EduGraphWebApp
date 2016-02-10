/*
 * directives.js
 */

/*
 * Direktive für die Universitätsinfo sidenav
 */
studysearchApp.directive('universityInfobox', function(){
    return {
        restrict: 'E',
        templateUrl: 'templates/universityInfobox.tpl.html',
        replace: true
    }
});