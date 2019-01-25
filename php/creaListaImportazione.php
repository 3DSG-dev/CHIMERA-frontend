<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$user =$_SESSION['validUserName'];
	$listaOggetti = isset($_GET['listaOggetti'])?$_GET['listaOggetti']:$_POST['listaOggetti'];
	$listaOggetti2 ="(\"CodiceOggetto\" =" .  str_replace(","," OR \"CodiceOggetto\" = ",$listaOggetti) . ")";
	$listaOggetti3 ="(\"Codice\" =" .  str_replace(","," OR \"Codice\" = ",$listaOggetti) . ")";
	$SQL= "DELETE FROM \"Import\" WHERE \"user\" = '$user' AND $listaOggetti2;UPDATE \"Oggetti\" SET \"Lock\" = NULL WHERE \"Lock\" = '$user' AND $listaOggetti3";
	$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
	$path = utf8_encode('C:/Unità/HD NS3 750GB/Politecnico/Duomo/Rhinoceros/temp/');
	$SQL="SELECT addimportlistacodici('$listaOggetti',TRUE,'$path','$user', TRUE)";
	$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
	while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
	{
		echo implode(",", $tmp);
	}
	pg_close($dbconn);		
?>
