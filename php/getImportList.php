<?php
    include("./defaultStart.php");

    $SQL = 'SELECT "Import"."CodiceOggetto", "Import"."CodiceVersione", "Layer0", "Layer1", "Layer2", "Layer3", "Versione", "Name", "readonly" FROM "Import" JOIN "Oggetti" ON "CodiceOggetto" = "Oggetti"."Codice" JOIN "OggettiVersion" ON "Import"."CodiceVersione" = "OggettiVersion"."Codice" WHERE "User"= \'' . $_SESSION['validUserName'] . '\' ORDER BY "Layer0", "Layer1", "Layer2", "Layer3", "Name", "Versione"';

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }

    echo json_encode($rowArray);

    include("./defaultEnd.php");
?>