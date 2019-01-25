<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$codiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
$sigla = isset($_GET['sigla'])?$_GET['sigla']:$_POST['sigla'];
$sigla = pg_escape_string ($sigla); 

if (($sigla=="null")||($sigla=="")) {
	$SQL= "UPDATE \"Oggetti\" SET \"Sigla\"=NULL  WHERE \"Codice\"=$codiceOggetto";
}
else {
	$SQL="UPDATE \"Oggetti\" SET \"Sigla\"='$sigla'  WHERE \"Codice\"=$codiceOggetto";
}

$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

echo $SQL;
//echo json_encode("ok");
pg_close($dbconn);
?>


