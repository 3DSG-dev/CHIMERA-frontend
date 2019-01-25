<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	

set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$user =$_SESSION['validUserName'];

$CodiceIntervento = isset($_GET['codiceIntervento'])?$_GET['codiceIntervento']:$_POST['codiceIntervento'];

$SQL="
SELECT DISTINCT \"Padre\"
FROM \"Relazioni\"
WHERE \"Intervento\"=$CodiceIntervento
UNION
SELECT DISTINCT \"Figlio\"
FROM \"Relazioni\"
WHERE \"Intervento\"=$CodiceIntervento
";

$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
$myArray =array(); 
while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
{
	$myArray[] = implode(',',$tmp);
}

echo json_encode(implode(",", $myArray));
pg_close($dbconn);
?>
