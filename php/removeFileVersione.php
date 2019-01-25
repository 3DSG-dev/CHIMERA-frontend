<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$codiceVersione = isset($_GET['codiceVersione'])?$_GET['codiceVersione']:$_POST['codiceVersione'];
$URL = isset($_GET['URL'])?$_GET['URL']:$_POST['URL'];


$SQL= "DELETE FROM \"MaterialeVersioni\" WHERE \"CodiceVersione\"=$codiceVersione AND \"URL\" = '$URL'";
$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

echo $SQL;
//echo json_encode("ok");
pg_close($dbconn);
?>

