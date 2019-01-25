<?php
	
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	

set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$codice = isset($_GET['codice'])?$_GET['codice']:$_POST['codice'];

$SQL= "SELECT DISTINCT \"URL\", '001_originale' AS \"ref\" FROM \"MaterialeOggetti\" WHERE \"CodiceOggetto\"=$codice UNION SELECT DISTINCT \"Materiale_interventi\".\"URL\", '002_padre' FROM \"Oggetti\" JOIN \"Relazioni\" ON \"Oggetti\".\"Codice\" = \"Relazioni\".\"Padre\" 
JOIN \"Interventi\" ON \"Interventi\".\"Codice\" = \"Relazioni\".\"Intervento\" JOIN \"Materiale_interventi\" ON \"Interventi\".\"Codice\" = \"Materiale_interventi\".\"Codice_intervento\" WHERE \"Oggetti\".\"Codice\" = $codice UNION SELECT DISTINCT \"Materiale_interventi\".\"URL\", '003_figlio' 
FROM \"Oggetti\" JOIN \"Relazioni\" ON \"Oggetti\".\"Codice\" = \"Relazioni\".\"Figlio\" JOIN \"Interventi\" ON \"Interventi\".\"Codice\" = \"Relazioni\".\"Intervento\" JOIN \"Materiale_interventi\" ON \"Interventi\".\"Codice\" = \"Materiale_interventi\".\"Codice_intervento\" WHERE \"Oggetti\".\"Codice\" = $codice ORDER BY \"ref\"";
		
$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");
$myArray =array(); 
while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
{
	$myArray[] = $tmp;
}
echo json_encode($myArray);
pg_close($dbconn);
?>