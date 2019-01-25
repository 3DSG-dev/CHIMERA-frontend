<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$codiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
	$entrato = isset($_GET['entrato'])?$_GET['entrato']:$_POST['entrato'];
	$entrato = pg_escape_string ($entrato); 

	if (($entrato=="null")||($entrato=="")) {
		$SQL= "UPDATE \"Oggetti\" SET \"Dima_entrata\"=NULL  WHERE \"Codice\"=$codiceOggetto";
	}
	else {
		$SQL= "UPDATE \"Oggetti\" SET \"Dima_entrata\"='$entrato' WHERE \"Codice\"=$codiceOggetto";
	}

	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

	echo $SQL;
	pg_close($dbconn);
?>
