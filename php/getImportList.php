<?php
    include("./defaultStart.php");

    $SQL = 'SELECT "Import"."CodiceOggetto", "Import"."CodiceVersione", "Layer0", "Layer1", "Layer2", "Layer3", "Versione", "Name", "readonly" FROM "Import" JOIN "Oggetti" ON "CodiceOggetto" = "Oggetti"."Codice" JOIN "OggettiVersion" ON "Import"."CodiceVersione" = "OggettiVersion"."Codice" WHERE "User"= \'' . $_SESSION['validUserName'] . "'";

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }

    header("Content-type: application/json");
    echo "{\"objectList\":" . json_encode($rowArray) . "}";

    pg_close($dbconn);
?>