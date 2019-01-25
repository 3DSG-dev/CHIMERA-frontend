<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	
	set_time_limit(0); 
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');

	$SortColumn = isset($_POST['sort']) ? ("order by \"" . strval($_POST['sort']) . "\"") : "order by \"Layer0\", \"Layer1\", \"Layer2\", \"Layer3\", \"Name\"";
	$SortOrder = isset($_POST['order']) ? strval($_POST['order']) : 'asc';
	$Layer0 = ( isset($_POST['layer0']) && ((strval($_POST['layer0']))!='') )  ? "AND \"Layer0\"='".  strval($_POST['layer0']) ."'" : '';
	$Layer1 = ( isset($_POST['layer1']) && ((strval($_POST['layer1']))!='') )  ? "AND \"Layer1\"='".  strval($_POST['layer1']) ."'" : '';
	$Layer2 = ( isset($_POST['layer2']) && ((strval($_POST['layer2']))!='') )  ? "AND \"Layer2\"='".  strval($_POST['layer2']) ."'" : '';
	$Layer3 = ( isset($_POST['layer3']) && ((strval($_POST['layer3']))!='') )  ? "AND \"Layer3\"='".  strval($_POST['layer3']) ."'" : '';
	$Nome = ( isset($_POST['nome']) && ((strval($_POST['nome']))!='') )  ? "AND \"Name\"='".  strval($_POST['nome']) ."'" : '';
	$Codice = ( isset($_POST['codice']) && ((strval($_POST['codice']))!='') )  ? strval($_POST['codice'])  : '';
	if ($Codice != '') {
		$Codice = "AND (\"Codice\"= ". str_replace(",", " OR \"Codice\"=", $Codice) . ")";
	}

	$SQL= "SELECT * FROM \"Oggetti\" WHERE TRUE $Layer0 $Layer1 $Layer2 $Layer3 $Nome $Codice $SortColumn $SortOrder";
	$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
	$myArray =array(); 
	while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
	{
		$myArray[] = $tmp;
	}
	echo json_encode($myArray);
	pg_close($dbconn);
?>
