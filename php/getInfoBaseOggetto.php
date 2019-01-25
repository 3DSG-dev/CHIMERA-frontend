<?php

include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$codiceOggettoValue = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
$SQL= "SELECT * FROM \"Oggetti\" WHERE \"Codice\" = $codiceOggettoValue";
die($SQL);
$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");
$myArray =array(); 
while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
{
	$myArray[] = $tmp; 
}
echo json_encode($myArray);
pg_close($dbconn);
?>
