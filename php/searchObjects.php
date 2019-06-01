<?php
    include("./defaultStart.php");

    $layer0Value = isset($_GET['layer0']) ? $_GET['layer0'] : null;
    $layer1Value = isset($_GET['layer1']) ? $_GET['layer1'] : null;
    $layer2Value = isset($_GET['layer2']) ? $_GET['layer2'] : null;
    $layer3Value = isset($_GET['layer3']) ? $_GET['layer3'] : null;
    $nomeValue = isset($_GET['nome']) ? $_GET['nome'] : null;
    $versioneValue = isset($_GET['versione']) ? $_GET['versione'] : null;

    $SQL = 'SELECT "OggettiVersion"."CodiceOggetto", "OggettiVersion"."Codice" AS "CodiceVersione", "Layer0", "Layer1", "Layer2", "Layer3", "Versione", "Name", "readonly" FROM "Oggetti" JOIN "OggettiVersion" ON "Oggetti"."Codice" = "OggettiVersion"."CodiceOggetto" LEFT JOIN (SELECT * FROM "Import" WHERE "User"=\'' . $_SESSION['validUserName'] . '\') list ON list."CodiceVersione" = "OggettiVersion"."Codice" WHERE true';
    if ($layer0Value)
        $SQL .= " AND \"Layer0\" = '$layer0Value'";
    if ($layer1Value)
        $SQL .= " AND \"Layer1\" = '$layer1Value'";
    if ($layer2Value)
        $SQL .= " AND \"Layer2\" = '$layer2Value'";
    if ($layer3Value)
        $SQL .= " AND \"Layer3\" = '$layer3Value'";
    if ($nomeValue)
        $SQL .= " AND \"Name\" = '$nomeValue'";
    if ($versioneValue)
        $SQL .= " AND \"Versione\" = '$nomeValue'";
    $SQL .= ' ORDER BY "Layer0", "Layer1", "Layer2", "Layer3", "Name", "Versione"';

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }

    echo json_encode($rowArray);

    include("./defaultEnd.php");
?>