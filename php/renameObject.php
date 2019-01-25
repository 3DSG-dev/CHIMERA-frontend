<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
$codiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
$layer0 = pg_escape_string(isset($_GET['layer0'])?$_GET['layer0']:$_POST['layer0']);
$layer1 = pg_escape_string(isset($_GET['layer1'])?$_GET['layer1']:$_POST['layer1']);
$layer2 = pg_escape_string(isset($_GET['layer2'])?$_GET['layer2']:$_POST['layer2']);
$layer3 = pg_escape_string(isset($_GET['layer3'])?$_GET['layer3']:$_POST['layer3']);
$nome = pg_escape_string(isset($_GET['nome'])?$_GET['nome']:$_POST['nome']);

if (($codiceOggetto!="null") && ($codiceOggetto!="") && ($layer0!="null") && ($layer0!="") && ($layer1!="null") && ($layer1!="") && ($layer2!="null") && ($layer2!="") && ($layer3!="null") && ($layer3!="") && ($nome!="null") && ($nome!="")) {
	$SQL = "UPDATE \"Oggetti\" SET \"Layer0\"='$layer0', \"Layer1\"='$layer1', \"Layer2\"='$layer2', \"Layer3\"='$layer3', \"Name\"='$nome' WHERE \"Codice\"=(SELECT \"CodiceOggetto\" FROM \"OggettiVersion\" WHERE \"Codice\"=$codiceOggetto)";
    $result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
    echo json_encode("ok");
}
else
{
	die("Invalid parameters");
}


//echo $SQL;
pg_close($dbconn);
?>

