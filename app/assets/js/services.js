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
            cache: studysearchConfig.cacheSPARQLQueries,
            headers: {
                accept: 'application/sparql-results+json; charset=utf-8application/sparql-results+json; charset=utf-8',
            },
            url: studysearchConfig.sparqlEndpoint,
            //url: 'examples/institutions.json',
            params: {
                'query': '' +
                'PREFIX schema: <http://schema.org/> ' +
                'PREFIX dcterms:<http://purl.org/dc/terms/> ' +
                'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
                'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ' +
                'PREFIX owl: <http://www.w3.org/2002/07/owl#> ' +
                'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> ' +
                'PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' +
                ' ' +
                'PREFIX dbpedia-de:<http://de.dbpedia.org/resource/> ' +
                'PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> ' +
                'PREFIX dbo: <http://dbpedia.org/ontology/> ' +
                'PREFIX dbr: <http://dbpedia.org/resource/> ' +
                'PREFIX wd: <http://www.wikidata.org/entity/> ' +
                'PREFIX wdt: <http://www.wikidata.org/prop/direct/> ' +
                'PREFIX wikibase: <http://wikiba.se/ontology#> ' +
                ' ' +
                'PREFIX geo:<http://www.w3.org/2003/01/geo/wgs84_pos#> ' +
                ' ' +
                'SELECT DISTINCT ' +
                '	?universityURI ?universityLabel ?universityHomepage ?universityLatitude ?universityLongitude ' +
                '	?universityLocationURI ?universityLocationLabel ?universityLocationLatitude ?universityLocationLongitude ' +
                '{ ' +
                '    ?universityURI a schema:CollegeOrUniversity. ' +
                '    OPTIONAL { ' +
                ' ' +
                '    } ' +
                '    SERVICE <http://de.dbpedia.org/sparql/> { ' +
                '        ?universityURI rdfs:label ?universityLabel; ' +
                '            rdfs:comment ?comment; ' +
                '            dbpedia-owl:locationCity ?city; ' +
                '            owl:sameAs ?universitySameAs. ' +
                ' ' +
                '            ?city owl:sameAs ?citySameAsURI ' +
                ' ' +
                '        OPTIONAL { ' +
                '            ?universityURI dbo:abstract ?abstract. ' +
                '        } ' +
                '        OPTIONAL { ' +
                '            ?universityURI foaf:homepage ?universityHomepage. ' +
                '        } ' +
                '        OPTIONAL { ' +
                '            ?universityURI dbpedia-owl:thumbnail ?thumbnail. ' +
                '        } ' +
                '        OPTIONAL{ ' +
                '            ?universityURI dbpedia-owl:numberOfStudents ?numberOfStudents; ' +
                '            dbpedia-owl:staff ?numberOfStaff; ' +
                '            <http://de.dbpedia.org/property/davonProfessoren> ?numberOfProf. ' +
                '        } ' +
                '        OPTIONAL{ ' +
                '            ?universityURI <http://de.dbpedia.org/property/gründungsdatum> ?foundingDate ' +
                '        } ' +
                ' ' +
                '        FILTER regex(?universitySameAs,"^http://wikidata.org/entity/","i") ' +
                '        BIND(URI(REPLACE(STR(?universitySameAs), "http://", "http://www.")) AS ?universityURIWikidata) ' +
                ' ' +
                '        FILTER regex(?citySameAsURI,"^http://wikidata.org/entity/","i") ' +
                '        BIND(URI(REPLACE(STR(?citySameAsURI), "http://", "http://www.")) AS ?cityWikiDataURI) ' +
                '    } ' +
                ' ' +
                '    SERVICE <http://query.wikidata.org/sparql> { ' +
                '        ?universityURIWikidata wdt:P625 ?universityLatLon. ' +
                ' ' +
                '        BIND(STR(?universityLatLon) AS ?universityLatLonStr) ' +
                '        BIND(STRBEFORE(STRAFTER(?universityLatLonStr, "Point("), " ") AS ?universityLatitude) ' +
                '        BIND(STRBEFORE(STRAFTER(?universityLatLonStr, " "), ")") AS ?universityLongitude) ' +
                ' ' +
                '        ?cityWikiDataURI rdfs:label ?cityLabelLang; ' +
                '           wdt:P625 ?universityLocationLatLon. ' +
                ' ' +
                '        BIND(?cityWikiDataURI AS ?universityLocationURI) ' +
                '        FILTER (langMatches(lang(?cityLabelLang),"de")) ' +
                '        BIND (str(?cityLabelLang) AS ?universityLocationLabel) ' +
                ' ' +
                '        BIND(STR(?universityLocationLatLon) AS ?universityLocationLatLonStr) ' +
                '        BIND(STRBEFORE(STRAFTER(?universityLocationLatLonStr, "Point("), " ") AS ?universityLocationLatitude) ' +
                '        BIND(STRBEFORE(STRAFTER(?universityLocationLatLonStr, " "), ")") AS ?universityLocationLongitude) ' +
                '    } ' +
                '} '
                /*"PREFIX schema: <http://schema.org/>" +
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
                "}"*/
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
            cache: studysearchConfig.cacheSPARQLQueries,
            headers: {
                accept: 'application/sparql-results+json; charset=utf-8application/sparql-results+json; charset=utf-8',
            },
            url: studysearchConfig.sparqlEndpoint,
            //url: 'examples/institutions.json',
            params: {
                'query': "" +
                'PREFIX schema: <http://schema.org/> ' +
                'PREFIX dcterms:<http://purl.org/dc/terms/> ' +
                'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> ' +
                'PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> ' +
                'PREFIX owl: <http://www.w3.org/2002/07/owl#> ' +
                'PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> ' +
                'PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' +
                ' ' +
                'PREFIX dbpedia-de:<http://de.dbpedia.org/resource/> ' +
                'PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> ' +
                'PREFIX dbo: <http://dbpedia.org/ontology/> ' +
                'PREFIX dbr: <http://dbpedia.org/resource/> ' +
                'PREFIX wd: <http://www.wikidata.org/entity/> ' +
                'PREFIX wdt: <http://www.wikidata.org/prop/direct/> ' +
                'PREFIX wikibase: <http://wikiba.se/ontology#> ' +
                ' ' +
                'PREFIX geo:<http://www.w3.org/2003/01/geo/wgs84_pos#> ' +
                ' ' +
                'SELECT DISTINCT ' +
                '	?universityURI ?universityLabel ?universityHomepage ?universityLatitude ?universityLongitude ' +
                '	?universityLocationURI ?universityLocationLabel ?universityLocationLatitude ?universityLocationLongitude ' +
                '{ ' +
                'VALUES ?universityURI { ' +
                '    <'+ decodedUri +'>' +
                '}' +
                '    ?universityURI a schema:CollegeOrUniversity. ' +
                '    OPTIONAL { ' +
                ' ' +
                '    } ' +
                '    SERVICE <http://de.dbpedia.org/sparql/> { ' +
                '        ?universityURI rdfs:label ?universityLabel; ' +
                '            rdfs:comment ?comment; ' +
                '            dbpedia-owl:locationCity ?city; ' +
                '            owl:sameAs ?universitySameAs. ' +
                ' ' +
                '            ?city owl:sameAs ?citySameAsURI ' +
                ' ' +
                '        OPTIONAL { ' +
                '            ?universityURI dbo:abstract ?abstract. ' +
                '        } ' +
                '        OPTIONAL { ' +
                '            ?universityURI foaf:homepage ?universityHomepage. ' +
                '        } ' +
                '        OPTIONAL { ' +
                '            ?universityURI dbpedia-owl:thumbnail ?thumbnail. ' +
                '        } ' +
                '        OPTIONAL{ ' +
                '            ?universityURI dbpedia-owl:numberOfStudents ?numberOfStudents; ' +
                '            dbpedia-owl:staff ?numberOfStaff; ' +
                '            <http://de.dbpedia.org/property/davonProfessoren> ?numberOfProf. ' +
                '        } ' +
                '        OPTIONAL{ ' +
                '            ?universityURI <http://de.dbpedia.org/property/gründungsdatum> ?foundingDate ' +
                '        } ' +
                ' ' +
                '        FILTER regex(?universitySameAs,"^http://wikidata.org/entity/","i") ' +
                '        BIND(URI(REPLACE(STR(?universitySameAs), "http://", "http://www.")) AS ?universityURIWikidata) ' +
                ' ' +
                '        FILTER regex(?citySameAsURI,"^http://wikidata.org/entity/","i") ' +
                '        BIND(URI(REPLACE(STR(?citySameAsURI), "http://", "http://www.")) AS ?cityWikiDataURI) ' +
                '    } ' +
                ' ' +
                '    SERVICE <http://query.wikidata.org/sparql> { ' +
                '        ?universityURIWikidata wdt:P625 ?universityLatLon. ' +
                ' ' +
                '        BIND(STR(?universityLatLon) AS ?universityLatLonStr) ' +
                '        BIND(STRBEFORE(STRAFTER(?universityLatLonStr, "Point("), " ") AS ?universityLatitude) ' +
                '        BIND(STRBEFORE(STRAFTER(?universityLatLonStr, " "), ")") AS ?universityLongitude) ' +
                ' ' +
                '        ?cityWikiDataURI rdfs:label ?cityLabelLang; ' +
                '           wdt:P625 ?universityLocationLatLon. ' +
                ' ' +
                '        BIND(?cityWikiDataURI AS ?universityLocationURI) ' +
                '        FILTER (langMatches(lang(?cityLabelLang),"de")) ' +
                '        BIND (str(?cityLabelLang) AS ?universityLocationLabel) ' +
                ' ' +
                '        BIND(STR(?universityLocationLatLon) AS ?universityLocationLatLonStr) ' +
                '        BIND(STRBEFORE(STRAFTER(?universityLocationLatLonStr, "Point("), " ") AS ?universityLocationLatitude) ' +
                '        BIND(STRBEFORE(STRAFTER(?universityLocationLatLonStr, " "), ")") AS ?universityLocationLongitude) ' +
                '    } ' +
                '} '
                /*"PREFIX schema: <http://schema.org/>" +
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
                "}"*/
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