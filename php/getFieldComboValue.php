<?php
    include("./defaultStart.php");

    $dbReference = isset($_GET['dbReference']) ? $_GET['dbReference'] : null;
    $codiceCampo = isset($_GET['codiceCampo']) ? $_GET['codiceCampo'] : null;

    $SQL = 'SELECT * FROM "' . $dbReference . '_InfoComboBox" WHERE "CodiceCampo" = ' . $codiceCampo;
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }

    echo json_encode($rowArray);

    include("./defaultEnd.php");
?>