# All Universtities with WI from DBpedia

Sparql-Endpoint: http://de.dbpedia.org/sparql

```sparql
PREFIX dcterms:<http://purl.org/dc/terms/>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
SELECT *
WHERE {
    ?university dcterms:subject <http://de.dbpedia.org/resource/Kategorie:Fachhochschule_in_Deutschland>;
    dbpedia-owl:wikiPageWikiLink <http://de.dbpedia.org/resource/Wirtschaftsinformatik>.
}
```
