<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
    header("Location: http://" . $_SERVER["HTTP_HOST"]);
}

set_time_limit(0);

$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$user =$_SESSION['validUserName'];
$codiceVersione = isset($_GET['codiceVersione'])?$_GET['codiceVersione']:$_POST['codiceVersione'];


if (($codiceVersione!="null") && ($codiceVersione!="")){
    $SQL = "SELECT deleteimportobject($codiceVersione, '$user')";
} else {
    die("Invalid parameters");
}

$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");

//echo $SQL;
//echo json_encode("ok");
pg_close($dbconn);

?>

