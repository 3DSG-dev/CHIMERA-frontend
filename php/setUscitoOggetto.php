<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$codiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
	$uscito = isset($_GET['uscito'])?$_GET['uscito']:$_POST['uscito'];
	$uscito = pg_escape_string ($uscito); 

	if (($uscito=="null")||($uscito=="")) {
		$SQL= "UPDATE \"Oggetti\" SET \"Dima_uscita\"=NULL  WHERE \"Codice\"=$codiceOggetto";
	}
	else {
		$SQL= "UPDATE \"Oggetti\" SET \"Dima_uscita\"='$uscito'  WHERE \"Codice\"=$codiceOggetto";
	}
	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

	echo $SQL;
	pg_close($dbconn);
?>
