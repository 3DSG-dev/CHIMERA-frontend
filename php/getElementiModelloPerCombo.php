<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0);
$campoValue= isset($_GET['campo'])?$_GET['campo']:$_POST['campo'];
$layer0Value = isset($_GET['layer0'])?$_GET['layer0']:$_POST['layer0'];
$layer1Value = isset($_GET['layer1'])?$_GET['layer1']:$_POST['layer1'];
$layer2Value = isset($_GET['layer2'])?$_GET['layer2']:$_POST['layer2'];
$layer3Value = isset($_GET['layer3'])?$_GET['layer3']:$_POST['layer3'];
$nomeValue = isset($_GET['nome'])?$_GET['nome']:$_POST['nome'];

 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$SQL= 'SELECT DISTINCT "' . $campoValue . '" FROM "Oggetti" JOIN "OggettiVersion" ON "Oggetti"."Codice" = "OggettiVersion"."CodiceOggetto" WHERE ("Live" = 1 OR "Live" = 2 OR "Live" = 5 OR "Live" = 7)';
//$SQL= 'SELECT DISTINCT "Layer0" FROM "Oggetti" JOIN "OggettiVersion" ON "Oggetti"."Codice" = "OggettiVersion"."CodiceOggetto" WHERE ("Live" = 1 OR "Live" = 2 OR "Live" = 5 OR "Live" = 7)';

if ($layer0Value) $SQL = $SQL . ' AND "Layer0"=\'' . $layer0Value . '\'';
if ($layer1Value) $SQL = $SQL . ' AND "Layer1"=\'' . $layer1Value . '\'';
if ($layer2Value) $SQL = $SQL . ' AND "Layer2"=\'' . $layer2Value . '\'';
if ($layer3Value) $SQL = $SQL . ' AND "Layer3"=\'' . $layer3Value . '\'';
if ($nomeValue) $SQL = $SQL . ' AND "Name"=\'' . $nomeValue . '\'';
$SQL = $SQL . ' ORDER BY "' . $campoValue . '"';
$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");

$myArray =array();
while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
{
	$myArray[] = $tmp;
}

header("Content-type: application/json");
echo "{\"layerlist\":" . json_encode($myArray). "}";
pg_close($dbconn);

?>