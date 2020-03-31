<?php
    include("./defaultStart.php");

    $user = $_SESSION['validUserName'];

    /**
     * @param $dbConnection
     * @return string
     */
    function EmptySceneData($dbConnection)
    {
        $xc = 0;
        $yc = 0;
        $zc = 0;
        $r = 0;
        $aspect = isset($_GET['aspect']) && $_GET['aspect'] != null ? $_GET['aspect'] : 4 / 3;

        $SQL = 'SELECT xc, yc, zc, ((xM-xc)^2 + (yM - yc)^2 + (zM -zc)^2)^.5 AS r FROM (SELECT (min(xc - "Radius") + (max(xc + "Radius") - min(xc - "Radius"))/2) AS xc, (min(yc - "Radius") + (max(yc + "Radius") - min(yc - "Radius"))/2) AS yc, (min(zc - "Radius") + (max(zc + "Radius") - min(zc - "Radius"))/2) AS zc, max(xc + "Radius") AS xM, max(yc + "Radius") AS yM, max(zc + "Radius") AS zM FROM "ListaOggettiLoD" JOIN "Import" ON "ListaOggettiLoD"."CodiceModello" = "Import"."CodiceModello" WHERE "LoD"=0 AND "User"=\'' . $_SESSION['validUserName'] . "') AS vistaAux";

        $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
        if ($row = pg_fetch_array($result, NULL, PGSQL_ASSOC)) {
            if (isset($row["xc"])) {
                $xc = $row["xc"];
                $yc = $row["yc"];
                $zc = $row["zc"];
                $r = $row["r"];
            }
        }
        $ye = $yc - 3 * $r;

        /** @noinspection SpellCheckingInspection */
        return <<<EOT
	"emptyScene": [
        {
            "type": "lookAt",
            "id": "mainView",
            "eye": { "x": $xc, "y": $ye, "z": $zc },
            "look": { "x": $xc, "y": $yc, "z": $zc },
            "up": { "z": 1.0 },
            "nodes": [
                {
                    "type": "library",
                    "nodes": [
                        {
                            "type": "shader",
                            "coreId": "objectShader",
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
                        },
                        {
                            "type": "shader",
                            "coreId": "pointCloudShader",
                            "shaders": [
                                {
                                    "stage":  "fragment",
                                    "code":  [
                                        "uniform bool   colorTransEnabled;",
                                        "vec3 colorTransPixelColorFunc(vec3 color) {",
                                        "   if (colorTransEnabled) return vec3(1.0,1.0,0.0);",
                                        "   return color;",
                                        "}"
                                    ],
                                    "hooks": {
                                        "materialBaseColor": "colorTransPixelColorFunc"
                                    }
                                }
                            ],
                            "params": {
                                "colorTransEnabled": false
                            }
                        }
                    ]
                },
                {
                    "type": "camera",
                    "id": "mainCamera",
                    "optics": {
                        "type": "perspective",
                        "fovy": 25.0,
                        "aspect": $aspect,
                        "near": 0.10,
                        "far": 30000.0
                    },
                    "nodes": [
                        {
                            "type": "renderer",
                            "nodes": [
                                {
                                    "type": "lights",
                                    "id": "light01",
                                    "lights": [
                                        {
                                            "mode": "dir",
                                            "color": { "r": 0.6, "g": 0.6, "b": 0.6 },
                                            "diffuse": true,
                                            "specular": false,
                                            "dir": { "x": 0.25, "y": -0.25, "z": -1.0 },
                                            "space": "view"
                                        },
                                        {
                                            "mode":"ambient",
                                            "color":{ "r":0.4, "g":0.4, "b":0.4 }
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
                                                            "id": "Mesh",
                                                            "nodes": [
                                                                {
                                                                    "type": "material",
                                                                    "emit": 0.0,
                                                                    "baseColor": { "r": 0.5, "g": 0.5, "b": 0.6 },
                                                                    "specularColor": { "r": 0.9, "g": 0.9, "b": 0.9 },
                                                                    "highlightBaseColor": { "r": 0.0, "g": 1.0, "b": 0.0 },
                                                                    "specular": 0.2,
                                                                    "shine": 70.0,
                                                                    "nodes": [
                                                                        {
                                                                            "id": "TexturedMesh"
                                                                        },
                                                                        {
                                                                            "id": "MultiTexturedMesh"
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "id" : "PointCloud"
                                                        },
                                                        {
                                                            "id" : "Orb",
                                                            "nodes": [
                                                                {
                                                                    "id" : "HotSpot"
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
                },
                {
                    "type":"canvas/capture",
                    "id":"canvasCapture"
                }
            ]
	    }
	]
EOT;
    }

    /**
     * @param $color
     * @return string
     */
    function ComputeObjectColor($color)
    {
        switch ($color) {
            case 0:
                return "[0.5, 0.5, 0.5]";
            case 1:
            case 6:
            case 21:
            case 26:
                return "[1.0, 0.576, 0.184]";
            case 51:
            case 56:
            case 71:
            case 76:
                return "[0.749, 1.0, 0.749]";
            case 101:
            case 106:
            case 121:
            case 126:
                return "[1.0, 0.467, 0.0]";
            case 151:
            case 156:
            case 171:
            case 176:
                return "[0.635, 1.0, 0.635]";
            case 201:
            case 206:
            case 221:
            case 226:
                return "[0.827, 0.361, 0.0]";
            case 251:
            case 256:
            case 271:
            case 276:
                return "[0.498, 1.0, 0.498]";
            case 301:
            case 321:
                return "[0.85, 0.85, 0.85]";
            case 306:
            case 326:
                return "[0.651, 0.286, 0.0]";
            case 351:
            case 356:
            case 371:
            case 376:
                return "[0.365, 1.0, 0.365]";
            case 2:
            case 22:
            case 52:
            case 72:
                return "[0.0, 1.0, 1.0]";
            case 102:
            case 122:
            case 152:
            case 172:
                return "[0.0, 0.823, 0.823]";
            case 202:
            case 222:
            case 252:
            case 272:
                return "[0.0, 0.706, 0.706]";
            case 302:
            case 322:
            case 352:
            case 372:
                return "[0.0, 0.553, 0.553]";
            case 4:
            case 24:
            case 54:
            case 74:
            case 104:
            case 124:
            case 154:
            case 174:
            case 204:
            case 224:
            case 254:
            case 274:
            case 304:
            case 324:
            case 354:
            case 374:
                return "[1.0, 0.0, 1.0]";
        }
        return "[0.5, 0.5, 0.5]";
    }

    /**
     * @param $dbConnection
     * @return string
     */
    function TexturedMeshData($dbConnection)
    {
        /**
         * @param $nome
         * @param $lodData
         * @param $texture
         * @param $xc
         * @param $yc
         * @param $zc
         * @param $radius
         * @param $color
         * @param $firstWrite
         * @return string
         */
        function ModelData($nome, $lodData, $texture, $xc, $yc, $zc, $radius, $color, $firstWrite)
        {
            $modello = $firstWrite ? "" : ",\n";
            $modello .= <<<EOT
        {
            "type": "name",
            "id": "$nome",
            "name": "$nome",
            "data": {
                $lodData
                "xc": $xc,
                "yc": $yc,
                "zc": $zc,
                "R": $radius,
                "ActualLevel": 65535,
                "PartLoaded": 0,
                "TextureLoD": $texture
            },
            "nodes": [
                {
                    "type": "flags",
                    "flags": {
                        "picking": true,
                        "enabled": true
                    },
                    "nodes": [
                        {
                            "type": "shader",
                            "coreId": "objectShader",
                            "nodes": [
                                {
                                    "type": "shaderParams",
                                    "params": {
                                        "colorTransEnabled": false,
                                        "colorImported": $color
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
EOT;

            return $modello;
        }

        $modello = <<<EOT
     ,
    "TexturedMeshData": [
EOT;

        $firstWrite = true;
        $id = -1;
        $nome = "";
        $lodData = "";
        $xc = 0.0;
        $yc = 0.0;
        $zc = 0.0;
        $radius = 0.0;
        $color = [1.0, 1.0, 1.0];
        $texture = -1;

        $SQL = 'SELECT * FROM "ListaOggettiLoD" JOIN "Import" ON "ListaOggettiLoD"."CodiceModello" = "Import"."CodiceModello" WHERE "ModelType" = 0 AND "User"=\'' . $_SESSION['validUserName'] . "'";

        $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
        while ($row = pg_fetch_array($result, NULL, PGSQL_ASSOC)) {
            if ($row["Codice"] != $id) {
                if ($id != -1) {
                    $modello .= ModelData($nome, $lodData, $texture, $xc, $yc, $zc, $radius, $color, $firstWrite);
                    $firstWrite = false;
                }

                $id = $row["Codice"];
                $nome = "a" . $id;
                $lodData = "";
                $texture = -1;
                $xc = $row["xc"];
                $yc = $row["yc"];
                $zc = $row["zc"];
                $radius = $row["Radius"];
                $color = ComputeObjectColor($row["Colore"]);
            }

            $lodData .= '"l' . $row["LoD"] . '": ' . $row["JSON_NumeroParti"] . ",";
            if ($row["TextureJSON"] == "t") {
                $texture = 0;
            }
        }
        if ($id != -1) {
            $modello .= ModelData($nome, $lodData, $texture, $xc, $yc, $zc, $radius, $color, $firstWrite);
        }

        $modello .= <<<EOT
	]
EOT;

        return $modello;
    }

    /**
     * @param $dbConnection
     * @return string
     */
    function MultiTexturedMeshData($dbConnection)
    {
        /**
         * @param $id
         * @param $color
         * @param $firstWrite
         * @return string
         */
        function ModelGroupData($id, $color, $firstWrite)
        {
            $nomeMultiGroup = "m" . $id;
            $modello = "";
            if (!$firstWrite) {
                $modello .= <<<EOT
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
EOT;
            }

            $modello .= <<<EOT
        {
            "type": "name",
            "id": "$nomeMultiGroup",
            "name": "$nomeMultiGroup",
            "data": {
                "ActualLevel":65535,
                "PartLoaded":0,
                "TextureLoD":0
            },
            "nodes": [
                {
                    "type": "flags",
                    "flags": {
                        "picking": true,
                        "enabled": true
                    },
                    "nodes": [
                        {
                            "type": "shader",
                            "coreId": "objectShader",

                            "nodes": [
                                {
                                    "type": "shaderParams",
                                    "params": {
                                        "colorTransEnabled": false,
                                        "colorImported": $color
                                    },
                                    "nodes": [
EOT;

            return $modello;
        }

        /**
         * @param $id
         * @param $lodData
         * @param $xc
         * @param $yc
         * @param $zc
         * @param $radius
         * @param $multiSeq
         * @return string
         */
        function ModelPartData($id, $lodData, $xc, $yc, $zc, $radius, $multiSeq)
        {
            $nome = "m" . $id . "_" . $multiSeq;

            $modello = $multiSeq > 0 ? ",\n" : "";
            $modello .= <<<EOT
                                                {
                                                    "type": "name",
                                                    "id": "$nome",
                                                    "name": "$nome",
                                                    "data": {
                                                        $lodData
                                                        "xc": $xc,
                                                        "yc": $yc,
                                                        "zc": $zc,
                                                        "R": $radius,
                                                        "ActualLevel":65535,
                                                        "PartLoaded":0,
                                                        "TextureLoD":0
                                                    }
                                                }
EOT;

            return $modello;
        }

        $modello = <<<EOT
     ,
    "MultiTexturedMeshData": [
EOT;

        $firstWrite = true;
        $id = -1;
        $multiSeq = 0;
        $lod = -1;
        $lodData = "";
        $xc = 0.0;
        $yc = 0.0;
        $zc = 0.0;
        $radius = 0.0;

        $SQL = 'SELECT * FROM "ListaOggettiLoD" JOIN "Import" ON "ListaOggettiLoD"."CodiceModello" = "Import"."CodiceModello" WHERE "ModelType" = 3 AND "User"=\'' . $_SESSION['validUserName'] . '\' ORDER BY "ListaOggettiLoD"."CodiceModello", "LoD"';

        $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
        while ($row = pg_fetch_array($result, NULL, PGSQL_ASSOC)) {
            $newElement = $row["Codice"] != $id;

            if ($newElement || $row["LoD"] - $lod > 90) {
                if ($id != -1) {
                    $modello .= ModelPartData($id, $lodData, $xc, $yc, $zc, $radius, $multiSeq);
                }

                $xc = $row["xc"];
                $yc = $row["yc"];
                $zc = $row["zc"];
                $radius = $row["Radius"];
                $lod = $row["LoD"];
                $multiSeq++;
                $lodData = "";

                if ($newElement) {
                    $id = $row["Codice"];

                    $modello .= ModelGroupData($id, ComputeObjectColor($row["Colore"]), $firstWrite);

                    $multiSeq = 0;
                    $firstWrite = false;
                }
            }

            $lodData .= '"l' . ($row["LoD"] - $multiSeq * 100) . '":' . $row["JSON_NumeroParti"] . ",";
        }
        if ($id != -1) {
            $modello .= ModelPartData($id, $lodData, $xc, $yc, $zc, $radius, $multiSeq);
            $modello .= <<<EOT
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
EOT;
        }

        $modello .= <<<EOT
	]
EOT;

        return $modello;
    }

    /**
     * @param $dbConnection
     * @return string
     */
    function PointCloudData($dbConnection)
    {
        /**
         * @param $nome
         * @param $lodData
         * @param $xc
         * @param $yc
         * @param $zc
         * @param $radius
         * @param $firstWrite
         * @return string
         */
        function PointData($nome, $lodData, $xc, $yc, $zc, $radius, $firstWrite)
        {
            $modello = $firstWrite ? "" : ",\n";
            $modello .= <<<EOT
        {
            "type": "name",
            "id": "$nome",
            "name": "$nome",
            "data": {
                $lodData
                "xc": $xc,
                "yc": $yc,
                "zc": $zc,
                "R": $radius,
                "ActualLevel":65535,
                "PartLoaded":0,
                "TextureLoD":0
            },
            "nodes": [
                {
                    "type": "flags",
                    "flags": {
                        "picking": true,
                        "enabled": true
                    },
                    "nodes": [
                        {
                            "type": "shader",
                            "coreId": "pointCloudShader",
                            "nodes": [
                                {
                                    "type": "shaderParams",
                                    "params": {
                                        "colorTransEnabled": false
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
EOT;

            return $modello;
        }

        $modello = <<<EOT
     ,
    "PointCloudData": [
EOT;

        $firstWrite = true;
        $id = -1;
        $nome = "";
        $lodData = "";
        $xc = 0.0;
        $yc = 0.0;
        $zc = 0.0;
        $radius = 0.0;

        $SQL = 'SELECT * FROM "ListaOggettiLoD" JOIN "Import" ON "ListaOggettiLoD"."CodiceModello" = "Import"."CodiceModello" WHERE "ModelType" = 1 AND "User"=\'' . $_SESSION['validUserName'] . "'";

        $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
        while ($row = pg_fetch_array($result, NULL, PGSQL_ASSOC)) {
            if ($row["Codice"] != $id) {
                if ($id != -1) {
                    $modello .= PointData($nome, $lodData, $xc, $yc, $zc, $radius, $firstWrite);
                    $firstWrite = false;
                }

                $id = $row["Codice"];
                $nome = "p" . $id;
                $lodData = "";
                $xc = $row["xc"];
                $yc = $row["yc"];
                $zc = $row["zc"];
                $radius = $row["Radius"];
            }

            $lodData .= '"l' . $row["LoD"] . '": ' . $row["JSON_NumeroParti"] . ",";
        }
        if ($id != -1) {
            $modello .= PointData($nome, $lodData, $xc, $yc, $zc, $radius, $firstWrite);
        }

        $modello .= <<<EOT
	]
EOT;

        return $modello;
    }

    /**
     * @param $dbConnection
     * @return string
     */
    function HotSpotData($dbConnection)
    {
        /**
         * @param $nome
         * @param $xc
         * @param $yc
         * @param $zc
         * @param $radius
         * @param $color
         * @param $alphaChannel
         * @param $firstWrite
         * @return string
         */
        function SingleHotSpotData($nome, $xc, $yc, $zc, $radius, $color, $alphaChannel, $firstWrite)
        {
            $transparent = $alphaChannel == 1.0 ? "false" : "true";

            $modello = $firstWrite ? "" : ",\n";
            $modello .= <<<EOT
        {
            "type": "name",
            "id": "$nome",
            "name": "$nome",
            "data": {
                "l0": 0,
                "xc": $xc,
                "yc": $yc,
                "zc": $zc,
                "R": $radius,
                "ActualLevel":65535,
                "PartLoaded":0,
                "TextureLoD":0
            },
            "nodes": [
                {
                    "type": "flags",
                    "flags": {
                        "picking": true,
                        "enabled": true,
                        "transparent": $transparent
                    },
                    "nodes": [
                        {
                            "type": "shader",
                            "coreId": "objectShader",
                            "nodes": [
                                {
                                    "type": "shaderParams",
                                    "params": {
                                        "colorTransEnabled": false,
                                        "colorImported": $color
                                    },
                                    "nodes": [
                                        {
                                            "type": "material",
                                            "emit": 0.0,
                                            "baseColor": { "r": 0.5, "g": 0.5, "b": 0.6 },
                                            "specularColor": { "r": 0.9, "g": 0.9, "b": 0.9 },
                                            "highlightBaseColor": { "r": 0.0, "g": 1.0, "b": 0.0 },
                                            "alpha" : $alphaChannel,
                                            "specular": 0.2,
                                            "shine": 70.0,
                                            "nodes": [
                                                {
                                                    "type": "translate",
                                                    "x": $xc,
                                                    "y": $yc,
                                                    "z": $zc,
                                                    "nodes": [
                                                        {
                                                            "type": "geometry/sphere",
                                                            "radius" : $radius
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
EOT;

            return $modello;
        }

        $modello = <<<EOT
     ,
    "HotspotData": [
EOT;

        $firstWrite = true;
        $id = -1;

        $SQL = 'SELECT "ListaOggettiLoD".*, "Import".*, "Modelli3D_HotSpotColor".*, "Categorie"."ColorR" AS "CatColorR", "Categorie"."ColorG" AS "CatColorG", "Categorie"."ColorB" AS "CatColorB", "Categorie"."ColorA" AS "CatColorA" FROM "ListaOggettiLoD" JOIN "Import" ON "ListaOggettiLoD"."CodiceModello" = "Import"."CodiceModello" JOIN "Modelli3D_HotSpotColor" ON "ListaOggettiLoD"."CodiceModello" = "Modelli3D_HotSpotColor"."CodiceModello" LEFT JOIN "Categorie" ON "ListaOggettiLoD"."Categoria" = "Categorie"."Codice" WHERE "ModelType" = 2 AND "LoD" = 0 AND "User"=\'' . $_SESSION['validUserName'] . "'";

        $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
        while ($row = pg_fetch_array($result, NULL, PGSQL_ASSOC)) {
            if ($row["Codice"] != $id) {
                $id = $row["Codice"];
                if ($row["Categoria"] != null) {
                    $color = "[" . $row["CatColorR"] . ", " . $row["CatColorG"] . ", " . $row["CatColorB"] . "]";
                    $alphaChannel = $row["CatColorA"];
                } else {
                    $color = "[" . $row["ColorR"] . ", " . $row["ColorG"] . ", " . $row["ColorB"] . "]";
                    $alphaChannel = $row["ColorA"];
                }

                $modello .= SingleHotSpotData("h" . $id, $row["xc"], $row["yc"], $row["zc"], $row["Radius"], $color, $alphaChannel, $firstWrite);
                $firstWrite = false;
            }
        }

        $modello .= <<<EOT
	]
EOT;

        return $modello;
    }

    $modello = <<<EOT
{
EOT;

    $modello .= EmptySceneData($dbConnection);

    $modello .= TexturedMeshData($dbConnection);

    $modello .= MultiTexturedMeshData($dbConnection);

    $modello .= PointCloudData($dbConnection);

    $modello .= HotspotData($dbConnection);

    $modello .= <<<EOT
}
EOT;

    echo $modello;

    include("./defaultEnd.php");
?>