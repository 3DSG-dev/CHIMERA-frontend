<?php
	
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$urlValue = isset($_GET['url'])?$_GET['url']:$_POST['url'];
$codice = isset($_GET['codice'])?$_GET['codice']:$_POST['codice'];
	$SQL= "select \"file\", octet_length(\"file\") AS \"Size\" from \"MaterialeVersioni\" where \"CodiceVersione\"= $codice AND \"URL\" ='$urlValue' ORDER BY \"Qualità\" LIMIT 1";

$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");
while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
{
//	header('Content-type: application/json');

	header('Content-Description: File Transfer');
	header('Content-Type: application/octet-stream');
	header('Content-Disposition: attachment; filename="' . $urlValue . '"');
	header('Content-Transfer-Encoding: binary');
	header('Connection: Keep-Alive');
	header('Expires: 0');
	header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
	header('Pragma: public');
	header('Content-Length: ' . $tmp['Size']);

	echo pg_unescape_bytea($tmp['file']);
}
pg_close($dbconn);
?>
