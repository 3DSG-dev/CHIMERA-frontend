<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$codiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
$note = isset($_GET['note'])?$_GET['note']:$_POST['note'];
$note = pg_escape_string ($note); 

if (($note=="null")||($note=="")) {
	$SQL= "UPDATE \"Oggetti\" SET \"Note\"=NULL  WHERE \"Codice\"=$codiceOggetto";
}
else {
	$SQL= "UPDATE \"Oggetti\" SET \"Note\"='$note'  WHERE \"Codice\"=$codiceOggetto";
}

$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

echo $SQL;
//echo json_encode("ok");
pg_close($dbconn);
?>

