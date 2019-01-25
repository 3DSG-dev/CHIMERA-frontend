<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$codiceIntervento = isset($_GET['codiceIntervento'])?$_GET['codiceIntervento']:$_POST['codiceIntervento'];
	$noteIntervento = isset($_GET['note'])?$_GET['note']:$_POST['note'];
	$noteIntervento = pg_escape_string ($noteIntervento); 

	if (($noteIntervento=="null")||($noteIntervento=="")) {
		$SQL= "UPDATE \"Interventi\" SET \"Note\"=NULL  WHERE \"Codice\"=$codiceIntervento";
	}
	else {
		$SQL= "UPDATE \"Interventi\" SET \"Note\"='$noteIntervento' WHERE \"Codice\"=$codiceIntervento";
	}

	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

	echo $SQL;
	pg_close($dbconn);
?>

