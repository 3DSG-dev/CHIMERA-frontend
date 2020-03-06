<?php
    include("./defaultStart.php");

    $SQL = 'SELECT * FROM "GisLayers" ORDER BY "Group", "OrderInsideGroup"';

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }

    echo json_encode($rowArray);

    include("./defaultEnd.php");
?>