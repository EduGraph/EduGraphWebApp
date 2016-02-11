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
                'PREFIX bise: <http://akwi.de/ns/bise#> ' +
                'PREFIX dbpedia-de:<http://de.dbpedia.org/resource/> ' +
                'PREFIX dbpedia-owl: <http://dbpedia.org/ontology/> ' +
                'PREFIX dbo: <http://dbpedia.org/ontology/> ' +
                'PREFIX dbr: <http://dbpedia.org/resource/> ' +
                'PREFIX wd: <http://www.wikidata.org/entity/> ' +
                'PREFIX wdt: <http://www.wikidata.org/prop/direct/> ' +
                'PREFIX wikibase: <http://wikiba.se/ontology#> ' +
                'PREFIX geo:<http://www.w3.org/2003/01/geo/wgs84_pos#> ' +
                ' ' +
                'SELECT ' +
                '	?universityURI ?universityLabel ?universityHomepage ?universityLatitude ?universityLongitude ' +
                '	?universityLocationURI ?universityLocationLabel ?universityLocationLatitude ?universityLocationLongitude ' +
                '   ?degreeProgramURI ?degreeProgramLabel ?degreeProgramHomepage ?degreeProgramCreditPoints ?degreeProgramPeriodOfStudy ' +
                '   ?degreeProgramBAMPillar ?degreeProgramBISPillar ?degreeProgramCSCPillar ?degreeProgramRankingCHE ' +
                '   ?degreeProgramJobADM ?degreeProgramJobCON ?degreeProgramJobINF ?degreeProgramJobITM ?degreeProgramJobSWE ' +
                '{ ' +
                '?universityURI a schema:CollegeOrUniversity; ' +
                'rdfs:label ?universityLabel_lang; ' +
                'foaf:homepage ?universityHomepage; ' +
                'geo:lat ?universityLatitude; ' +
                'geo:long ?universityLongitude; ' +
                'schema:location ?universityLocationURI. ' +
                'OPTIONAL { ' +
                '    ?universityURI dbpedia-owl:thumbnail ?universitythumbnail; ' +
                '} ' +
                '?degreeProgramURI a bise:BISEBachelor; '+
                '	schema:provider ?universityURI; '+
                '	bise:bisePillar ?degreeProgramPillars; '+
                '	bise:cpECTS ?degreeProgramCreditPoints; '+
                '	bise:stPeriodOfStudy ?degreeProgramPeriodOfStudy; '+
                '	schema:name ?degreeProgramLabel; '+
                '	schema:url ?degreeProgramHomepage. '+
                '?degreeProgramPillars bise:pillarBAM ?degreeProgramBAMPillar; '+
                '	bise:pillarBIS ?degreeProgramBISPillar; '+
                '	bise:pillarCSC ?degreeProgramCSCPillar. '+
                '?rankingURI schema:itemReviewed  ?degreeProgramURI; '+
                '   a schema:Rating; '+
                '   schema:ratingValue ?degreeProgramRankingCHE. '+
                (options.filter.pillars.BAM ? 'FILTER (?degreeProgramBAMPillar >= '+studysearchConfig.pillarEmphasisValue+') ' : '') +
                (options.filter.pillars.BIS ? 'FILTER (?degreeProgramBISPillar >= '+studysearchConfig.pillarEmphasisValue+') ' : '') +
                (options.filter.pillars.CSC ? 'FILTER (?degreeProgramCSCPillar >= '+studysearchConfig.pillarEmphasisValue+') ' : '') +
                '	BIND((?degreeProgramCSCPillar) AS ?degreeProgramJobADM) '+
                '  	BIND(((?degreeProgramBAMPillar+?degreeProgramBISPillar)/2) AS ?degreeProgramJobCON) '+
                '	BIND((?degreeProgramCSCPillar) AS ?degreeProgramJobINF) '+
                '	BIND(((?degreeProgramBAMPillar+?degreeProgramBISPillar)/2) AS ?degreeProgramJobITM) '+
                '	BIND((?degreeProgramCSCPillar) AS ?degreeProgramJobSWE) '+
                (options.filter.jobs.ADM ? 'FILTER (?degreeProgramJobADM >= '+studysearchConfig.jobEmphasisValue+') ' : '') +
                (options.filter.jobs.CON ? 'FILTER (?degreeProgramJobCON >= '+studysearchConfig.jobEmphasisValue+') ' : '') +
                (options.filter.jobs.INF ? 'FILTER (?degreeProgramJobINF >= '+studysearchConfig.jobEmphasisValue+') ' : '') +
                (options.filter.jobs.ITM ? 'FILTER (?degreeProgramJobITM >= '+studysearchConfig.jobEmphasisValue+') ' : '') +
                (options.filter.jobs.SWE ? 'FILTER (?degreeProgramJobSWE >= '+studysearchConfig.jobEmphasisValue+') ' : '') +
                'FILTER (langMatches(lang(?universityLabel_lang),"de")) ' +
                'BIND (str(?universityLabel_lang) AS ?universityLabel) ' +
                ' '+
                '?universityLocationURI rdfs:label ?universityLocationLabel_lang; ' +
                'schema:geo [ ' +
                '   schema:latitude ?universityLocationLatitude; ' +
                '   schema:longitude ?universityLocationLongitude; ' +
                '] '+
                'FILTER (langMatches(lang(?universityLocationLabel_lang),"de")) ' +
                'BIND (str(?universityLocationLabel_lang) AS ?universityLocationLabel) ' +
                '} '

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
                '?universityURI a schema:CollegeOrUniversity;' +
                'rdfs:label ?universityLabel_lang;' +
                'foaf:homepage ?universityHomepage;' +
                'geo:lat ?universityLatitude;' +
                'geo:long ?universityLongitude; ' +
                'schema:location ?universityLocationURI.' +
                'OPTIONAL {' +
                '    ?universityURI dbpedia-owl:thumbnail ?universitythumbnail;' +
                '}' +
                '' +
                'FILTER (langMatches(lang(?universityLabel_lang),"de"))' +
                'BIND (str(?universityLabel_lang) AS ?universityLabel)' +
                ''+
                '?universityLocationURI rdfs:label ?universityLocationLabel_lang;' +
                'schema:geo [' +
                '   schema:latitude ?universityLocationLatitude;' +
                '   schema:longitude ?universityLocationLongitude;' +
                ']'+
                ' '+
                'FILTER (langMatches(lang(?universityLocationLabel_lang),"de"))' +
                'BIND (str(?universityLocationLabel_lang) AS ?universityLocationLabel)'+
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