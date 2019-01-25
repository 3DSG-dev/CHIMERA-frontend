<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$codiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
	$descrizione = isset($_GET['descrizione'])?$_GET['descrizione']:$_POST['descrizione'];
	$descrizione = pg_escape_string ($descrizione); 

	if (($descrizione=="null")||($descrizione=="")) {
		$SQL= "UPDATE \"Oggetti\" SET \"Descrizione\"=NULL  WHERE \"Codice\"=$codiceOggetto";
	}
	else {
		$SQL= "UPDATE \"Oggetti\" SET \"Descrizione\"='$descrizione'  WHERE \"Codice\"=$codiceOggetto";
	}
 
	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

	echo $SQL;
	pg_close($dbconn);
?>

