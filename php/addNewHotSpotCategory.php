<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');

$layer0 = pg_escape_string(isset($_GET['layer0'])?$_GET['layer0']:$_POST['layer0']);
$layer1 = pg_escape_string(isset($_GET['layer1'])?$_GET['layer1']:$_POST['layer1']);
$layer2 = pg_escape_string(isset($_GET['layer2'])?$_GET['layer2']:$_POST['layer2']);
$layer3 = pg_escape_string(isset($_GET['layer3'])?$_GET['layer3']:$_POST['layer3']);
$nome = pg_escape_string(isset($_GET['nome'])?$_GET['nome']:$_POST['nome']);
$xc = isset($_GET['xc'])?$_GET['xc']:$_POST['xc'];
$yc = isset($_GET['yc'])?$_GET['yc']:$_POST['yc'];
$zc = isset($_GET['zc'])?$_GET['zc']:$_POST['zc'];
$radius = isset($_GET['radius'])?$_GET['radius']:$_POST['radius'];
$category = isset($_GET['category'])?$_GET['category']:$_POST['category'];
$user = $_SESSION['validUserName'];

if (true) {
	$SQL = "SELECT preinitializenewhotspot('$layer0', '$layer1', '$layer2', '$layer3', '$nome', 0, $xc, $yc, $zc, $radius, $category, '$user')";
}
else
{
	die("Invalid parameters");
}

$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
//$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

//echo $SQL;
echo json_encode("ok");
pg_close($dbconn);
?>

