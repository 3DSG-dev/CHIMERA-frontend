<?php
    include("./defaultStart.php");

    $layer0Value = isset($_GET['layer0']) ? pg_escape_literal($_GET['layer0']) : null;
    $layer1Value = isset($_GET['layer1']) ? pg_escape_literal($_GET['layer1']) : null;
    $layer2Value = isset($_GET['layer2']) ? pg_escape_literal($_GET['layer2']) : null;
    $layer3Value = isset($_GET['layer3']) ? pg_escape_literal($_GET['layer3']) : null;
    $nomeValue = isset($_GET['nome']) ? pg_escape_literal($_GET['nome']) : null;
    $versioneValue = isset($_GET['versione']) ? $_GET['versione'] : null;
    $includeLayerObjects = isset($_GET['includeLayerObjects']) ? $_GET['includeLayerObjects'] : null;

    if (IsNullOrEmptyString($versioneValue)) {
        /** @noinspection SpellCheckingInspection */
        $SQL= "SELECT addimportnome($layer0Value, $layer1Value, $layer2Value, $layer3Value, $nomeValue, null, $includeLayerObjects, '{$_SESSION['validUserName']}')";
    }
    else {
        /** @noinspection SpellCheckingInspection */
        $SQL= "SELECT addimportnome($layer0Value, $layer1Value, $layer2Value, $layer3Value, $nomeValue, $versioneValue, $includeLayerObjects, '{$_SESSION['validUserName']}')";
    }

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    if ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        echo json_encode($row);
    }
    else {
        die("Invalid parameters");
    }

    include("./defaultEnd.php");
?>