<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$user =$_SESSION['validUserName'];
	$SQL= "SELECT deleteimportlist('$user')";
	$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
	echo $SQL;
	pg_close($dbconn);		
?>

