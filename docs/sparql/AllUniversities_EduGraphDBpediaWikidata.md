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

SELECT *
    {
		?university a schema:CollegeOrUniversity.
  		OPTIONAL {

  		}
		SERVICE <http://de.dbpedia.org/sparql/> {

			?university rdfs:label ?label;
						rdfs:comment ?comment;
					    dbpedia-owl:locationCity ?city;
		    			owl:sameAs ?wikidataURI.
      		OPTIONAL {
            	?university dbo:abstract ?abstract.
  			}
      		OPTIONAL {
            	?university foaf:homepage ?homepage.
  			}
      		OPTIONAL {
            	?university dbpedia-owl:thumbnail ?thumbnail.
  			}
    		OPTIONAL{
      			?university dbpedia-owl:numberOfStudents ?numberOfStudents;
		        dbpedia-owl:staff ?numberOfStaff;
        		<http://de.dbpedia.org/property/davonProfessoren> ?numberOfProf.
    		}
    		OPTIONAL{
    		    ?university <http://de.dbpedia.org/property/gründungsdatum> ?foundingDate
    		}

    		FILTER regex(?wikidataURI,'^http://wikidata.org/entity/','i')
    		BIND(URI(REPLACE(STR(?wikidataURI), "http://", "http://www.")) AS ?wikidataURINew)
		}
  		OPTIONAL {
			SERVICE <http://query.wikidata.org/sparql> {
				?wikidataURINew wdt:P625 ?geoLatLon.
				BIND(STR(?geoLatLon) AS ?geoLatLonStr)
                BIND(STRBEFORE(STRAFTER(?geoLatLonStr, "Point("), " ") AS ?lat)
                BIND(STRBEFORE(STRAFTER(?geoLatLonStr, " "), ")") AS ?long)
  			}
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