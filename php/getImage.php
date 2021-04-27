<?php
    include("./defaultStart.php");

    $ref = isset($_GET['ref']) ? $_GET['ref'] : null;
    $codice = isset($_GET['codice']) ? $_GET['codice'] : null;
    $url = isset($_GET['url']) ? pg_escape_literal($_GET['url']) : null;
    $highQuality = isset($_GET['quality']) && $_GET['quality'] === "high";
    $soloInfo = isset($_GET['soloInfo']) && $_GET['soloInfo'] === "true";

    if ($ref == "Oggetti") {
        $ref2 = "Oggetto";
    } else if ($ref == "Versioni") {
        $ref2 = "Versione";
    } else {
        $ref2 = $ref;
    }

    $SQL = "SELECT " . ($soloInfo ? '' : 'file, "MimeType", ') . "\"LastModified\" FROM \"Materiale$ref\" WHERE \"Codice$ref2\" = $codice AND \"URL\" = $url ORDER BY \"Qualità\" " . ($highQuality ? "DESC" : "ASC") . " LIMIT 1";

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL" . $result);

    if ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        header('Content-type: application/json');
        echo "{
                \"lastModified\"  : \"{$row["LastModified"]}\",
                 \"mimeType\": \"{$row["MimeType"]}\"";
        if (!$soloInfo) {
            echo '
            , "imageFile": "' . base64_encode(pg_unescape_bytea($row["file"])) . '"';
        }
        echo "}";
    } else {
        die("Invalid parameters");
    }

    include("./defaultEnd.php");
?>
