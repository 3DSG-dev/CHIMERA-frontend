<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$codiceIntervento = isset($_GET['codiceIntervento'])?$_GET['codiceIntervento']:$_POST['codiceIntervento'];
	$descrizioneIntervento = isset($_GET['descrizione'])?$_GET['descrizione']:$_POST['descrizione'];
	$descrizioneIntervento = pg_escape_string ($descrizioneIntervento); 

	if (($descrizioneIntervento=="null")||($descrizioneIntervento=="")) {
		$SQL= "UPDATE \"Interventi\" SET \"Descrizione\"=NULL  WHERE \"Codice\"=$codiceIntervento";
	}
	else {
		$SQL= "UPDATE \"Interventi\" SET \"Descrizione\"='$descrizioneIntervento' WHERE \"Codice\"=$codiceIntervento";
	}

	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

	echo $SQL;
	pg_close($dbconn);
?>

