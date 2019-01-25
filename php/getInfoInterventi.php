<?php
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	
	set_time_limit(0); 
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$user =$_SESSION['validUserName'];

	$SortColumn = isset($_POST['sort']) ? ("order by \"" . strval($_POST['sort']) . "\"") : "order by \"Oggetti\".\"Layer0\", \"Oggetti\".\"Layer1\", \"Oggetti\".\"Sector\", \"Oggetti\".\"Layer3\", \"Oggetti\".\"Name\"";
	$SortOrder = isset($_POST['order']) ? strval($_POST['order']) : 'asc';
	$Layer0 = ( isset($_POST['layer0']) && ((strval($_POST['layer0']))!='') )  ?"AND '" . strval($_POST['layer0']) . "' = ANY(ARRAY_AGG(\"Oggetti\".\"Layer0\"))":'';
	$Layer1 = ( isset($_POST['layer1']) && ((strval($_POST['layer1']))!='') )  ?"AND '" . strval($_POST['layer1']) . "' = ANY(ARRAY_AGG(\"Oggetti\".\"Layer1\"))":'';
	$Layer2 = ( isset($_POST['layer2']) && ((strval($_POST['layer2']))!='') )  ? "AND '" . strval($_POST['layer2']) . "' = ANY(ARRAY_AGG(\"Oggetti\".\"Layer2\"))":'';
	$Layer3 = ( isset($_POST['layer3']) && ((strval($_POST['layer3']))!='') )  ? "AND '" . strval($_POST['layer3']) . "' = ANY(ARRAY_AGG(\"Oggetti\".\"Layer3\"))":'';
	$Nome = ( isset($_POST['nome']) && ((strval($_POST['nome']))!='') )  ? "AND '" . strval($_POST['nome']) . "' = ANY(ARRAY_AGG(\"Oggetti\".\"Name\"))":'';


	$SQL = "SELECT \"aux2P\".\"numPadri\", \"aux2P\".\"elencoPadri\", \"aux2F\".\"numFigli\", \"aux2F\".\"elencoFigli\", \"Interventi\".* FROM
		(
		SELECT \"auxP\".\"Codice\", COUNT(\"auxP\".\"Padre\") as \"numPadri\", ARRAY_TO_STRING(ARRAY_AGG(\"auxP\".\"Padre\"),',') as \"elencoPadri\" 
		FROM
		(
		SELECT DISTINCT \"Interventi\".\"Codice\", \"Relazioni\".\"Padre\" 
		FROM \"Interventi\" Join \"Relazioni\" 
		ON \"Interventi\".\"Codice\" =\"Relazioni\".\"Intervento\"
		ORDER BY \"Interventi\".\"Codice\"
		) as \"auxP\"
		JOIN \"Oggetti\" ON \"auxP\".\"Padre\"=\"Oggetti\".\"Codice\"	
		GROUP BY \"auxP\".\"Codice\"

		) as \"aux2P\" 
		JOIN
		(
		SELECT \"auxF\".\"Codice\", COUNT(\"auxF\".\"Figlio\") as \"numFigli\", ARRAY_TO_STRING(ARRAY_AGG(\"auxF\".\"Figlio\"),',') as \"elencoFigli\" 
		FROM
		(
		SELECT DISTINCT \"Interventi\".\"Codice\", \"Relazioni\".\"Figlio\" 
		FROM \"Interventi\" Join \"Relazioni\" 
		ON \"Interventi\".\"Codice\" =\"Relazioni\".\"Intervento\"
		ORDER BY \"Interventi\".\"Codice\"
		) as \"auxF\"
		JOIN \"Oggetti\" ON \"auxF\".\"Figlio\"=\"Oggetti\".\"Codice\"	
		GROUP BY \"auxF\".\"Codice\"
		
		) as \"aux2F\"
		ON \"aux2P\".\"Codice\"=\"aux2F\".\"Codice\"
		JOIN \"Interventi\"
		ON \"aux2P\".\"Codice\" = \"Interventi\".\"Codice\"
		WHERE \"Interventi\".\"Codice\" IN (SELECT DISTINCT(\"Intervento\") FROM \"Relazioni\", \"Import\" WHERE (\"Padre\"=\"CodiceOggetto\" OR \"Figlio\"=\"CodiceOggetto\") AND \"user\"='$user')";
/*
	$SQL = "SELECT \"aux2P\".\"numPadri\", \"aux2P\".\"elencoPadri\", \"aux2F\".\"numFigli\", \"aux2F\".\"elencoFigli\", \"Interventi\".* FROM
		(
		SELECT \"auxP\".\"Codice\", COUNT(\"auxP\".\"Padre\") as \"numPadri\", ARRAY_TO_STRING(ARRAY_AGG(\"auxP\".\"Padre\"),',') as \"elencoPadri\" 
		FROM
		(
		SELECT DISTINCT \"Interventi\".\"Codice\", \"Relazioni\".\"Padre\" 
		FROM \"Interventi\" Join \"Relazioni\" 
		ON \"Interventi\".\"Codice\" =\"Relazioni\".\"Intervento\"
		ORDER BY \"Interventi\".\"Codice\"
		) as \"auxP\"
		JOIN \"Oggetti\" ON \"auxP\".\"Padre\"=\"Oggetti\".\"Codice\"
		GROUP BY \"auxP\".\"Codice\"
		HAVING TRUE $Layer0 $Layer1 $Layer2 $Layer3 $Nome
		) as \"aux2P\" 
		JOIN
		(
		SELECT \"auxF\".\"Codice\", COUNT(\"auxF\".\"Figlio\") as \"numFigli\", ARRAY_TO_STRING(ARRAY_AGG(\"auxF\".\"Figlio\"),',') as \"elencoFigli\" 
		FROM
		(
		SELECT DISTINCT \"Interventi\".\"Codice\", \"Relazioni\".\"Figlio\" 
		FROM \"Interventi\" Join \"Relazioni\" 
		ON \"Interventi\".\"Codice\" =\"Relazioni\".\"Intervento\"
		ORDER BY \"Interventi\".\"Codice\"
		) as \"auxF\"
		JOIN \"Oggetti\" ON \"auxF\".\"Figlio\"=\"Oggetti\".\"Codice\"
		GROUP BY \"auxF\".\"Codice\"
		HAVING TRUE $Layer0 $Layer1 $Layer2 $Layer3 $Nome
		) as \"aux2F\"
		ON \"aux2P\".\"Codice\"=\"aux2F\".\"Codice\"
		JOIN \"Interventi\"
		ON \"aux2P\".\"Codice\" = \"Interventi\".\"Codice\"";
*/
	$result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
	$myArray =array(); 
	while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
	{
		$myArray[] = $tmp;
	}
	echo json_encode($myArray);
	pg_close($dbconn);
?>
