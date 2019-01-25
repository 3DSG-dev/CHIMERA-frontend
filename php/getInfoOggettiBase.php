<?php
include("auth.php");
if (!isset($_SESSION['validUser'])) {
    header("Location: http://" . $_SERVER["HTTP_HOST"]);
}

set_time_limit(0);
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');

$Codice = (isset($_POST['codice']) && ((strval($_POST['codice'])) != '')) ? strval($_POST['codice']) : '';
if ($Codice != '') {
    $Codice = " (\"Codice\"= " . str_replace(",", " OR \"Codice\"=", $Codice) . ")";
}

$SQL = "SELECT *, \"Oggetti\".\"Layer0\" as \"Layer0\" FROM \"Oggetti\" JOIN \"Cantieri\" ON \"Oggetti\".\"Layer0\" = \"Cantieri\".\"Layer0\" AND \"Numero\" = \"CantiereCreazione\" LEFT JOIN \"Cantieri\" AS \"Cantieri2\" ON \"Oggetti\".\"Layer0\" = \"Cantieri2\".\"Layer0\" AND \"Cantieri2\".\"Numero\" = \"CantiereEliminazione\" WHERE \"Codice\" = (SELECT \"CodiceOggetto\" FROM \"OggettiVersion\" WHERE $Codice)";
$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
$myArray = array();
while ($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC)) {
    $myArray[] = $tmp;
}
echo json_encode($myArray);
pg_close($dbconn);
?>
