<?php
include("auth.php");
if (!isset($_SESSION['validUser'])) {
    header("Location: http://" . $_SERVER["HTTP_HOST"]);
}

set_time_limit(0);
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');

$Codice = (isset($_POST['codice']) && ((strval($_POST['codice'])) != '')) ? strval($_POST['codice']) : '';
if ($Codice != '') {
    $Codice = " (\"OggettiSubVersion\".\"CodiceVersione\" = " . str_replace(",", " OR \"OggettiSubVersion\".\"CodiceVersione\" = ", $Codice) . ")";
}

$SQL = "SELECT \"OggettiSubVersion_Schede\".*, \"OggettiSubVersion_ListaInformazioni\".*, \"OggettiSubVersion\".\"SubVersion\" FROM \"OggettiSubVersion_Schede\" JOIN \"OggettiSubVersion_RelazioniSchede\" ON \"OggettiSubVersion_Schede\".\"CodiceScheda\" = \"OggettiSubVersion_RelazioniSchede\".\"CodiceScheda\" JOIN \"OggettiSubVersion\" ON \"OggettiSubVersion_RelazioniSchede\".\"CodiceSubVersion\" = \"OggettiSubVersion\".\"Codice\" JOIN \"OggettiSubVersion_ListaInformazioni\" ON \"OggettiSubVersion_Schede\".\"CodiceCampo\" = \"OggettiSubVersion_ListaInformazioni\".\"Codice\" WHERE $Codice";
$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
$myArray = array();
while ($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC)) {
    $myArray[] = $tmp;
}
echo json_encode($myArray);
pg_close($dbconn);
?>
