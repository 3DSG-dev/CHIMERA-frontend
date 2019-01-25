<?php
include("auth.php");
if(!isset($_SESSION['validUser'])) {
	header("Location: http://" . $_SERVER["HTTP_HOST"]);	
}	
	
	
set_time_limit(0); 
$dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');

$aspect=($_GET['aspect']==null)?(4/3):($_GET['aspect']);
$layer0CBValue = $_GET['layer0CB'];
$layer1CBValue = $_GET['layer1CB'];
$layer2CBValue = $_GET['layer2CB'];
$layer3CBValue = $_GET['layer3CB'];
$nomeInternoCBValue = $_GET['nomeInternoCB'];
$annoCBValue = $_GET['annoCB'];
$livelloCBValue = $_GET['livelloCB'];
/*
$SQL="";
if ($layer0CBValue != ""){
	$SQL=$SQL.' AND "Layer0"' . "='$layer0CBValue'";
}
if ($layer1CBValue != ""){
	$SQL=$SQL.' AND "Layer1"' . "='$layer1CBValue'";
	//$SQL=$SQL.' AND ("Layer1"' . "='tiburio'".' OR "Layer1"' . "='lanterna')";
}
if ($layer2CBValue != ""){
	$SQL=$SQL.' AND "Layer2"' . "='$layer2CBValue'";
}
if ($layer3CBValue != ""){
	$SQL=$SQL.' AND "Layer3"' .  "='$layer3CBValue'";
}
if ($nomeInternoCBValue != ""){
	$SQL=$SQL.' AND "Name"' .  "='$nomeInternoCBValue'"; 
}
$SQLAux="";
if ($SQL!="") {
	$SQL= ' WHERE TRUE ' . $SQL;
	$SQLAux = $SQL . ' AND "LoD"=1';
}*/
	
//$SQL1 = 'select * FROM "ListaPezzi"' . $SQL  . " LIMIT 100";
$user =$_SESSION['validUserName'];
$path = utf8_encode('C:/Unità/HD NS3 750GB/Politecnico/Duomo/Rhinoceros/temp/');

if (!empty($layer0CBValue) && !empty($annoCBValue) && !empty($livelloCBValue) ){
	$SQL0="SELECT addimportponteggio('$layer0CBValue',$annoCBValue,$livelloCBValue,FALSE,'$path','$user')";
	$result0 = pg_query($dbconn, $SQL0) or die ("Error: $SQL0");
}
elseif  (!empty($layer0CBValue) || !empty($layer0CBValue) || !empty($layer0CBValue) || !empty($layer0CBValue) || !empty($layer0CBValue)){
	$SQL0="SELECT addimportnome('$layer0CBValue','$layer1CBValue','$layer2CBValue','$layer3CBValue','$nomeInternoCBValue',TRUE,FALSE,'$path','$user')";
	$result0 = pg_query($dbconn, $SQL0) or die ("Error: $SQL0");
}
$SQL1 = 'SELECT * FROM "ListaPezziLoD" JOIN "Import" ON "ListaPezziLoD"."Codice" = "Import"."Codice_pezzo" WHERE "user"=\'' . $user . '\'';
$SQL2 = 'select xc, yc, zc, ((xM-xc)^2 + (yM - yc)^2 + (zM -zc)^2)^.5 as r  from (select (min(xc - radius) + ( max(xc + radius) - min(xc - radius) )/2) as xc, (min(yc - radius) + ( max(yc + radius) - min(yc - radius) )/2) as yc, (min(zc - radius) + ( max(zc + radius) - min(zc - radius) )/2) as zc, max(xc + radius) as xM, max(yc + radius) as yM ,max(zc + radius) as zM from "ListaPezziLoD" JOIN "Import" ON "ListaPezziLoD"."Codice" = "Import"."Codice_pezzo" WHERE "LoD"=1 AND "user"=\'' . $user . '\') as vistaAux';

$result1 = pg_query($dbconn, $SQL1) or die ("Error: $SQL1");
$result2 = pg_query($dbconn, $SQL2) or die ("Error: $SQL2");

$xc=0;
$yc=0;
$zc=0;
$r=0;
while($tmp = pg_fetch_array($result2, NULL, PGSQL_ASSOC))
{
	$xc=$tmp[xc];
	$yc=$tmp[yc];
	$zc=$tmp[zc];
	$r=$tmp[r];
}
$ye=$yc-3*$r;
$modello = <<<EOT1
{
	"emptyScene": [
    {
        "type": "lookAt",
        "id": "mainview",
        "eye": { "x": $xc, "y": $ye, "z": $zc },
        "look": { "x": $xc, "y": $yc, "z": $zc },
        "up": { "z": 1.0 },

        "nodes": [
        {
            "type": "library",
            "nodes": [
                {
                    "type": "shader",
                    "coreId": "colorTransShader",

                    "shaders": [
                        {
                            "stage":  "fragment",

                            "code":  [

                                "uniform bool   colorTransEnabled;",
                                "uniform vec3   colorImported;",

                                "vec3 colorTransPixelColorFunc(vec3 color) {",						
								"   if (colorTransEnabled) return vec3(1.0,1.0,0.0);",								
                                "   return colorImported;",
                                "}"
								
								
                            ],

                            "hooks": {
                                "materialBaseColor": "colorTransPixelColorFunc"
                            }
                        }
                    ],

                    "params": {
                        "colorTransEnabled": true,               
                        "colorImported": [1.0, 0.0, 0.0] 
                    }
                }
            ]
        },		
        {
            "type": "camera",
            "id": "maincamera",
            "optics": {
                "type": "perspective",
                "fovy": 25.0,
                "aspect": $aspect,
                "near": 0.10,
                "far": 3000.0
            },

            "nodes": [
				{
                    "type": "renderer",
                    "clearColor": { "r": 0.4 , "g": 0.4, "b": 0.4 },
                    "clear": {
                        "depth" : true,
                        "color" : true
					},			
					
					"nodes": [
						{
							"type": "lights",
							"id": "light01",
							
							"lights": [
								{
									"mode": "dir",
									"color": { "r": 1.0, "g": 1.0, "b": 1.0 },
									"diffuse": true,
									"specular": true,
									"dir": { "x": 0.5, "y": 0.5, "z": -1.0 },
									"space": "view"
								}
							],
							"nodes":[
								{
									"type": "rotate",
									"id": "pitch",
									"angle": 0.0,
									"x" : 1.0,

									"nodes": [
										{
											"type": "rotate",
											"id": "yaw",
											"angle": 0.0,
											"y" : 1.0,

											"nodes": [
												{
													"type": "material",
													"emit": 0.2,
													"baseColor": { "r": 0.5, "g": 0.5, "b": 0.6 },
													"specularColor": { "r": 0.9, "g": 0.9, "b": 0.9 },
													"highlightBaseColor": { "r": 0.0, "g": 1.0, "b": 0.0 },
													"specular": 1.0,
													"shine": 70.0,

													"nodes": [
														{
															"id": "block"
														}
													]
												}
											]
										}
									]
								}
							]
						}
					]
				}
			]
		}
	]
	}],
    "nodes": [
EOT1;
$nomePrecedente="";
$nomePrecedenteHl="";
$tmp3="";
$tm="";
$livelloPrecedente=0;
$xcPrecedente=0.0;
$ycPrecedente=0.0;
$zcPrecedente=0.0;
$radiusPrecedente=0.0;
$nomeNormalizzatoPrecedente='';
$innerstr = "";
$stringaColore = "[1.0, 1.0, 1.0]";

$tmpPrecedente;
$IDprecedente=-1;
$firstWrite=true;
$cambioElemento=false;
while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC)){	
	$cambioElemento = ($tmp[Codice] != $IDprecedente);
	

	if ( ($IDprecedente > -1) && $cambioElemento )
	{
		if (!$firstWrite) $modello .= ",\n\n";
		$modello .=  <<< EOT2
                {
                    "type": "name",
                    "id": "$nomePrecedente",
					"name": "$nomePrecedente",
					"data": {
						$innerstr
						"xc": $xcPrecedente,
						"yc": $ycPrecedente,
						"zc": $zcPrecedente,
						"R": $radiusPrecedente,
						"ActualLevel":65535,
						"PartLoaded":0
					},
                    "nodes": [
						{
							"type": "shader",
							"coreId": "colorTransShader",

							"nodes": [																	
								{
									"type": "shaderParams",
									"params": {
										"colorTransEnabled": false,                
				                        "colorImported": $stringaColore 						
									}												
								}
							]
						}
					]
                }
EOT2;
		$firstWrite = false;
		$innerstr = "";
	}
	$innerstr .="\"l".$tmp[LoD]."\":" . $tmp[Numero_parti_JSON].",";
	
	if ($cambioElemento)
	{ 
		$xcPrecedente=$tmp[xc];
		$ycPrecedente=$tmp[yc];
		$zcPrecedente=$tmp[zc];
		$radiusPrecedente=$tmp[radius];
		$IDprecedente=$tmp[Codice];
		//$nomePrecedente = "./JSON" . "/LoDn/" . $tmp[Layer0] . "/" . $tmp[Layer1] ."/" . $tmp[Layer2] ."/" . $tmp[Layer3] . "/" . $tmp[Name];
		$nomePrecedente = "a" . $tmp[Codice];
		$nomePrecedenteHl = $nomePrecedente . "_hl";
			switch ($tmp[Colore]) {
				case 0:
					$stringaColore = "[0.5, 0.5, 0.5]";
					break;
				case 1:
					$stringaColore = "[1.0, 0.0, 0.0]";
					break;
				case 2:
					$stringaColore = "[0.0, 0.145, 1.0]";
					break;
				case 4:
					$stringaColore = "[0.580, 0.0, 0.827]";
					break;
				case 6:
					$stringaColore = "[1.0, 0.0, 0.0]";
					break;
				case 21:
					$stringaColore = "[1.0, 0.576, 0.184]";
					break;
				case 22:
					$stringaColore = "[0.0, 1.0, 1.0]";
					break;
				case 24:
					$stringaColore = "[1.0, 0.0, 1.0]";
					break;
				case 26:
					$stringaColore = "[1.0, 0.576, 0.184]";
					break;
				case 51:
					$stringaColore = "[0.0, 1.0, 0.0]";
					break;
				case 52:
					$stringaColore = "[0.0, 0.145, 1.0]";
					break;
				case 54:
					$stringaColore = "[0.580, 0.0, 0.827]";
					break;
				case 56:
					$stringaColore = "[0.0, 1.0, 0.0]";
					break;
				case 71:
					$stringaColore = "[0.749, 1.0, 0.749]";
					break;
				case 72:
					$stringaColore = "[0.0, 1.0, 1.0]";
					break;
				case 74:
					$stringaColore = "[1.0, 0.0, 1.0]";
					break;
				case 76:
					$stringaColore = "[0.749, 1.0, 0.749]";
					break;
				case 101:
					$stringaColore = "[0.811, 0.0, 0.0]";
					break;
				case 102:
					$stringaColore = "[0.0, 0.0, 0.910]";
					break;
				case 104:
					$stringaColore = "[0.58, 0.0, 0.827]";
					break;
				case 106:
					$stringaColore = "[0.811, 0.0, 0.0]";
					break;
				case 121:
					$stringaColore = "[1.0, 0.467, 0.0]";
					break;
				case 122:
					$stringaColore = "[0.0, 0.823, 0.823]";
					break;
				case 124:
					$stringaColore = "[1.0, 0.0, 1.0]";
					break;
				case 126:
					$stringaColore = "[1.0, 0.467, 0.0]";
					break;
				case 151:
					$stringaColore = "[0.0, 0.812, 0.0]";
					break;
				case 152:
					$stringaColore = "[0.0, 0.0, 0.910]";
					break;
				case 154:
					$stringaColore = "[0.58, 0.0, 0.827]";
					break;
				case 156:
					$stringaColore = "[0.0, 0.812, 0.0]";
					break;
				case 171:
					$stringaColore = "[0.635, 1.0, 0.635]";
					break;
				case 172:
					$stringaColore = "[0.0, 0.823, 0.823]";
					break;
				case 174:
					$stringaColore = "[1.0, 0.0, 1.0]";
					break;
				case 176:
					$stringaColore = "[0.635, 1.0, 0.635]";
					break;
				case 201:
					$stringaColore = "[0.663, 0.0, 0.0]";
					break;
				case 202:
					$stringaColore = "[0.0, 0.0, 0.694]";
					break;
				case 204:
					$stringaColore = "[0.58, 0.0, 0.827]";
					break;
				case 206:
					$stringaColore = "[0.663, 0.0, 0.0]";
					break;
				case 221:
					$stringaColore = "[0.827, 0.361, 0.0]";
					break;
				case 222:
					$stringaColore = "[0.0, 0.706, 0.706]";
					break;
				case 224:
					$stringaColore = "[1.0, 0.0, 1.0]";
					break;
				case 226:
					$stringaColore = "[0.827, 0.361, 0.0]";
					break;
				case 251:
					$stringaColore = "[0.0, 0.498, 0.0]";
					break;
				case 252:
					$stringaColore = "[0.0, 0.0, 0.694]";
					break;
				case 254:
					$stringaColore = "[0.58, 0.0, 0.827]";
					break;
				case 256:
					$stringaColore = "[0.0, 0.498, 0.0]";
					break;
				case 271:
					$stringaColore = "[0.498, 1.0, 0.498]";
					break;
				case 272:
					$stringaColore = "[0.0, 0.706, 0.706]";
					break;
				case 274:
					$stringaColore = "[1.0, 0.0, 1.0]";
					break;
				case 276:
					$stringaColore = "[0.498, 1.0, 0.498]";
					break;
				case 301:
					$stringaColore = "[0.0, 0.0, 0.0]";
					break;
				case 302:
					$stringaColore = "[0.0, 0.0, 0.459]";
					break;
				case 304:
					$stringaColore = "[0.58, 0.0, 0.827]";
					break;
				case 306:
					$stringaColore = "[0.463, 0.0, 0.0]";
					break;
				case 321:
					$stringaColore = "[1.0, 1.0, 1.0]";
					break;
				case 322:
					$stringaColore = "[0.0, 0.553, 0.553]";
					break;
				case 324:
					$stringaColore = "[1.0, 0.0, 1.0]";
					break;
				case 326:
					$stringaColore = "[0.651, 0.286, 0.0]";
					break;
				case 351:
					$stringaColore = "[0.0, 0.247, 0.0]";
					break;
				case 352:
					$stringaColore = "[0.0, 0.0, 0.459]";
					break;
				case 354:
					$stringaColore = "[0.58, 0.0, 0.827]";
					break;
				case 356:
					$stringaColore = "[0.0, 0.247, 0.0]";
					break;
				case 371:
					$stringaColore = "[0.365, 1.0, 0.365]";
					break;
				case 372:
					$stringaColore = "[0.0, 0.553, 0.553]";
					break;
				case 374:
					$stringaColore = "[1.0, 0.0, 1.0]";
					break;
				case 376:
					$stringaColore = "[0.365, 1.0, 0.365]";
					break;
				default:
					$stringaColore = "[0.5, 0.5, 0.5]";
			}	
		
	}	
}

if (!$firstWrite) $modello .= ",\n\n";

$modello .=  <<< EOT2
                {
                    "type": "name",
                    "id": "$nomePrecedente",
					"name": "$nomePrecedente",
					"data": {
						$innerstr
						"xc": $xcPrecedente,
						"yc": $ycPrecedente,
						"zc": $zcPrecedente,
						"R": $radiusPrecedente,
						"ActualLevel":65535,
						"PartLoaded":0
					},
                    "nodes": [
						{
							"type": "shader",
							"coreId": "colorTransShader",

							"nodes": [																	
								{
									"type": "shaderParams",
									"params": {
										"colorTransEnabled": false,                
				                        "colorImported": $stringaColore 						
									}												
								}
							]
						}
					]
                }
EOT2;

$modello .= "]}";
echo $modello;
pg_close($conn);
?>
