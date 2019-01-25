<?php
	
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0);
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$codiceVersione = isset($_GET['codiceVersione'])?$_GET['codiceVersione']:$_POST['codiceVersione'];
$urlValue = isset($_GET['URL'])?$_GET['URL']:$_POST['URL'];
$urlValue = rawurldecode($urlValue);

$SQL= "select \"DataScatto\", \"Descrizione\" from \"MaterialeVersioni\" where \"CodiceVersione\" = $codiceVersione AND \"URL\" ='$urlValue' ORDER BY \"Qualità\" DESC LIMIT 1";
$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
$myArray =array();
while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
{
	$myArray[] = $tmp;
}
echo json_encode($myArray);
pg_close($dbconn);
?>
