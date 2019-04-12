<?php
    include("./defaultStart.php");

    header("Content-type: application/json");
    echo "{";

    $codiceVersione = isset($_GET['codiceVersione']) ? $_GET['codiceVersione'] : null;

    $SQL = 'SELECT "Oggetti_Schede".* FROM "Oggetti_Schede" JOIN "Oggetti_RelazioniSchede" ON "Oggetti_Schede"."CodiceScheda" = "Oggetti_RelazioniSchede"."CodiceScheda" JOIN "OggettiVersion" ON "Oggetti_RelazioniSchede"."CodiceOggetto" = "OggettiVersion"."CodiceOggetto" WHERE "OggettiVersion"."Codice" = ' . $codiceVersione;
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }
    echo '"InformazioniOggetto": ' . json_encode($rowArray);

    $SQL = 'SELECT "OggettiVersion_Schede".* FROM "OggettiVersion_Schede" JOIN "OggettiVersion_RelazioniSchede" ON "OggettiVersion_Schede"."CodiceScheda" = "OggettiVersion_RelazioniSchede"."CodiceScheda" WHERE "OggettiVersion_RelazioniSchede"."CodiceVersione" = ' . $codiceVersione;
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }
    echo ', "InformazioniVersione": ' . json_encode($rowArray);

    echo "}";

    include("./defaultEnd.php");
?>