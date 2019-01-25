<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$codiciPadri = isset($_GET['codiciPadri'])?$_GET['codiciPadri']:$_POST['codiciPadri'];
$user = $_SESSION['validUserName'];

if (($codiciPadri!="null") && ($codiciPadri!="")) {
	$SQL = "SELECT addinterventosubversion ('$codiciPadri', '$user')";

    $result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");

    echo json_encode("ok");}
else
{
	die("Invalid parameters");
}


//echo $SQL;
pg_close($dbconn);
?>

