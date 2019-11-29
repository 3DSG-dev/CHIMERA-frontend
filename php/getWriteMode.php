<?php
    include("./defaultStart.php");

    $codiceVersione = isset($_GET['codiceVersione']) ? $_GET['codiceVersione'] : null;

    $SQL = 'SELECT NOT readonly AS rw FROM "Import" WHERE "User" = \'' . $_SESSION['validUserName'] . '\' AND "CodiceVersione" = ' . $codiceVersione;

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    if ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        echo json_encode($row);
    }
    else {
        die("Invalid parameters");
    }

    include("./defaultEnd.php");
?>