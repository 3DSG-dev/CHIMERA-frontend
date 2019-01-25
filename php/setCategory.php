<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
	
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$codiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
$valore = isset($_GET['valore'])?$_GET['valore']:$_POST['valore'];
if ($valore == 0)
{
	$valore = 'null';
}
//$Descrizione = pg_escape_string ('123456'); 


$SQL= "UPDATE \"Oggetti\" SET \"Categoria\"=$valore  WHERE \"Codice\"=$codiceOggetto";
$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

//echo $SQL;
echo json_encode("ok");

pg_close($dbconn);
?>

