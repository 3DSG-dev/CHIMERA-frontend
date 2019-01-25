<?php
//echo json_encode(unlink("/var/images/" . "SanMarcoInterno_Battistero_AlzatoNord_Parete_3009_001.tif"));
//return;
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
set_time_limit(0); 
$URL = isset($_GET['URL'])?$_GET['URL']:$_POST['URL'];
//echo("/var/images/" . $URL);
echo json_encode(unlink("/var/images/" . $_SESSION['dbName'] . "/" . $URL));
?>

