<?php
	
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$codiceOggettoValue = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
$SQL= "Select \"CodiceOggetto\", \"URL\", \"Descrizione\", MAX(\"Qualit�\") from \"MaterialeOggetti\" where \"Type\"='immagine' AND \"CodiceOggetto\"=$codiceOggettoValue GROUP BY \"CodiceOggetto\", \"URL\", \"Descrizione\"";
$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");
$myArray =array(); 
while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
{
	$myArray[] = $tmp;
}
echo json_encode($myArray);
pg_close($dbconn);
?>
