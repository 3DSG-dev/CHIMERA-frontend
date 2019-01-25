<?php
include("auth.php");
if (!isset($_SESSION['validUser'])) {
    header("Location: http://" . $_SERVER["HTTP_HOST"]);
}

set_time_limit(0);
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');

$CodiceCampo = (isset($_POST['CodiceCampo']) && ((strval($_POST['CodiceCampo'])) != '')) ? strval($_POST['CodiceCampo']) : '';
$Valore = (isset($_POST['Valore']) && ((strval($_POST['Valore'])) != '')) ? strval($_POST['Valore']) : '';

$SQL = "INSERT INTO \"OggettiSubVersion_InfoComboBox\"(\"CodiceCampo\", \"Value\") VALUES ($CodiceCampo, '$Valore')";
$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
$myArray = array();
while ($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC)) {
    $myArray[] = $tmp;
}
echo json_encode($myArray);
pg_close($dbconn);
?>
