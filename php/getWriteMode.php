<?php
include("auth.php");
if (!isset($_SESSION['validUser'])) {
    header("Location: http://" . $_SERVER["HTTP_HOST"]);
}

set_time_limit(0);
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');

$codiceOggetto = isset($_GET['codiceOggetto']) ? $_GET['codiceOggetto'] : $_POST['codiceOggetto'];
$user =$_SESSION['validUserName'];

$SQL = "SELECT NOT readonly AS rw FROM \"Import\" WHERE \"User\" = '$user' AND \"CodiceOggetto\" = $codiceOggetto";
$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
$myArray = array();
if ($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC)) {
    $myArray[] = $tmp;
}
echo json_encode($myArray);
pg_close($dbconn);
?>
