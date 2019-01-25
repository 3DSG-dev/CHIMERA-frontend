<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$codiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
	$l = isset($_GET['l'])?$_GET['l']:$_POST['l'];
	$l = pg_escape_string ($l); 
	if (($l=="null")||($l=="")) {
		$SQL= "UPDATE \"Oggetti\" SET \"l\"=NULL  WHERE \"Codice\"=$codiceOggetto";
	}
	else {
		$SQL= "UPDATE \"Oggetti\" SET \"l\"='$l'  WHERE \"Codice\"=$codiceOggetto";
	}

	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

	echo $SQL;
	pg_close($dbconn);
?>


