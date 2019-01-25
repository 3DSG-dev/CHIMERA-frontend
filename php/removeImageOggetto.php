<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$codiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
$URL = isset($_GET['URL'])?$_GET['URL']:$_POST['URL'];


$SQL= "DELETE FROM \"MaterialeOggetti\" WHERE \"CodiceOggetto\"=$codiceOggetto AND \"URL\" = '$URL'";
$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

echo $SQL;
//echo json_encode("ok");
pg_close($dbconn);
?>

