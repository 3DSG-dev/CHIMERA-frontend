<?php
	include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	

set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$user =$_SESSION['validUserName'];

$CodiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];

$SQL="
SELECT *  
FROM \"Interventi\" Join \"Relazioni\" 
ON \"Interventi\".\"Codice\" =\"Relazioni\".\"Intervento\"
WHERE \"Relazioni\".\"Padre\" = $CodiceOggetto LIMIT 1
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
