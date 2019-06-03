<?php
    include("./defaultStart.php");

    function GetComboValue($dbReference, $dbConnection)
    {
        $i = 0;
        $SQL = 'SELECT DISTINCT("CodiceCampo") FROM "' . $dbReference . '_InfoComboBox"';
        $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
        while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
            $SQL2 = 'SELECT * FROM "' . $dbReference . '_InfoComboBox" WHERE "CodiceCampo" = ' . $row["CodiceCampo"] . 'ORDER BY "Posizione", "Value"';
            $result2 = pg_query($dbConnection, $SQL2) or die ("Error: $SQL2");
            $rowArray2 = array();
            while ($row2 = pg_fetch_array($result2, null, PGSQL_ASSOC)) {
                $rowArray2[] = $row2;
            }
            if ($i == 0) {
                $i++;
            }
            else {
                echo ", ";
            }
            echo '"' . $row["CodiceCampo"] . '": ' . json_encode($rowArray2);
        }
    }

    echo '{ "ComboOggetto" : {';
    GetComboValue("Oggetti", $dbConnection);

    echo '}, "ComboVersione" : {';
    GetComboValue("OggettiVersion", $dbConnection);

    echo '}, "ComboSubVersion" : {';
    GetComboValue("OggettiSubVersion", $dbConnection);

    echo "}}";

    include("./defaultEnd.php");
?>