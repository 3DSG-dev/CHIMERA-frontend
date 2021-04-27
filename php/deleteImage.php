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

    $SQL = "DELETE FROM \"Materiale$ref\" WHERE \"Codice$ref2\" = $codice AND \"URL\" = $url";

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL" . $result);

    echo json_encode("ok");

    include("./defaultEnd.php");
?>
