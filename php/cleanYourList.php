<?php
    include("./defaultStart.php");

    /** @noinspection SpellCheckingInspection */
    $SQL = "SELECT deleteimportlist('{$_SESSION['validUserName']}')";

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    if ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        /** @noinspection SpellCheckingInspection */
        echo json_encode($row["deleteimportlist"]);
    }
    else {
        die("Invalid parameters");
    }

    include("./defaultEnd.php");
?>