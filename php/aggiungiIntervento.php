<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$user =$_SESSION['validUserName'];
	

	$lPadriVecchi = isset($_GET['lPadriVecchi'])?$_GET['lPadriVecchi']:$_POST['lPadriVecchi'];
	$lPadriModificati =isset($_GET['lPadriModificati'])?$_GET['lPadriModificati']:$_POST['lPadriModificati'];
	$lFigliNuovi =isset($_GET['lFigliNuovi'])?$_GET['lFigliNuovi']:$_POST['lFigliNuovi']; 
	$completed =isset($_GET['completed'])?$_GET['completed']:$_POST['completed'];
	$completedBit = ($completed=="false")?"1::bit":"0::bit";
	if($lPadriVecchi=="") $lPadriVecchi="NULL"; 
	else $lPadriVecchi="'$lPadriVecchi'";
	if($lPadriModificati=="") $lPadriModificati="NULL"; 
	else $lPadriModificati="'$lPadriModificati'";
	if($lFigliNuovi=="") $lFigliNuovi="NULL"; 
	else $lFigliNuovi="'$lFigliNuovi'";

	$SQL="BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE; SELECT addintervento2($lPadriVecchi, $lPadriModificati, $lFigliNuovi, $completedBit,'$user'); END;";
	$result1 = pg_query($dbconn, $SQL) or die ( "st3: " . pg_last_error($dbconn) . " " . $SQL);
	//while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
	//{
	//	echo implode(",", $tmp);
	//}
	pg_close($dbconn);		
?>
