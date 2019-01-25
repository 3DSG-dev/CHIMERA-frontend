<?php
	
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$urlValue = isset($_GET['url'])?$_GET['url']:$_POST['url'];
$urlValue = rawurldecode($urlValue);
$qualityValue = isset($_GET['quality'])?$_GET['quality']:$_POST['quality'];
$codice = isset($_GET['codice'])?$_GET['codice']:$_POST['codice'];
$soloInfoValue = (isset($_GET['soloInfo'])?$_GET['soloInfo']:$_POST['soloInfo'])=="true";

//$SQL= "select \"file\", \"LastUpdate\" from \"MaterialeOggetti\" where \"CodicePezzo\"= (SELECT \"CodicePezzo\" FROM \"OggettiVersioni\" WHERE \"Codice\" = $codice) AND \"URL\" ='$urlValue' ORDER BY \"Qualità\" ASC LIMIT 1";
//if ($qualityValue =='max' )
	$SQL= "select " . ($soloInfoValue ? "" : "\"file\", ") . "\"LastModified\" from \"MaterialeOggetti\" where \"CodiceOggetto\"= (SELECT \"CodiceOggetto\" FROM \"OggettiVersion\" WHERE \"Codice\" = $codice) AND \"URL\" ='$urlValue' ORDER BY \"Qualità\" " . ($qualityValue =='max' ? "DESC" : "ASC") . " LIMIT 1";

$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");
while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
{
	//if ($soloInfoValue) {
	header('Content-type: application/json');
	echo "{\"codicePezzo\": $codice, \"lastModified\": \"$tmp[LastModified]\", \"mimeType\": \"$tmp[MimeType]\", \"Qualità\": \"$qualityValue\", \"innerData\": ";
	echo ($soloInfoValue)?"{}":'"' . base64_encode(pg_unescape_bytea($tmp[file])) . '"';
	echo "}";
	//}
	//else {
	//	header('Content-Type: image/jpeg');
	//	echo pg_unescape_bytea($tmp[file]);
	//}
}
pg_close($dbconn);
?>
