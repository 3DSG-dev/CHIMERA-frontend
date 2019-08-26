<?php
    include("./defaultStart.php");

    header("Content-type: application/json");
    echo "{";

    $codiceCategoria = isset($_GET['codiceCategoria']) ? $_GET['codiceCategoria'] : null;

    $SQL = 'SELECT "CodiceScheda" FROM "Oggetti_CategorieSchede" WHERE "CodiceCategoria" = ' . $codiceCategoria;
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }
    echo '"SchedeVisibiliOggetto": ' . json_encode($rowArray);

    $SQL = 'SELECT "CodiceScheda" FROM "OggettiVersion_CategorieSchede" WHERE "CodiceCategoria" = ' . $codiceCategoria;
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }
    echo ', "SchedeVisibiliVersione": ' . json_encode($rowArray);

    $SQL = 'SELECT "CodiceScheda" FROM "OggettiSubVersion_CategorieSchede" WHERE "CodiceCategoria" = ' . $codiceCategoria;
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }
    echo ', "SchedeVisibiliSubVersion": ' . json_encode($rowArray);

    $SQL = 'SELECT "CodiceScheda" FROM "InterventiSubVersion_CategorieSchede" WHERE "CodiceCategoria" = ' . $codiceCategoria;
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }
    echo ', "SchedeVisibiliInterventiSubVersion": ' . json_encode($rowArray);

    echo "}";

    include("./defaultEnd.php");
?>