<?php
    include("./defaultStart.php");

    header("Content-type: application/json");
    echo "{";

    $codiceVersione = isset($_GET['codiceVersione']) ? $_GET['codiceVersione'] : null;

    $SQL = 'SELECT "Layer0", "Layer1", "Layer2", "Layer3", "Name", "Versione" FROM "Oggetti" JOIN "OggettiVersion" ON "Oggetti"."Codice" = "OggettiVersion"."CodiceOggetto" WHERE "OggettiVersion"."Codice" = ' . $codiceVersione;
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    if ($objectData = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $SQL = 'SELECT * FROM "GisTables"';
        $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
        $database = null;
        $dbConnection2 = null;
        while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
            if ($database != null) {
                echo ',';
            }
            if ($database != $row["Database"]) {
                if ($dbConnection2 != null) {
                    pg_close($dbConnection2);
                }

                $database = $row["Database"];
                $dbConnection2 = pg_connect("host=localhost port=5432 dbname=$database user=postgres password=5ETBL6gzh9") or die ('Error connecting to db');
            }

            $layer0 = pg_escape_literal($objectData["Layer0"]);
            $layer1 = pg_escape_literal($objectData["Layer1"]);
            $layer2 = pg_escape_literal($objectData["Layer2"]);
            $layer3 = pg_escape_literal($objectData["Layer3"]);
            $name = pg_escape_literal($objectData["Name"]);

            /** @noinspection SqlResolve */
            $SQL2 = "SELECT * FROM {$row["Table"]} WHERE layer0 = $layer0 AND layer1 = $layer1 AND layer2 = $layer2 AND layer3 = $layer3 AND name = $name AND versione = {$objectData["Versione"]}";
            $result2 = pg_query($dbConnection2, $SQL2) or die ("Error: $SQL2");
            $rowArray2 = array();
            while ($row2 = pg_fetch_array($result2, null, PGSQL_ASSOC)) {
                $rowArray2[] = $row2;
            }
            echo '"' . $database . '||' . $row["Table"] . '": ' . json_encode($rowArray2);
        }

        if ($dbConnection2 != null) {
            pg_close($dbConnection2);
        }
    }

    echo "}";

    include("./defaultEnd.php");
?>