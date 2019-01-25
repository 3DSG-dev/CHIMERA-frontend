<?php
	include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	

set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');

$Codice = ( isset($_POST['codice']) && ((strval($_POST['codice']))!='') )  ? strval($_POST['codice'])  : '';
if ($Codice != '') {
	$Codice = "AND (\"Codice\"= ". str_replace(",", " OR \"Codice\"=", $Codice) . ")";
}

$SQL= "SELECT * FROM \"Oggetti\" JOIN \"Oggetti_3D\" ON \"Codice\" = \"CodiceOggetto\" WHERE \"LoD\" = 0  $Codice";
$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
$myArray =array(); 
while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
{
	$myArray[] = $tmp;
}
echo json_encode($myArray);
pg_close($dbconn);
?>
