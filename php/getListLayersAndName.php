<?php
    include("./defaultStart.php");

    function SearchSQL($campo)
    {
        $layer0Value = isset($_GET['layer0']) ? $_GET['layer0'] : null;
        $layer1Value = isset($_GET['layer1']) ? $_GET['layer1'] : null;
        $layer2Value = isset($_GET['layer2']) ? $_GET['layer2'] : null;
        $layer3Value = isset($_GET['layer3']) ? $_GET['layer3'] : null;
        $nomeValue = isset($_GET['nome']) ? $_GET['nome'] : null;
        $versioneValue = isset($_GET['versione']) ? $_GET['versione'] : null;

        $SQL = 'SELECT DISTINCT "' . $campo . '" FROM "Oggetti" JOIN "OggettiVersion" ON "Oggetti"."Codice" = "OggettiVersion"."CodiceOggetto" WHERE ("Live" = 1 OR "Live" = 2 OR "Live" = 5 OR "Live" = 7)';
        if ($layer0Value && $campo != "Layer0")
            $SQL .= " AND \"Layer0\" = '$layer0Value'";
        if ($layer1Value && $campo != "Layer1")
            $SQL .= " AND \"Layer1\" = '$layer1Value'";
        if ($layer2Value && $campo != "Layer2")
            $SQL .= " AND \"Layer2\" = '$layer2Value'";
        if ($layer3Value && $campo != "Layer3")
            $SQL .= " AND \"Layer3\" = '$layer3Value'";
        if ($nomeValue && $campo != "Name")
            $SQL .= " AND \"Name\" = '$nomeValue'";
        if ($versioneValue && $campo != "Versione")
            $SQL .= " AND \"Versione\" = '$nomeValue'";
        $SQL .= " ORDER BY \"$campo\"";

        return $SQL;
    }

    function GetDistinctList($campo, $dbConnection)
    {
        $senderId = isset($_GET['senderId']) ? $_GET['senderId'] : null;
        if ($senderId != $campo) {
            $SQL = SearchSQL($campo);

            $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
            $rowArray = array();
            while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                $rowArray[] = $row;
            }

            echo "\"$campo\":" . json_encode($rowArray);

            if ($campo != "Versione" && ($campo != "Name" || $senderId != "Versione")) {
                echo ",";
            }
        }
    }

    header("Content-type: application/json");
    echo "{";

    GetDistinctList("Layer0", $dbConnection);
    GetDistinctList("Layer1", $dbConnection);
    GetDistinctList("Layer2", $dbConnection);
    GetDistinctList("Layer3", $dbConnection);
    GetDistinctList("Name", $dbConnection);
    GetDistinctList("Versione", $dbConnection);

    echo "}";

    include("./defaultEnd.php");
?>