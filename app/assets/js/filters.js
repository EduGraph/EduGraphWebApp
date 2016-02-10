/*
 * filters.js
 *
 * Definition von Filtern für einzelne Modelle und Arrays.
 */

/*
 * Filter für das Encodieren von URLs.
 */
studysearchApp.filter('urlencode', function(){
    return window.encodeURIComponent;
});