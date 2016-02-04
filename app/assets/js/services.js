studysearchApp.factory('SPARQLQueryService', function($http) {
    // Erlaube Zugriff mittels CORS Header
    $http.defaults.useXDomain = true;

    var srv = {};

    srv.getUniversities = function(options){
        // Aufruf des SPARQL Endpoint
        $http({
            method: 'GET',
            headers: {
                accept: 'application/sparql-results+json; charset=utf-8application/sparql-results+json; charset=utf-8',
            },
            url: 'http://fbwsvcdev.fh-brandenburg.de:8080/fuseki/biseAPITestData/query',
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

                "SELECT ?uri ?name ?alternateName ?city ?cityName ?lat ?lon" +
                "WHERE {" +
                "?uri a schema:CollegeOrUniversity ." +
                "?uri schema:name ?name ." +
                "?uri schema:alternateName ?alternateName ." +
                "?uri schema:location ?city ." +
                "SERVICE <http://DBpedia.org/sparql> {" +
                "?city geo:lat ?lat ." +
                "?city geo:long ?lon ." +
                "?city rdfs:label ?cityName" +
                "}" +
                "FILTER ( lang(?cityName) = \"de\" )" +
                "}" +
                "LIMIT 100"
            }
        })
            .then(
            function successCallback(response) {
                return response.data.results.bindings;
            },
            function errorCallback(response) {
                console.log(response);
            }
        );
    };

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
            url: 'http://fbwsvcdev.fh-brandenburg.de:8080/fuseki/biseAPITestData/query',
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
            /*.then(
            function successCallback(response) {
                console.log(response);
                return response.data.results.bindings[0];
            },
            function errorCallback(response) {
                console.log(response);
            }
        );*/
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