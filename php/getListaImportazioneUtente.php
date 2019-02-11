<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
  header("Location: http://" . $_SERVER["HTTP_HOST"]);
}

set_time_limit(0);

$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$user =$_SESSION['validUserName'];

$SQL = "SELECT \"Import\".\"CodiceOggetto\", \"Import\".\"CodiceVersione\", \"Layer0\", \"Layer1\", \"Layer2\", \"Layer3\", \"Name\", \"readonly\"
FROM \"Import\"
JOIN \"Oggetti\" ON \"CodiceOggetto\" = \"Oggetti\".\"Codice\"
JOIN \"OggettiVersion\" ON \"Import\".\"CodiceVersione\" = \"OggettiVersion\".\"Codice\" WHERE \"User\"= '$user'";

$result = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");
$rowArray =array();
while($row = pg_fetch_array($result, NULL, PGSQL_ASSOC))
{
    $rowArray[] = $row;
}

header("Content-type: application/json");
echo "{\"objectList\":" .json_encode($rowArray). "}";

pg_close($dbconn);

?>