<?php
include("auth.php");
if (!isset($_SESSION['validUser'])) {
    header("Location: http://" . $_SERVER["HTTP_HOST"]);
}

set_time_limit(0);
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');

$Codice = (isset($_POST['codice']) && ((strval($_POST['codice'])) != '')) ? strval($_POST['codice']) : '';
if ($Codice != '') {
    $Codice = " (\"OggettiVersion_RelazioniSchede\".\"CodiceVersione\" = " . str_replace(",", " OR \"OggettiVersion_RelazioniSchede\".\"CodiceVersione\" =", $Codice) . ")";
}

$SQL = "SELECT \"OggettiVersion_Schede\".*, \"OggettiVersion_ListaInformazioni\".* FROM \"OggettiVersion_Schede\" JOIN \"OggettiVersion_RelazioniSchede\" ON \"OggettiVersion_Schede\".\"CodiceScheda\" = \"OggettiVersion_RelazioniSchede\".\"CodiceScheda\" JOIN \"OggettiVersion_ListaInformazioni\" ON \"OggettiVersion_Schede\".\"CodiceCampo\" = \"OggettiVersion_ListaInformazioni\".\"Codice\" WHERE $Codice";
$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
$myArray = array();
while ($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC)) {
    $myArray[] = $tmp;
}
echo json_encode($myArray);
pg_close($dbconn);
?>
