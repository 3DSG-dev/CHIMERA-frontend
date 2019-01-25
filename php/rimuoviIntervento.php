<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$user =$_SESSION['validUserName'];
	

	$InterventoDaEliminare = isset($_GET['InterventoDaEliminare'])?$_GET['InterventoDaEliminare']:$_POST['InterventoDaEliminare'];
	if($InterventoDaEliminare=="") $InterventoDaEliminare="NULL"; 

	$SQL="BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE; SELECT removeintervento($InterventoDaEliminare,'$user'); END;";
	$result1 = pg_query($dbconn, $SQL) or die ( "st3: " . pg_last_error($dbconn) . " " . $SQL);
	//while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
	//{
	//	echo implode(",", $tmp);
	//}
	pg_close($dbconn);		
?>