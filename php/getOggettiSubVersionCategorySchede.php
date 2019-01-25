<?php
include("auth.php");
if (!isset($_SESSION['validUser'])) {
    header("Location: http://" . $_SERVER["HTTP_HOST"]);
}

$categoria = isset($_GET['categoria'])?$_GET['categoria']:$_POST['categoria'];

set_time_limit(0);
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');

$SQL = "SELECT * FROM \"OggettiSubVersion_CategorieSchede\" WHERE \"CodiceCategoria\" = $categoria";
$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
$myArray = array();
while ($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC)) {
    $myArray[] = $tmp;
}
echo json_encode($myArray);
pg_close($dbconn);
?>
