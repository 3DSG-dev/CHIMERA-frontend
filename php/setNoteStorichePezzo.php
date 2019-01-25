<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$codiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
	$noteStoriche = isset($_GET['noteStoriche'])?$_GET['noteStoriche']:$_POST['noteStoriche'];
	$noteStoriche = pg_escape_string ($noteStoriche); 

	if (($noteStoriche=="null")||($noteStoriche=="")) {
		$SQL= "UPDATE \"Oggetti\" SET \"Note_storiche\"=NULL  WHERE \"Codice\"=$codiceOggetto";
	}
	else {
		$SQL= "UPDATE \"Oggetti\" SET \"Note_storiche\"='$noteStoriche'  WHERE \"Codice\"=$codiceOggetto";
	}

	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

	echo $SQL;
	//echo json_encode("ok");
	pg_close($dbconn);
?>

