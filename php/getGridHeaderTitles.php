<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
    header("Location: http://" . $_SERVER["HTTP_HOST"]);
}
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');

$SQL="SELECT DISTINCT \"Key\", \"TextValue\"
FROM \"Settings\"
ORDER BY \"Key\"
";
$result = pg_query($dbconn, $SQL) or die ("Error: $SQL");
$rowArray =array();
while($row = pg_fetch_array($result, NULL, PGSQL_ASSOC))
{
    $rowArray[] = $row;
}

header("Content-type: application/json");
echo "{\"gridHeaderTitles\":" .json_encode($rowArray). "}";

pg_close($dbconn);
?>
