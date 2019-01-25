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

	$SQL= "select \"file\" from \"Materiale_interventi\" where \"URL\" ='$urlValue' ORDER BY \"Qualità\" ASC LIMIT 1";
	if ($qualityValue =='max' )
		$SQL= "select \"file\" from \"Materiale_interventi\" where \"URL\" ='$urlValue' ORDER BY \"Qualità\" DESC LIMIT 1";
	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");
	while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
	{
		header('Content-Type: image/jpeg');
		echo pg_unescape_bytea($tmp[file]);
	}
	pg_close($dbconn);
?>
