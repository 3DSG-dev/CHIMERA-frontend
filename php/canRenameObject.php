<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$codiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];

if (($codiceOggetto!="null") && ($codiceOggetto!="")) {
	$SQL = "SELECT COUNT(*) as num FROM \"Modelli3D_LoD\" JOIN \"OggettiVersion\" ON \"Modelli3D_LoD\".\"CodiceModello\" = \"OggettiVersion\".\"CodiceModello\" WHERE \"3dm\" = true AND \"CodiceOggetto\" = $codiceOggetto";
    $result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
    $row = pg_fetch_array($result1, NULL, PGSQL_ASSOC);
    if ($row['num'] == 0) {
        echo json_encode("ok");
    }
	else {
        echo json_encode("Can't rename object with 3dm using web interface: use rhino instead!");
    }
}
else
{
	die("Invalid parameters");
}


//echo $SQL;
pg_close($dbconn);
?>

