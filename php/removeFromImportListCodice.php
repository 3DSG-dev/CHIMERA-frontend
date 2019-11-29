<?php
    include("./defaultStart.php");

    $codiceVersione = isset($_GET['codiceVersione']) ? $_GET['codiceVersione'] : null;
    $user = isset($_GET['user']) ? $_GET['user'] : null;

    $SQL = "SELECT deleteimportobject($codiceVersione, '{$_SESSION['validUserName']}')";

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    if ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        echo json_encode("ok");
    }
    else {
        die("Invalid parameters");
    }

    include("./defaultEnd.php");
?>