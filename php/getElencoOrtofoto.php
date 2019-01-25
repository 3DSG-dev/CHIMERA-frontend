<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);
}
set_time_limit(0);

$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$codiceOggettoValue = isset($_GET['codice'])?$_GET['codice']:$_POST['codice'];
//$codiceOggettoValue = 328;
//$SQL= "SELECT * FROM \"Oggetti\" WHERE \"Codice\" = $codiceOggettoValue";
$SQL= "SELECT \"Layer0\" || '_' || \"Layer1\" || '_' || \"Layer2\" || '_' || \"Layer3\" || '_' as \"prefissoOrtofoto\", \"Name\" FROM \"Oggetti\" WHERE \"Codice\" = $codiceOggettoValue";

$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
{
	$myArray[] = $tmp; 
}
pg_close($dbconn);

$filesArray = array();
if ($handle = opendir('/var/images/' . $_SESSION["dbName"] . '/')) {
    while (false !== ($entry = readdir($handle))) {
		if (preg_match("/^" . $myArray[0][prefissoOrtofoto] . "(([0-9]*)_)*" . $myArray[0][Name] . "_(([0-9]*)_)*[0-9][0-9][0-9]\.tif$/", $entry)) {
			array_push($filesArray,$entry);
		} else {
		}    	
    }
    closedir($handle);
}
echo json_encode($filesArray);
?>