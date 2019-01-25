<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}		

	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$codiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
	$URL = isset($_GET['URL'])?$_GET['URL']:$_POST['URL'];
	$Descrizione = isset($_GET['descrizione'])?$_GET['descrizione']:$_POST['descrizione'];
	$Descrizione = pg_escape_string ($Descrizione); 

	//$Descrizione = pg_escape_string ('123456'); 


	$SQL= "UPDATE \"Materiale_interventi\" SET \"Descrizione\"='$Descrizione'  WHERE \"Codice_intervento\"=$codiceOggetto AND \"URL\" = '$URL'";
	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");
	echo $SQL;
	//echo json_encode("ok");
	pg_close($dbconn);
?>
