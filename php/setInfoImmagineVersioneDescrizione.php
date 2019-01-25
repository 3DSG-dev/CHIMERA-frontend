<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$urlValue = isset($_GET['URL'])?$_GET['URL']:$_POST['URL'];
$urlValue = rawurldecode($urlValue);
$codiceVersione = isset($_GET['codiceVersione'])?$_GET['codiceVersione']:$_POST['codiceVersione'];
$descrizione = isset($_GET['descrizione'])?$_GET['descrizione']:$_POST['descrizione'];
$descrizione = pg_escape_string ($descrizione);

$SQL= "UPDATE \"MaterialeVersioni\" SET \"Descrizione\" = '$descrizione' where \"CodiceVersione\" = $codiceVersione AND \"URL\" ='$urlValue'";

$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
//$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

//echo $SQL;
echo json_encode("ok");
pg_close($dbconn);
?>

