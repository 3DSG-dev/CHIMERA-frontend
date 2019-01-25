<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$codiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
	$h = isset($_GET['h'])?$_GET['h']:$_POST['h'];
	$h = pg_escape_string ($h); 
	if (($h=="null")||($h=="")) {
		$SQL= "UPDATE \"Oggetti\" SET \"h\"=NULL  WHERE \"Codice\"=$codiceOggetto";
	}
	else {
		$SQL= "UPDATE \"Oggetti\" SET \"h\"='$h'  WHERE \"Codice\"=$codiceOggetto";
	}


	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

	echo $SQL;
	pg_close($dbconn);
?>