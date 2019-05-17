<?php
    include("./defaultStart.php");

    header("Content-type: application/json");
    echo "{";

    $SQL = 'SELECT "Oggetti_ListaSchede"."Titolo", "Oggetti_ListaInformazioni".* FROM "Oggetti_ListaSchede" JOIN "Oggetti_ListaInformazioni" ON "Oggetti_ListaSchede"."Codice" = "Oggetti_ListaInformazioni"."CodiceTitolo" ORDER BY "Oggetti_ListaSchede"."Posizione", "Oggetti_ListaSchede"."Titolo", "Oggetti_ListaInformazioni"."Posizione", "Oggetti_ListaInformazioni"."Campo"';
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }
    echo '"SchedeOggetto": ' . json_encode($rowArray);

    $SQL = 'SELECT "OggettiVersion_ListaSchede"."Titolo", "OggettiVersion_ListaInformazioni".* FROM "OggettiVersion_ListaSchede" JOIN "OggettiVersion_ListaInformazioni" ON "OggettiVersion_ListaSchede"."Codice" = "OggettiVersion_ListaInformazioni"."CodiceTitolo" ORDER BY "OggettiVersion_ListaSchede"."Posizione", "OggettiVersion_ListaSchede"."Titolo", "OggettiVersion_ListaInformazioni"."Posizione", "OggettiVersion_ListaInformazioni"."Campo"';
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }
    echo ', "SchedeVersione": ' . json_encode($rowArray);

    echo "}";

    include("./defaultEnd.php");
?>