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

$SQL = "SELECT \"Oggetti_Schede\".*, \"Oggetti_ListaInformazioni\".* FROM \"Oggetti_Schede\" JOIN \"Oggetti_RelazioniSchede\" ON \"Oggetti_Schede\".\"CodiceScheda\" = \"Oggetti_RelazioniSchede\".\"CodiceScheda\" JOIN \"Oggetti\" ON \"Oggetti_RelazioniSchede\".\"CodiceOggetto\" = \"Oggetti\".\"Codice\" JOIN \"Oggetti_ListaInformazioni\" ON \"Oggetti_Schede\".\"CodiceCampo\" = \"Oggetti_ListaInformazioni\".\"Codice\" WHERE \"Oggetti\".\"Codice\" = (SELECT \"CodiceOggetto\" FROM \"OggettiVersion\" WHERE $Codice)";
$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
$myArray = array();
while ($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC)) {
    $myArray[] = $tmp;
}
echo json_encode($myArray);
pg_close($dbconn);
?>
