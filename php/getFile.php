<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$codiceOggettoValue = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
$lodValue = isset($_GET['LOD'])?$_GET['LOD']:$_POST['LOD'];
$parteValue = isset($_GET['parte'])?$_GET['parte']:$_POST['parte'];
$soloInfoValue = (isset($_GET['soloInfo'])?$_GET['soloInfo']:$_POST['soloInfo'])=="true";
$SQL= ($soloInfoValue)?"select ":"select \"file\", ";
$SQL= $SQL. "\"Modelli3D_JSON\".\"LastUpdate\", \"Codice\", \"LoD\", \"Parte\" from \"Modelli3D_JSON\" JOIN \"OggettiVersion\" ON \"Modelli3D_JSON\".\"CodiceModello\" = \"OggettiVersion\".\"CodiceModello\"  where \"Codice\" =$codiceOggettoValue and \"LoD\"=$lodValue and \"Parte\"=$parteValue";
$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
{
	header('Content-type: application/json');
	echo "{\"codiceOggetto\": $tmp[Codice], \"lastModified\": \"$tmp[LastUpdate]\", \"LoD\": $tmp[LoD], \"parte\": $tmp[Parte], \"innerData\": ";

	echo ($soloInfoValue)?"{}":pg_unescape_bytea($tmp[file]);
//	echo ($soloInfoValue)?"{}":$tmp[fileJSON];
	echo "}";
}
pg_close($dbconn);
?>
