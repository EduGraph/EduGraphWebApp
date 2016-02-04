# Get all Universtity based on EduGraph and DBpedia

Endpoint: http://fbwsvcdev.fh-brandenburg.de:8080/fuseki/

SPARQL
```sparql
PREFIX schema: <http://schema.org/>
PREFIX bise: <http://akwi.de/ns/bise#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX dbpedia: <http://dbpedia.org/resource/>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
PREFIX sc: <http://purl.org/science/owl/sciencecommons/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?uri ?name ?alternateName ?city ?cityName ?lat ?lon
WHERE {
    ?uri a schema:CollegeOrUniversity .
    ?uri schema:name ?name .
    ?uri schema:alternateName ?alternateName .
    ?uri schema:location ?city .

    SERVICE <http://DBpedia.org/sparql> {
        ?city geo:lat ?lat .
        ?city geo:long ?lon .
        ?city rdfs:label ?cityName
    }

    FILTER ( lang(?cityName) = "de" )
}
LIMIT 100

````

JavaScript

```javascript
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
``