<?php
include("auth.php");
if (!isset($_SESSION['validUser'])) {
    header("Location: http://" . $_SERVER["HTTP_HOST"]);
}

set_time_limit(0);
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');

$CodiceTitolo = (isset($_POST['CodiceTitolo']) && ((strval($_POST['CodiceTitolo'])) != '')) ? strval($_POST['CodiceTitolo']) : '';
if ($CodiceTitolo != '') {
    $CodiceTitolo = " (\"CodiceTitolo\"= " . str_replace(",", " OR \"CodiceTitolo\"=", $CodiceTitolo) . ")";
}

$SQL = "SELECT * FROM \"OggettiVersion_ListaInformazioni\" WHERE $CodiceTitolo ORDER BY \"Posizione\"";
$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
$myArray = array();
while ($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC)) {
    $myArray[] = $tmp;
}
echo json_encode($myArray);
pg_close($dbconn);
?>
