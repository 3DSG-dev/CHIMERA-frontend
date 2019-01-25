<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	

	set_time_limit(0); 
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');

$utente=$_SESSION['validUserName'];
	$tutti = isset($_GET['tutti'])?$_GET['tutti']:$_POST['tutti'];

	//$SQL= "SELECT * FROM \"Oggetti\" WHERE TRUE $layer0 $Layer1 $Layer2 $Layer3 $Nome $Codice $SortColumn $SortOrder";
	$SQL ="";

	if ($tutti == "true") {
	
		$SQL="
SELECT 
	\"Codice\", \"layer0\", \"Layer1\", \"Layer2\", \"Layer3\", \"Name\", \"Sigla\", \"Originale\", 
	\"Superficie\", \"Volume\", \"Descrizione\", \"Note\", \"Note_storiche\", \"l\", \"p\", \"h\", 
	\"Entrato\", \"Uscito\", \"Cantiere_creazione\", \"Cantiere_eliminazione\", \"Data_creazione\", \"Data_eliminazione\", \"Live\", \"Dima_entrata\", \"Dima_uscita\" 
FROM 
	\"Oggetti\" 
WHERE
	\"Cantiere_creazione\" > 0 AND \"Originale\" = 0
ORDER BY 
	\"layer0\", \"Layer1\", \"Layer2\", \"Layer3\", \"Name\"	
";	
	}
	else {
		$SQL="
SELECT 
	\"Codice\", \"layer0\", \"Layer1\", \"Layer2\", \"Layer3\", \"Name\", \"Sigla\", \"Originale\", 
	\"Superficie\", \"Volume\", \"Descrizione\", \"Note\", \"Note_storiche\", \"l\", \"p\", \"h\", 
	\"Entrato\", \"Uscito\", \"Cantiere_creazione\", \"Cantiere_eliminazione\", \"Data_creazione\", \"Data_eliminazione\", \"Live\", \"Dima_entrata\", \"Dima_uscita\" 
FROM 
	\"Oggetti\"
JOIN 
	\"Import\" ON \"Codice\" = \"CodiceOggetto\"  	 
WHERE
	\"user\" = '$utente' AND \"Cantiere_creazione\" > 0 AND \"Originale\" = 0
ORDER BY 
	\"layer0\", \"Layer1\", \"Layer2\", \"Layer3\", \"Name\"	
";	
	
	}

	$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
	$myArray =array(); 
	while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
	{
		$myArray[] = $tmp;
	}
	echo json_encode($myArray);
	pg_close($dbconn);
?>

