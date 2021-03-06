<?php
    include("./defaultStart.php");

    $layer0Value = isset($_GET['layer0']) ? $_GET['layer0'] : null;
    $layer1Value = isset($_GET['layer1']) ? $_GET['layer1'] : null;
    $layer2Value = isset($_GET['layer2']) ? $_GET['layer2'] : null;
    $layer3Value = isset($_GET['layer3']) ? $_GET['layer3'] : null;
    $nomeValue = isset($_GET['nome']) ? $_GET['nome'] : null;
    $versioneValue = isset($_GET['versione']) ? $_GET['versione'] : null;
    $includeLayerObjects = isset($_GET['includeLayerObjects']) ? $_GET['includeLayerObjects'] == "true" : false;
    $matchString = isset($_GET['matchWholeWorld']) && $_GET['matchWholeWorld'] == "true" ? "" : "%";

    $SQL = 'SELECT "OggettiVersion"."CodiceOggetto", "OggettiVersion"."Codice" AS "CodiceVersione", "Layer0", "Layer1", "Layer2", "Layer3", "Versione", "Name", "Type", "readonly" FROM "Oggetti" JOIN "OggettiVersion" ON "Oggetti"."Codice" = "OggettiVersion"."CodiceOggetto" LEFT JOIN "Modelli3D" ON "OggettiVersion"."CodiceModello" = "Modelli3D"."Codice" LEFT JOIN (SELECT * FROM "Import" WHERE "User"=\'' . $_SESSION['validUserName'] . '\') list ON list."CodiceVersione" = "OggettiVersion"."Codice" WHERE true';
    if ($layer0Value)
        $SQL .= ' AND "Layer0" LIKE ' . pg_escape_literal($matchString . $layer0Value . $matchString);
    if ($layer1Value)
        $SQL .= ' AND "Layer1" LIKE ' . pg_escape_literal($matchString . $layer1Value . $matchString);
    if ($layer2Value)
        $SQL .= ' AND "Layer2" LIKE ' . pg_escape_literal($matchString . $layer2Value . $matchString);
    if ($layer3Value)
        $SQL .= ' AND "Layer3" LIKE ' . pg_escape_literal($matchString . $layer3Value . $matchString);
    if ($nomeValue)
        $SQL .= ' AND "Name" LIKE ' . pg_escape_literal($matchString . $nomeValue . $matchString);
    if ($versioneValue)
        $SQL .= ' AND "Versione" = ' . $versioneValue;
    if (!$includeLayerObjects)
        $SQL .= " AND \"Layer0\" != '-' AND \"Layer1\" != '-' AND \"Layer2\" != '-' AND \"Layer3\" != '-' AND \"Name\" != '-'";
    $SQL .= ' ORDER BY "Layer0", "Layer1", "Layer2", "Layer3", "Name", "Versione"';

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }

    echo json_encode($rowArray);

    include("./defaultEnd.php");
?>