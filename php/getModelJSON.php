<?php
    include("./defaultStart.php");

    $codiceVersione = isset($_GET['codiceVersione']) ? $_GET['codiceVersione'] : null;
    $lod = isset($_GET['LoD']) ? $_GET['LoD'] : null;
    $parte = isset($_GET['parte']) ? $_GET['parte'] : null;
    $soloInfo = isset($_GET['soloInfo']) ? $_GET['soloInfo'] === "true" : false;

    $SQL = "SELECT " . ($soloInfo ? '' : 'file, ') . '"Modelli3D_JSON"."LastUpdate" FROM "Modelli3D_JSON" JOIN "OggettiVersion" ON "Modelli3D_JSON"."CodiceModello" = "OggettiVersion"."CodiceModello" WHERE ' . "\"Codice\" = $codiceVersione AND \"LoD\" = $lod AND \"Parte\" = $parte";

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");

    if ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        header('Content-type: application/json');
        echo "{
                \"lastModified\"  : \"{$row["LastUpdate"]}\"";
        if (!$soloInfo) {
            echo '
            , "modelData": ' . pg_unescape_bytea($row["file"]);
        }
        echo "}";
    }
    else {
        die("Invalid parameters");
    }

    include("./defaultEnd.php");
?>