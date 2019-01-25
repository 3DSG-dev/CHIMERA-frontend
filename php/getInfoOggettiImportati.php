<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	
	set_time_limit(0); 
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$user =$_SESSION['validUserName'];
	
	$SortColumn = isset($_POST['sort']) ? ("order by \"" . strval($_POST['sort']) . "\"") : "order by \"Layer0\", \"Zone\", \"Sector\", \"Type\", \"Name\"";
	$SortOrder = isset($_POST['order']) ? strval($_POST['order']) : 'asc';

	$SQL= "SELECT * FROM \"Oggetti\" JOIN \"Import\" ON \"Codice\" = \"CodiceOggetto\" WHERE \"user\"='$user' $SortColumn $SortOrder";
	$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
	$myArray =array(); 
	while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
	{
		$myArray[] = $tmp;
	}
	echo json_encode($myArray);
	pg_close($dbconn);
?>
