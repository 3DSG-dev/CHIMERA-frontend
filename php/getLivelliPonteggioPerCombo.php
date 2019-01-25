<?php
	
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0);
$campoValue=isset($_GET['campo'])?$_GET['campo']:$_POST['campo'];
$layer0Value = isset($_GET['layer0'])?$_GET['layer0']:$_POST['layer0'];
$annoValue = isset($_GET['anno'])?$_GET['anno']:$_POST['anno'];
$livelloValue = isset($_GET['livello'])?$_GET['livello']:$_POST['livello'];


$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$SQL= 'SELECT DISTINCT "' . $campoValue .'" FROM "Ponteggi" WHERE TRUE';

if ($layer0Value) $SQL = $SQL . ' AND "Cantiere"=\'' . $layer0Value . '\'';
if ($annoValue) $SQL = $SQL . ' AND "Versione"=' . $annoValue;
if ($livelloValue) $SQL = $SQL . ' AND "Livello"=' . $livelloValue; 
$SQL = $SQL . ' ORDER BY "' . $campoValue . '"';

$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");

$myArray =array(); 
while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
{
	$myArray[] = $tmp;
}
echo json_encode($myArray);
pg_close($dbconn);
?>