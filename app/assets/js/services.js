studysearchApp.factory('SPARQLQueryService', function($http, studysearchConfig) {
    // Erlaube Zugriff mittels CORS Header
    $http.defaults.useXDomain = true;

    var srv = {};

    /*
     * Erstellt eine SPARQL Abfrage aller schema:CollegeOrUniversity mit einigen Daten und gibt ein Promise-Objekt
     * zurück.
     *
     * @param {object} options - Optionen für die Abfrage.
     * @returns {object} promise - Gibt ein Promise auf das SPARQL Query zurück.
     */
    srv.getUniversities = function(options){
        // Aufruf des SPARQL Endpoint
        return $http({
            method: 'GET',
            headers: {
                accept: 'application/sparql-results+json; charset=utf-8application/sparql-results+json; charset=utf-8',
            },
            url: studysearchConfig.sparqlEndpoint,
            //url: 'examples/institutions.json',
            params: {
                'query': "" +
                "PREFIX schema: <http://schema.org/>" +
                "PREFIX bise: <http://akwi.de/ns/bise#>" +
                "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>" +
                "PREFIX dbpedia: <http://dbpedia.org/resource/>" +
                "PREFIX owl: <http://www.w3.org/2002/07/owl#>" +
                "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>" +
                "PREFIX sc: <http://purl.org/science/owl/sciencecommons/>" +
                "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +

                "SELECT ?uri ?url ?name ?locationUri ?locationName ?lat ?lon " +
                "WHERE {" +
                "?uri a schema:CollegeOrUniversity ." +
                "?uri schema:url ?url ." +
                "?uri schema:name ?name ." +
                "?uri schema:location ?locationUri ." +
                "?locationUri schema:name ?locationName ." +
                "?locationUri schema:geo ?geo ." +
                "?geo schema:latitude ?lat ." +
                "?geo schema:longitude ?lon" +
                "}"
            }
        });
    };

    /*
     * Erstellt eine SPARQL Abfrage für Informationen zu einem schema:CollegeOrUniversity und gibt ein Promise Objekt
     * zurück.
     *
     * @param {string} uri - URI der schema:CollegeOrUniversity
     * @param {object} options - Optionen für die Abfrage.
     * @returns {object} promise - Gibt ein Promise auf das SPARQL Query zurück.
     */
    srv.getUniversityByUri = function(uri, options){
        /*
         * Doppeltes dekodieren vorherig doppelt enkodierter URI.
         */
        decodedUri = decodeURIComponent(decodeURIComponent(uri));

        return $http({
            method: 'GET',
            headers: {
                accept: 'application/sparql-results+json; charset=utf-8application/sparql-results+json; charset=utf-8',
            },
            url: studysearchConfig.sparqlEndpoint,
            //url: 'examples/institutions.json',
            params: {
                'query': "PREFIX schema: <http://schema.org/>" +
                "PREFIX bise: <http://akwi.de/ns/bise#>" +
                "PREFIX skos: <http://www.w3.org/2004/02/skos/core#>" +
                "PREFIX dbpedia: <http://dbpedia.org/resource/>" +
                "PREFIX owl: <http://www.w3.org/2002/07/owl#>" +
                "PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>" +
                "PREFIX sc: <http://purl.org/science/owl/sciencecommons/>" +
                "PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>" +

                "SELECT ?uri ?url ?name ?locationUri ?locationName ?lat ?lon " +
                "WHERE {" +
                "VALUES ?uri {" +
                "<"+ decodedUri +">" +
                "}" +
                "?uri a schema:CollegeOrUniversity ." +
                "?uri schema:url ?url ." +
                "?uri schema:name ?name ." +
                "?uri schema:location ?locationUri ." +
                "?locationUri schema:name ?locationName ." +
                "?locationUri schema:geo ?geo ." +
                "?geo schema:latitude ?lat ." +
                "?geo schema:longitude ?lon" +
                "}"
            }
        });
    };

    return {
        getUniversities: function(options){
            if(typeof options === 'undefined'){ options = null; }
            return srv.getUniversities(options);
        },
        getUniversityByUri: function(uri, options){
            if(typeof options === 'undefined'){ options = null; }
            console.log(uri, options);
            return srv.getUniversityByUri(uri, options);
        }
    };
});