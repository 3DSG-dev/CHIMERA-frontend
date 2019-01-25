<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$codiceIntervento = isset($_GET['codiceIntervento'])?$_GET['codiceIntervento']:$_POST['codiceIntervento'];
	$dataFine = isset($_GET['dataFine'])?$_GET['dataFine']:$_POST['dataFine'];
	$dataFine = pg_escape_string ($dataFine); 

	if (($dataFine=="null")||($dataFine=="")) {
		$SQL= "UPDATE \"Interventi\" SET \"Data_fine\"=NULL  WHERE \"Codice\"=$codiceIntervento";
	}
	else {
		$SQL= "UPDATE \"Interventi\" SET \"Data_fine\"='$dataFine' WHERE \"Codice\"=$codiceIntervento";
	}

	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

	echo $SQL;
	pg_close($dbconn);
?>


