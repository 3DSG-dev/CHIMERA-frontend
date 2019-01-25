<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$codiceIntervento = isset($_GET['codiceIntervento'])?$_GET['codiceIntervento']:$_POST['codiceIntervento'];
	$livello = isset($_GET['livello'])?$_GET['livello']:$_POST['livello'];
	$livello = pg_escape_string ($livello); 

	if (($livello=="null")||($livello=="")) {
		$SQL= "UPDATE \"Interventi\" SET \"Livello\"=NULL  WHERE \"Codice\"=$codiceIntervento";
	}
	else {
		$SQL= "UPDATE \"Interventi\" SET \"Livello\"='$livello' WHERE \"Codice\"=$codiceIntervento";
	}

	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

	echo $SQL;
	pg_close($dbconn);
?>



