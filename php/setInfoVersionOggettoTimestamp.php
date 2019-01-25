<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$codiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
$codiceCampo = isset($_GET['codiceCampo'])?$_GET['codiceCampo']:$_POST['codiceCampo'];
$valore = isset($_GET['valore'])?$_GET['valore']:$_POST['valore'];
$valore = pg_escape_string ($valore);

if (($codiceOggetto!="null") && ($codiceOggetto!="") && ($codiceCampo!="null") && ($codiceCampo!="")) {
	if (($valore == "null") || ($valore == "")) {
		$SQL = "SELECT setoggettiversioniinfoschedavalue($codiceOggetto, $codiceCampo, null)";
	} else {
		$SQL = "SELECT setoggettiversioniinfoschedavalue($codiceOggetto, $codiceCampo, to_timestamp('$valore', 'MM/DD/YYYY HH24:MI'))";
	}
}
else
{
	die("Invalid parameters");
}

$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
//$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

//echo $SQL;
echo json_encode("ok");
pg_close($dbconn);
?>

