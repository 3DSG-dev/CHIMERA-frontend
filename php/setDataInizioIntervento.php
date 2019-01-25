<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$codiceIntervento = isset($_GET['codiceIntervento'])?$_GET['codiceIntervento']:$_POST['codiceIntervento'];
	$dataInizio = isset($_GET['dataInizio'])?$_GET['dataInizio']:$_POST['dataInizio'];
	$dataInizio = pg_escape_string ($dataInizio); 

	if (($dataInizio=="null")||($dataInizio=="")) {
		$SQL= "UPDATE \"Interventi\" SET \"Data_inizio\"=NULL  WHERE \"Codice\"=$codiceIntervento";
	}
	else {
		$SQL= "UPDATE \"Interventi\" SET \"Data_inizio\"='$dataInizio' WHERE \"Codice\"=$codiceIntervento";
	}

	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

	echo $SQL;
	pg_close($dbconn);
?>

