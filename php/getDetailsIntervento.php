<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
		
	set_time_limit(0); 
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$codiceInterventoValue = isset($_GET['codiceIntervento'])?$_GET['codiceIntervento']:$_POST['codiceIntervento'];
	$SQL= "Select \"Codice_intervento\", \"URL\", \"Descrizione\", MAX(\"Qualità\") from \"Materiale_interventi\" where \"Type\"='immagine' AND \"Codice_intervento\"=$codiceInterventoValue GROUP BY \"Codice_intervento\", \"URL\", \"Descrizione\"";
	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");
	$myArray =array(); 
	while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
	{
		$myArray[] = $tmp;
	}
	echo json_encode($myArray);
	pg_close($dbconn);
?>
