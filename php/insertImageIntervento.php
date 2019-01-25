<?php
	
	include("auth.php");
	if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
	}	
	
	
	set_time_limit(0); 
	$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
	$codiceOggetto = isset($_GET['codiceOggetto'])?$_GET['codiceOggetto']:$_POST['codiceOggetto'];
	$URL = isset($_GET['URL'])?$_GET['URL']:$_POST['URL'];
	$dataIns = isset($_GET['dataIns'])?$_GET['dataIns']:$_POST['dataIns'];
	$fileName= isset($_GET['fileName'])?$_GET['fileName']:$_POST['fileName'];
	$fileNameThumb= getcwd() . "/../fwlib/jQuery-File-Upload-8.4.2/server/php/files/thumbnail/" . $fileName;
	$fileName=  getcwd() . "/../fwlib/jQuery-File-Upload-8.4.2/server/php/files/" . $fileName;


	//$URL = "./Guglia18/Livello1/ALL/Cuspide/2a/20130531/gio.jpg";
	//$fileName="/var/www/BIMV5/fwlib/jQuery-File-Upload-8.4.2/server/php/files/gio.jpg";
	//$fileNameThumb="/var/www/BIMV5/fwlib/jQuery-File-Upload-8.4.2/server/php/files/thumbnail/gio.jpg";

	//$dataIns = '2013-05-31';


	$wh = getimagesize($fileName);
	$quality = max($wh[0], $wh[1]);
	$whThumb = getimagesize($fileNameThumb);
	$qualityThumb = max($whThumb[0], $whThumb[1]);

	$file =  file_get_contents($fileName); 
	$fileEncodedByteA = pg_escape_bytea($file); 
	$fileThumb =  file_get_contents($fileNameThumb); 
	$fileThumbEncodedByteA = pg_escape_bytea($fileThumb); 

	$SQL="select \"Oggetti\".\"Layer0\" from \"Relazioni\" Join \"Oggetti\" On \"Relazioni\".\"Padre\"=\"Oggetti\".\"Codice\" WHERE \"Intervento\" = $codiceOggetto limit 1";
	$cantiere = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");
	$tmp = pg_fetch_array($cantiere, NULL, PGSQL_ASSOC);
	$cantiere = implode(",", $tmp);
	$URL = "./Interventi/" . $cantiere . $URL;

	$now= date("Y-m-d");
	$SQL= "INSERT INTO \"Materiale_interventi\" VALUES ($codiceOggetto, '$URL', 'immagine', $quality, NULL, '$dataIns', 7, 4, 0, 'web', 'web', '$fileEncodedByteA','$now')";
	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

	$SQL= "INSERT INTO \"Materiale_interventi\" VALUES ($codiceOggetto, '$URL', 'immagine', $qualityThumb, NULL, '$dataIns', 7, 4, 0, 'web', 'web', '$fileThumbEncodedByteA','$now');";
	$result1 = pg_query($dbconn, utf8_encode($SQL)) or die ("Error: $SQL");

	echo json_encode("ok");
	pg_close($dbconn);
?>
