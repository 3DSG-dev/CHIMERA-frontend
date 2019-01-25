<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$cantiere = isset($_GET['cantiere'])?$_GET['cantiere']:$_POST['cantiere'];
$quota = isset($_GET['quota'])?$_GET['quota']:$_POST['quota'];

$SQL=" 
SELECT DISTINCT \"Versione\", \"Livello\"
FROM \"Ponteggi\"
WHERE \"Cantiere\"='$cantiere' AND \"Inizio\"<$quota AND \"Fine\">$quota
ORDER BY \"Versione\"
";
$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
$myArray =array(); 
while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
{
	$myArray[] = $tmp;
}
echo json_encode($myArray);
pg_close($dbconn);
?>

