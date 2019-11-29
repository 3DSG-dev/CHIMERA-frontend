<?php
    include("./defaultStart.php");

    $codiceVersione = isset($_GET['codiceVersione']) ? $_GET['codiceVersione'] : null;
    $lod = isset($_GET['LoD']) ? $_GET['LoD'] : null;
    $soloInfo = isset($_GET['soloInfo']) ? $_GET['soloInfo'] === "true" : false;

    $SQL = "SELECT " . ($soloInfo ? '' : 'file, ') . '"Modelli3D_Texture"."LastUpdate", "Modelli3D_Texture"."MimeType" FROM "Modelli3D_Texture" JOIN "OggettiVersion" ON "Modelli3D_Texture"."CodiceModello" = "OggettiVersion"."CodiceModello" WHERE ' . "\"Codice\" = $codiceVersione " . 'AND "' . utf8_encode("Qualità") . "\" = $lod";

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL" . $result);

    if ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        header('Content-type: application/json');
        echo "{
                \"lastModified\"  : \"{$row["LastUpdate"]}\",
                 \"mimeType\": \"{$row["MimeType"]}\"";
        if (!$soloInfo) {
            echo '
            , "textureFile": "' . base64_encode(pg_unescape_bytea($row["file"])) . '"';
        }
        echo "}";
    }
    else {
        die("Invalid parameters");
    }

    include("./defaultEnd.php");
?>
