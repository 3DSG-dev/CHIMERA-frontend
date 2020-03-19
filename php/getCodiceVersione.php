<?php
    include("./defaultStart.php");

    $layer0Value = isset($_GET['layer0']) ? pg_escape_literal($_GET['layer0']) : null;
    $layer1Value = isset($_GET['layer1']) ? pg_escape_literal($_GET['layer1']) : null;
    $layer2Value = isset($_GET['layer2']) ? pg_escape_literal($_GET['layer2']) : null;
    $layer3Value = isset($_GET['layer3']) ? pg_escape_literal($_GET['layer3']) : null;
    $nameValue = isset($_GET['name']) ? pg_escape_literal($_GET['name']) : null;
    $versioneValue = isset($_GET['versione']) ? pg_escape_literal($_GET['versione']) : null;

    $SQL = 'SELECT "OggettiVersion"."Codice" AS "CodiceVersione", "Type" FROM "Oggetti" JOIN "OggettiVersion" ON "Oggetti"."Codice" = "OggettiVersion"."CodiceOggetto" LEFT JOIN "Modelli3D" ON "OggettiVersion"."CodiceModello" = "Modelli3D"."Codice" WHERE ' . "\"Layer0\" = $layer0Value AND \"Layer1\" = $layer1Value AND \"Layer2\" = $layer2Value AND \"Layer3\" = $layer3Value AND \"Name\" = $nameValue AND \"Versione\" = $versioneValue";

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");

    if ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        echo json_encode($row);
    }

    include("./defaultEnd.php");
?>