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

    echo "}";

    include("./defaultEnd.php");
?>