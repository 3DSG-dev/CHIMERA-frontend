<?php
    include("./auth.php");

    if (!isset($_SESSION['validUser'])) {
        header("Location: http://" . $_SERVER["HTTP_HOST"]);
    }

    $dbConnection = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
?>