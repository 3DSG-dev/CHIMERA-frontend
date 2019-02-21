<?php
    include("./defaultStart.php");

    $codiceVersione = isset($_GET['codiceVersione']) ? $_GET['codiceVersione'] : null;
    $user = isset($_GET['user']) ? $_GET['user'] : null;
    $rw = isset($_GET['rw']) ? $_GET['rw'] : null;

    $SQL = "SELECT addimportcodice($codiceVersione, $rw, '" . $_SESSION['validUserName'] . "')";

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    if ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        echo json_encode($row);
    }
    else {
        die("Invalid parameters");
    }

    include("./defaultEnd.php");
?>