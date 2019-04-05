<?php
    include("./auth.php");

    function IsNullOrEmptyString($string)
    {
        return $string == null || $string == "null" || $string == "";
    }

    if (!isset($_SESSION['validUser'])) {
        header("Location: http://" . $_SERVER["HTTP_HOST"]);
    }

    $dbConnection = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
?>