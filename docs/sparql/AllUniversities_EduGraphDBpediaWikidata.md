# Universities with Metadata from DBpedia and Wikidata based on EduGraph

Endpoint: http://fbwsvcdev.fh-brandenburg.de:8080/fuseki/


```sparql
PREFIX schema: <http://schema.org/>
PREFIX dcterms:<http://purl.org/dc/terms/>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>

PREFIX dbpedia-de:<http://de.dbpedia.org/resource/>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbr: <http://dbpedia.org/resource/>
PREFIX wd: <http://www.wikidata.org/entity/>
PREFIX wdt: <http://www.wikidata.org/prop/direct/>
PREFIX wikibase: <http://wikiba.se/ontology#>

PREFIX geo:<http://www.w3.org/2003/01/geo/wgs84_pos#>

SELECT DISTINCT
	?universityURI ?universityLabel ?universityHomepage ?universityLatitude ?universityLongitude
	?universityLocationURI ?universityLocationLabel ?universityLocationLatitude ?universityLocationLongitude
{
    ?universityURI a schema:CollegeOrUniversity.
    OPTIONAL {

    }
    SERVICE <http://de.dbpedia.org/sparql/> {
        ?universityURI rdfs:label ?universityLabel;
            rdfs:comment ?comment;
            dbpedia-owl:locationCity ?city;
            owl:sameAs ?universitySameAs.

            ?city owl:sameAs ?citySameAsURI

        OPTIONAL {
            ?universityURI dbo:abstract ?abstract.
        }
        OPTIONAL {
            ?universityURI foaf:homepage ?universityHomepage.
        }
        OPTIONAL {
            ?universityURI dbpedia-owl:thumbnail ?thumbnail.
        }
        OPTIONAL{
            ?universityURI dbpedia-owl:numberOfStudents ?numberOfStudents;
            dbpedia-owl:staff ?numberOfStaff;
            <http://de.dbpedia.org/property/davonProfessoren> ?numberOfProf.
        }
        OPTIONAL{
            ?universityURI <http://de.dbpedia.org/property/gründungsdatum> ?foundingDate
        }

        FILTER regex(?universitySameAs,'^http://wikidata.org/entity/','i')
        BIND(URI(REPLACE(STR(?universitySameAs), "http://", "http://www.")) AS ?universityURIWikidata)

        FILTER regex(?citySameAsURI,'^http://wikidata.org/entity/','i')
        BIND(URI(REPLACE(STR(?citySameAsURI), "http://", "http://www.")) AS ?cityWikiDataURI)
    }

    SERVICE <http://query.wikidata.org/sparql> {
        ?universityURIWikidata wdt:P625 ?universityLatLon.

        BIND(STR(?universityLatLon) AS ?universityLatLonStr)
        BIND(STRBEFORE(STRAFTER(?universityLatLonStr, "Point("), " ") AS ?universityLatitude)
        BIND(STRBEFORE(STRAFTER(?universityLatLonStr, " "), ")") AS ?universityLongitude)

        ?cityWikiDataURI rdfs:label ?cityLabelLang;
           wdt:P625 ?universityLocationLatLon.

        BIND(?cityWikiDataURI AS ?universityLocationURI)
        FILTER (langMatches(lang(?cityLabelLang),"de"))
        BIND (str(?cityLabelLang) AS ?universityLocationLabel)

        BIND(STR(?universityLocationLatLon) AS ?universityLocationLatLonStr)
        BIND(STRBEFORE(STRAFTER(?universityLocationLatLonStr, "Point("), " ") AS ?universityLocationLatitude)
        BIND(STRBEFORE(STRAFTER(?universityLocationLatLonStr, " "), ")") AS ?universityLocationLongitude)
    }
}
```


Beispieldaten im Triple-Store:
```sparql
dbpedia-de:Hochschule_Merseburg a schema:CollegeOrUniversity.
dbpedia-de:Hochschule_Aalen a schema:CollegeOrUniversity.
dbpedia-de:Hochschule_Mainz a schema:CollegeOrUniversity.
```


## ToDo
* Datenkonvertierung
* Sprache Filterung
