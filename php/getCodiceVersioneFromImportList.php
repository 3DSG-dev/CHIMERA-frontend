<?php
    include("./defaultStart.php");

    $SQL = 'SELECT "Import"."CodiceVersione" FROM "Import" WHERE "User"= \'' . $_SESSION['validUserName'] . "'";

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row["CodiceVersione"];
    }

    echo json_encode($rowArray);

    include("./defaultEnd.php");
?>