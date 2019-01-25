var _myScene;
var _auxScene;
var _auxEye;
var _auxLook;
var _modUp = 1;
var _resetEye;
var _resetLook;

var _textureEnable = true;
var _selectedObjectList = [];
var _singleSelecting = true;
var _selectedWriteMode = false;

var pickHotSpot;

var _measureDistance = false;
var _measureStep = 0;
var _measureFirstCord = [];

var _addHotSpot = false;

var _isDragging = false;
var _isDragging2 = false;
var _dragged = false;
var _leftMouseDown = false;
var _rightMouseDown = false;
var _centerMouseDown = false;
var _mouseStartX;
var _mouseStartY;

var _canvasDiagonal;
var _isTouching = false;
var _touchStartX;
var _touchStartY;
var _touchEventCache = new Array();
var _startTouchDiff = -1;
var _isTouchPinch = false;
var _isTouchRotate = false;

var mittenteUpload;

var maxSubVersion;
var tempCodiceCampo;

var firstShow = true;

SceneJS.setDebugConfigs({
    shading: {
        logScripts: false,
        validate: true
    }
});

// scene functions
function CreateEmptyScene(nodes) {
    SceneJS.configure({
        pluginPath: "./fwlib/sceneJSPlugins/plugins"
    });

    if (!SceneJS.scene("the-scene")) {
        SceneJS.createScene({
            type: "scene",
            id: "the-scene",
            canvasId: "theCanvas",
            loggingElementId: "sjslog",
            nodes: nodes
        });
    }
    _myScene = SceneJS.scene("the-scene");

    _resetEye = nodes[0].eye;
    _resetLook = nodes[0].look;
    var mv = _myScene.findNode("mainview");
    var up = mv.getUp();
    up.x = 0.0;
    up.y = 0.0;
    up.z = 1.0;
    mv.setUp(up);
}

function SetAuxScene() {
    _auxScene = SceneJS.scene("the-scene");
    var auxmv = _auxScene.findNode("mainview");
    _auxEye = auxmv.getEye();
    _auxLook = auxmv.getLook();
    _modUp = auxmv.getUp().z;
}

function AddNodes(nodes) {
    var blocchi = _myScene.findNode("block");

    $.each(nodes, function (index, value) {
        if (_myScene.findNode(value.id) == null) {
            try {
                blocchi.addNode(value);
            }
            catch (err) {
                alert("Error adding nodes: ".err);
            }
        }
    });
}

function AddMultiTextureNodes(nodes) {
    var blocchi = _myScene.findNode("MultiTexture");

    $.each(nodes, function (index, value) {
        if (_myScene.findNode(value.id) == null) {
            try {
                blocchi.addNode(value);
            }
            catch (err) {
                alert("Error adding nodes: ".err);
            }
        }
    });
}

function AddPointCloud(nodes) {
    var pointCloud = _myScene.findNode("PointCloud");

    $.each(nodes, function (index, value) {
        if (_myScene.findNode(value.id) == null) {
            try {
                pointCloud.addNode(value);
            }
            catch (err) {
                alert("Error adding nodes: ".err);
            }
        }
    });
}

function AddHotSpots(nodes) {
    var hotSpot = _myScene.findNode("HotSpot");

    $.each(nodes, function (index, value) {
        if (_myScene.findNode(value.nodes[0].id) == null) {
            try {
                hotSpot.addNode(value);
            }
            catch (err) {
                alert("Error adding nodes: ".err);
            }
        }
    });
}

function LoadTexture(node, lod) {
    var MyTextureCacheManager = new TextureCacheManager();
    MyTextureCacheManager.fileReceived = function (data) {
        //node.node(0).node(0).node(0).setSrc(data == null ? "trasparent.png" : "data:" + data.mimeType + ";base64," + data.innerData);
        node.node(0).node(0).node(0).node(0).setSrc("data:" + data.mimeType + ";base64," + data.innerData);
        node.data.TextureLoD = lod;
    };
    MyTextureCacheManager.getFile(node.getId(), lod);
}

function LoadMultiTexture(node, id, lod) {
    var MyTextureCacheManager = new TextureCacheManager();
    MyTextureCacheManager.fileReceived = function (data) {
        //node.node(0).node(0).node(0).setSrc(data == null ? "trasparent.png" : "data:" + data.mimeType + ";base64," + data.innerData);
        node.node(0).setSrc("data:" + data.mimeType + ";base64," + data.innerData);
        node.data.TextureLoD = lod;
    };
    MyTextureCacheManager.getFile(id, lod);
}

function ChangeSelectedTextureLod() {
    for (var i in _selectedObjectList) {
        ChangeTextureLod(_selectedObjectList[i]);
    }
}

function ChangeTextureLod(selObject) {
    var lodTexture = $("#select-lodtexture option:selected").val()
    if (selObject.getId().substring(0,1) == "a") {
        if (selObject.data.TextureLoD != lodTexture) {
            LoadTexture(selObject, lodTexture);
        }
    }
    else if (selObject.getId().substring(0,1) == "m") {
        if (selObject.data.TextureLoD != lodTexture) {
            selObject.data.TextureLoD = lodTexture;

            var multiblocco = selObject.node(0).node(0).node(0);
            multiblocco.eachNode(
                function () {
                    var id = this.getId();
                    var pos = id.lastIndexOf("_");
                    var multi = parseInt(id.substring(pos + 1, id.length));
                    id = id.substring(1, pos);
                    LoadMultiTexture(this, "m" + id, multi * 100 + parseInt(lodTexture));
                },
                {
                    andSelf: false,     // Visit our myLookat node as well
                    depthFirst: false   // Descend depth-first into tree
                }
            );
        }
    }
}

function LoadNodes(lodModello, lodTexture) {
    var blocchi = _myScene.findNode("block");
    blocchi.eachNode(
        function () {
            this.data.TextureLoD = lodTexture;
            var levelToLoad = lodModello;
            if (levelToLoad < this.getData().ActualLevel) {
                while (!(this.getData().hasOwnProperty('l' + levelToLoad))) {
                    levelToLoad--;
                    if (levelToLoad < 0) break;
                }
                if ((levelToLoad >= 0) && (levelToLoad < this.getData().ActualLevel)) {
                    this.data.ActualLevel = 65535;

                    this.node(0).node(0).node(0).addNode(
                        {
                            type: "texture",
                            src: "trasparent.png",
                            applyTo: "color"
                        }
                    );
                    if (_textureEnable) {
                        LoadTexture(this, lodTexture);
                    }
                    /*                    else {
                     this.node(0).node(0).node(0).node(0).setSrc("trasparent.png");
                     }*/

                    for (var i = 0; i < this.getData()['l' + levelToLoad]; i++) {
                        this.node(0).node(0).node(0).node(0).addNode(
                            {
                                type: "prims/myGeometry",
                                fid: (this.getId() + "_" + i + "_" + levelToLoad)
                            }
                        )
                    }
                    this.data.ActualLevel = levelToLoad;
                }
            }
        },
        {
            andSelf: false,     // Visit our myLookat node as well
            depthFirst: false   // Descend depth-first into tree
        }
    );
}

function LoadMultiTextureNodes(lodModello, lodTexture) {
    var blocchi = _myScene.findNode("MultiTexture");
    blocchi.eachNode(
        function () {
            this.data.TextureLoD = lodTexture;
            var multiblocco = this.node(0).node(0).node(0);
            multiblocco.eachNode(
                function () {
                    this.data.TextureLoD = lodTexture;
                    var levelToLoad = lodModello;
                    if (levelToLoad < this.getData().ActualLevel) {
                        while (!(this.getData().hasOwnProperty('l' + levelToLoad))) {
                            levelToLoad--;
                            if (levelToLoad < 0) break;
                        }
                        if ((levelToLoad >= 0) && (levelToLoad < this.getData().ActualLevel)) {
                            this.data.ActualLevel = 65535;

                            this.addNode(
                                {
                                    type: "texture",
                                    src: "trasparent.png",
                                    applyTo: "color"
                                }
                            );

                            var id = this.getId();
                            var pos = id.lastIndexOf("_");
                            var multi = parseInt(id.substring(pos + 1, id.length));
                            var multiPos = multi * 100 + parseInt(levelToLoad);
                            id = id.substring(1, pos);

                            if (_textureEnable) {
                                LoadMultiTexture(this, "m" + id,  multi * 100 + parseInt(lodTexture));
                            }
                            /*                    else {
                             this.node(0).node(0).node(0).node(0).setSrc("trasparent.png");
                             }*/

                            for (var i = 0; i < this.getData()['l' + levelToLoad]; i++) {
                                this.node(0).addNode(
                                    {
                                        type: "prims/myGeometry",
                                        fid: (id + "_" + i + "_" + multiPos)
                                    }
                                )
                            }
                            this.data.ActualLevel = levelToLoad;
                        }
                    }
                },
                {
                    andSelf: false,     // Visit our myLookat node as well
                    depthFirst: false   // Descend depth-first into tree
                }
            );
        },
        {
            andSelf: false,     // Visit our myLookat node as well
            depthFirst: false   // Descend depth-first into tree
        }
    );
}

function LoadPointClouds(lodModello) {
    var blocchi = _myScene.findNode("PointCloud");
    blocchi.eachNode(
        function () {
            var levelToLoad = lodModello;
            if (levelToLoad < this.getData().ActualLevel) {
                while (!(this.getData().hasOwnProperty('l' + levelToLoad))) {
                    levelToLoad--;
                    if (levelToLoad < 0) break;
                }
                if ((levelToLoad >= 0) && (levelToLoad < this.getData().ActualLevel)) {
                    this.data.ActualLevel = 65535;

                    for (var i = 0; i < this.getData()['l' + levelToLoad]; i++) {
                        this.node(0).node(0).node(0).addNode(
                            {
                                type: "prims/myPointCloud",
                                fid: (this.getId() + "_" + i + "_" + levelToLoad)
                            }
                        )
                    }
                    this.data.ActualLevel = levelToLoad;
                }
            }
        },
        {
            andSelf: false,     // Visit our myLookat node as well
            depthFirst: false   // Descend depth-first into tree
        }
    );
}

function LoadScene(layer0, layer1, layer2, layer3, nome, lodModello, lodTexture, rw) {
    aspect = $("#theCanvas").width() / $("#theCanvas").height();

    $.getJSON("./php/" + "modello" + ".php?aspect=" + aspect + "&layer0CB=" + layer0 + "&layer1CB=" + layer1 + "&layer2CB=" + layer2 + "&layer3CB=" + layer3 + "&nomeInternoCB=" + nome + "&rwCB=" + rw)
        .success(function (data, textStatus, jqXHR) {
            CreateEmptyScene(data.emptyScene);

            AddNodes(data.nodes);
            AddMultiTextureNodes(data.multitexture);
            AddPointCloud(data.pointclouds);
            AddHotSpots(data.hotspots);

            SetEventHandler();

            LoadNodes(lodModello, lodTexture);
            LoadMultiTextureNodes(lodModello, lodTexture);
            LoadPointClouds(lodModello);

            UpdateCategory();
            CreateSchede();
        })
        .error(function (jqXHR, textStatus, errorThrown) {
            alert(textStatus);
        })
        .complete(function () {
            UnselectAllObjects();
            console.log("Loaded!");
        });
}

function resizeCanvas() {
    try {
        var scene = SceneJS.scene("the-scene");
        var mc = scene.findNode("maincamera");
        var optics = mc.get("optics");
        optics.aspect = $("#theCanvas").width() / $("#theCanvas").height();
        mc.set("optics", optics);
    }
    catch (error) {
    }
}

function showHit(hit, name, scaleFator) {
    _myScene.getNode("block")
        .addNode({
            type: "name",
            id: name,
            name: name,
            nodes: [
                {
                    type: "material",
                    color: {r: 1, g: 0.3, b: 0.3},
                    alpha: 0.4,
                    nodes: [
                        {
                            type: "flags",
                            flags: {
                                picking: false,
                                transparent: true
                            },
                            nodes: [
                                {
                                    type: "translate",
                                    x: hit.worldPos[0],
                                    y: hit.worldPos[1],
                                    z: hit.worldPos[2],
                                    nodes: [
                                        {
                                            type: "scale",
                                            x: scaleFator,
                                            y: scaleFator,
                                            z: scaleFator,
                                            nodes: [
                                                // Sphere primitive implemented by plugin at http://scenejs.org/api/latest/plugins/node/geometry/sphere.js
                                                {
                                                    type: "geometry/sphere"
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
        });
}

function CleanDistanceHit() {
    if (_myScene != null) {
        var blocchi = _myScene.findNode("block");
        var hit = _myScene.findNode("hit1");
        if (hit) {
            blocchi.removeNode(hit);
        }
        hit = _myScene.findNode("hit2");
        if (hit) {
            blocchi.removeNode(hit);
        }
        var distanceLine = _myScene.findNode("distanceLine");
        if (distanceLine) {
            blocchi.removeNode(distanceLine);
        }
        $("#distanceText").text("click to set start point for the measurement");
        _measureStep = 0;
    }
}

function ShowDistanceLine(startCord, endCord, name) {
    _myScene.getNode("block")
        .addNode({
            type: "name",
            id: name,
            name: name,
            nodes: [
                {
                    type: "material",
                    color: {r: 1, g: 0.3, b: 0.3},
                    nodes: [
                        {
                            type: "flags",
                            flags: {
                                picking: false
                            },
                            nodes: [
                                {
                                    type: "style",
                                    lineWidth: 8, // Default

                                    nodes: [
                                        {
                                            type: "geometry",
                                            primitive: "lines",

                                            positions: [

                                                startCord[0], startCord[1], startCord[2],
                                                endCord[0], endCord[1], endCord[2]
                                            ],

                                            indices: [
                                                0, 1
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
}

function SceneClickHandler(coords) {
    if (_measureDistance) {
        var pickRecord = _myScene.pick({canvasPos: [coords.x, coords.y], rayPick: true});
        if (pickRecord) {
            if (_measureStep == 0) {
                //alert(Distance([_auxEye.x, _auxEye.y, _auxEye.z], pickRecord.worldPos));
                    showHit(pickRecord, "hit1", Distance([_auxEye.x, _auxEye.y, _auxEye.z], pickRecord.worldPos) / 175);
                _measureFirstCord = pickRecord.worldPos;
                _measureStep = 1;
            }
            else if (_measureStep == 1) {
                showHit(pickRecord, "hit2", Distance([_auxEye.x, _auxEye.y, _auxEye.z], pickRecord.worldPos) / 175);
                _measureStep = 2;
                showDistanceLine(_measureFirstCord, pickRecord.worldPos, "distanceLine");

//            var dist = Math.sqrt(Math.pow(pickRecord.worldPos[0] - _measureFirstCord[0], 2) + Math.pow(pickRecord.worldPos[1] - _measureFirstCord[1], 2) + Math.pow(pickRecord.worldPos[2] - _measureFirstCord[2], 2));
//            setTimeout(function(){alert("distance: " + dist.toFixed(2) + " m")}, 250);
            }
            else {
                CleanDistanceHit();
            }
        }
        else {
            CleanDistanceHit();
        }
    }
    else if (_addHotSpot) {
        var pickRecord = _myScene.pick({canvasPos: [coords.x, coords.y], rayPick: true});
        if (pickRecord) {
            AddNewHotSpot(pickRecord);
        }
        else {
            alert("Occorre cliccare su un modello 3D");
        }
    }
    else {
        var pickRecord = _myScene.pick({canvasPos: [coords.x, coords.y]});

        if (pickRecord) {
            var pickedObject = _myScene.findNode(pickRecord.name);
            if (pickedObject.getId().substring(0,1) == "m") {
                pickedObject = pickedObject.parent.parent.parent.parent;
            }

            if (_selectedObjectList.indexOf(pickedObject) == -1) {
                SelectObject(pickedObject);

                ResetInfoPanel(".infoOggettoPanelAux2");
                ResetInfoPanel(".infoVersionPanelAux2");

                var codice = pickedObject.getName().substring(1);

                GetWriteMode(codice);

                UpdateInfoPanel(codice);

                UpdateImagePanel(codice);

                UpdateFilePanel(codice);
            }
            else {
                UnselectObject(pickedObject);
            }
        }
        else {
            UnselectAllObjects();
        }
    }
}

// camera functions
function PanXZ(moveX, moveZ) {
    if (_auxScene) {
        var auxmv = _auxScene.findNode("mainview");
        var eye = auxmv.getEye();
        var look = auxmv.getLook();

        var x = -_auxEye.x + _auxLook.x;
        var y = -_auxEye.y + _auxLook.y;
        var z = -_auxEye.z + _auxLook.z;
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
        var theta = Math.acos(z / r);
        var phi = Math.atan2(y / r, x / r);

        look.x = _auxLook.x - _modUp * (moveX * r) * Math.sin(phi) - _modUp * (moveZ * r) * Math.cos(phi) * Math.cos(theta);
        look.y = _auxLook.y + _modUp * (moveX * r) * Math.cos(phi) - _modUp * (moveZ * r) * Math.sin(phi) * Math.cos(theta);
        look.z = _auxLook.z + _modUp * (moveZ * r) * Math.sin(theta);
        eye.x = look.x - r * Math.sin(theta) * Math.cos(phi);
        eye.y = look.y - r * Math.sin(theta) * Math.sin(phi);
        eye.z = look.z - r * Math.cos(theta);

        auxmv.setLook(look);
        auxmv.setEye(eye);
    }
}

function PanY(moveY) {
    if (_auxScene) {
        var auxmv = _auxScene.findNode("mainview");
        var eye = auxmv.getEye();
        var look = auxmv.getLook();

        var x = -_auxEye.x + _auxLook.x;
        var y = -_auxEye.y + _auxLook.y;
        var z = -_auxEye.z + _auxLook.z;
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
        var theta = Math.acos(z / r);
        var phi = Math.atan2(y / r, x / r);

        look.x = _auxLook.x - (moveY * r) * Math.cos(phi) * Math.sin(theta);
        look.y = _auxLook.y - (moveY * r) * Math.sin(phi) * Math.sin(theta);
        look.z = _auxLook.z - (moveY * r) * Math.cos(theta);
        eye.x = -r * Math.sin(theta) * Math.cos(phi) + look.x;
        eye.y = -r * Math.sin(theta) * Math.sin(phi) + look.y;
        eye.z = -r * Math.cos(theta) + look.z;

        auxmv.setLook(look);
        auxmv.setEye(eye);
    }
}

function RotateXZ(angleX, angleZ) {
    if (_auxScene) {
        var auxmv = _auxScene.findNode("mainview");
        var up = auxmv.getUp();
        var eye = auxmv.getEye();
        var look = auxmv.getLook();

        var x = -_auxEye.x + _auxLook.x;
        var y = -_auxEye.y + _auxLook.y;
        var z = -_auxEye.z + _auxLook.z;
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
        var theta = Math.acos(z / r);
        var phi = Math.atan2(y / r, x / r);
        theta = (theta + angleX * _modUp);
        theta = theta % (2 * Math.PI);

        if (Math.sin(theta) < 0) {
            up.z = -_modUp;
        }
        else {
            up.z = _modUp;
        }
        phi = (phi - angleZ * _modUp);

        eye.x = -r * Math.sin(theta) * Math.cos(phi) + look.x;
        eye.y = -r * Math.sin(theta) * Math.sin(phi) + look.y;
        eye.z = -r * Math.cos(theta) + look.z;

        auxmv.setEye(eye);
        auxmv.setUp(up);
    }
}

function LookRotateXZ(angleX, angleZ) {
    if (_auxScene) {
        var auxmv = _auxScene.findNode("mainview");
        var up = auxmv.getUp();
        var eye = auxmv.getEye();
        var look = auxmv.getLook();

        var x = -_auxEye.x + _auxLook.x;
        var y = -_auxEye.y + _auxLook.y;
        var z = -_auxEye.z + _auxLook.z;
        var r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
        var theta = Math.acos(z / r);
        var phi = Math.atan2(y / r, x / r);
        theta = (theta + angleX * _modUp);
        theta = theta % (2 * Math.PI);

        if (Math.sin(theta) < 0) {
            up.z = -_modUp;
        }
        else {
            up.z = _modUp;
        }
        phi = (phi - angleZ * _modUp);

        look.x = r * Math.sin(theta) * Math.cos(phi) + eye.x;
        look.y = r * Math.sin(theta) * Math.sin(phi) + eye.y;
        look.z = r * Math.cos(theta) + eye.z;

        auxmv.setLook(look);
        auxmv.setUp(up);
    }
}

function WheelZoom(value) {
    if (_myScene) {
        var mv = _myScene.findNode("mainview");
        var eye = mv.getEye();
        var look = mv.getLook();

        var x = -eye.x + look.x;
        var y = -eye.y + look.y;
        var z = -eye.z + look.z;

        eye.x = eye.x - x * (value);
        eye.y = eye.y - y * (value);
        eye.z = eye.z - z * (value);

        mv.setEye(eye);

        _auxEye = eye;
    }
}

function Zoom(value) {
    if (value < 0) {
        value = value * 10;
    }
    else {
        if (value >= 0.98) {
            value = 0.98;
        }
    }

    if (_auxScene) {
        var auxmv = _auxScene.findNode("mainview");
        var eye = auxmv.getEye();

        var x = -_auxEye.x + _auxLook.x;
        var y = -_auxEye.y + _auxLook.y;
        var z = -_auxEye.z + _auxLook.z;

        eye.x = _auxEye.x + x * (value);
        eye.y = _auxEye.y + y * (value);
        eye.z = _auxEye.z + z * (value);

        auxmv.setEye(eye);
    }
}

function ResetEye() {
    if (_auxScene) {
        var mv = _myScene.findNode("mainview");
        var up = mv.getUp();
        up.x = 0.0;
        up.y = 0.0;
        up.z = 1.0;
        mv.setUp(up);
        mv.setLook(_resetLook);
        mv.setEye(_resetEye);
        SetAuxScene();
    }
}

//common function
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// events functions
$(document).on("pageshow", function () {
    if ($("#actualUser").text() == "") {
        setTimeout(function () {
            $("#creditInfoPopup").popup("open");
            //$("#popupLogin").popup("open");
        }, 100); // delay above zero
    }
    else if (firstShow) {
        firstShow = 0;
        setTimeout(function () {
            $("#caricamentoPanel").panel("open");
        }, 1000);
    }
});

function login() {
    setTimeout(function () {
        $("#popupLogin").popup("open");
    }, 100);
}

$(document).ready(function () {
    $("#ctr-select-layer0").bind("tap", tapHandlerLayer0);
    $("#ctr-select-layer1").bind("tap", tapHandlerLayer1);
    $("#ctr-select-layer2").bind("tap", tapHandlerLayer2);
    $("#ctr-select-layer3").bind("tap", tapHandlerLayer3);
    $("#ctr-select-nome").bind("tap", tapHandlerNome);

    function tapHandlerLayer0(event) {
        $.ajax({
                url: "./php/getElementiModelloPerCombo.php",
                dataType: "json",
                crossDomain: false,
                data: {
                    campo: "Layer0",
                    layer1: $("#select-layer1 option:selected").val(),
                    layer2: $("#select-layer2 option:selected").val(),
                    layer3: $("#select-layer3 option:selected").val(),
                    nome: $("#select-nome option:selected").val()
                }
            })
            .then(function (response) {
                html = "";
                html += "<option value=\"" + "\">" + "don't filter</option>";
                html += "<option value=\"" + "\">" + "don't filter</option>";
                $.each(response, function (i, val) {
                        html += "<option value=\"" + val.Layer0 + "\">" + val.Layer0 + "</option>";
                });
                $("#select-layer0").html(html);
                $("#select-layer0").selectmenu('refresh', true);
            });


    }

    function tapHandlerLayer1(event) {

        $.ajax({
                url: "./php/getElementiModelloPerCombo.php",
                dataType: "json",
                crossDomain: false,
                data: {
                    campo: "Layer1",
                    layer0: $("#select-layer0 option:selected").val(),
                    layer2: $("#select-layer2 option:selected").val(),
                    layer3: $("#select-layer3 option:selected").val(),
                    nome: $("#select-nome option:selected").val()
                }
            })
            .then(function (response) {
                html = "";
                html += "<option value=\"" + "\">" + "don't filter</option>";
                html += "<option value=\"" + "\">" + "don't filter</option>";

                $.each(response, function (i, val) {
                    if (val.Layer1 != "-") {
                        html += "<option value=\"" + val.Layer1 + "\">" + val.Layer1 + "</option>";
                    }
                    else {
                        html += "<option value=\"" + val.Layer1 + "\">models of previous level</option>";
                    }
                });
                $("#select-layer1").html(html);
                $("#select-layer1").selectmenu('refresh', true);
            });


    }

    function tapHandlerLayer2(event) {

        $.ajax({
                url: "./php/getElementiModelloPerCombo.php",
                dataType: "json",
                crossDomain: false,
                data: {
                    campo: "Layer2",
                    layer0: $("#select-layer0 option:selected").val(),
                    layer1: $("#select-layer1 option:selected").val(),
                    layer3: $("#select-layer3 option:selected").val(),
                    nome: $("#select-nome option:selected").val()
                }
            })
            .then(function (response) {
                html = "";
                html += "<option value=\"" + "\">" + "don't filter</option>";
                html += "<option value=\"" + "\">" + "don't filter</option>";

                $.each(response, function (i, val) {
                    if (val.Layer2 != "-") {
                        html += "<option value=\"" + val.Layer2 + "\">" + val.Layer2 + "</option>";
                    }
                    else  {
                        html += "<option value=\"" + val.Layer2 + "\">models of previous level</option>";
                    }
                });
                $("#select-layer2").html(html);
                $("#select-layer2").selectmenu('refresh', true);
            });


    }

    function tapHandlerLayer3(event) {

        $.ajax({
                url: "./php/getElementiModelloPerCombo.php",
                dataType: "json",
                crossDomain: false,
                data: {
                    campo: "Layer3",
                    layer0: $("#select-layer0 option:selected").val(),
                    layer1: $("#select-layer1 option:selected").val(),
                    layer2: $("#select-layer2 option:selected").val(),
                    nome: $("#select-nome option:selected").val()
                }
            })
            .then(function (response) {
                html = "";
                html += "<option value=\"" + "\">" + "don't filter</option>";
                html += "<option value=\"" + "\">" + "don't filter</option>";

                $.each(response, function (i, val) {
                    if (val.Layer3 != "-") {
                        html += "<option value=\"" + val.Layer3 + "\">" + val.Layer3 + "</option>";
                    }
                    else {
                        html += "<option value=\"" + val.Layer3 + "\">models of previous level</option>";
                    }
                });
                $("#select-layer3").html(html);
                $("#select-layer3").selectmenu('refresh', true);
            });


    }

    function tapHandlerNome(event) {

        $.ajax({
                url: "./php/getElementiModelloPerCombo.php",
                dataType: "json",
                crossDomain: false,
                data: {
                    campo: "Name",
                    layer0: $("#select-layer0 option:selected").val(),
                    layer1: $("#select-layer1 option:selected").val(),
                    layer2: $("#select-layer2 option:selected").val(),
                    layer3: $("#select-layer3 option:selected").val()
                }
            })
            .then(function (response) {
                html = "";
                //html += "<option value=\"*previouslist*\">" + "load only previous list</option>";
                html += "<option value=\"\">" + "all items</option>";
                html += "<option value=\"\">" + "all items</option>";

                $.each(response, function (i, val) {
                    if (val.Name != "-") {
                        html += "<option value=\"" + val.Name + "\">" + val.Name + "</option>";
                    }
                    else {
                        html += "<option value=\"" + val.Name + "\">models of previous level</option>";
                    }
                });
                $("#select-nome").html(html);
                $("#select-nome").selectmenu('refresh', true);
            });
    }
});

$(document).on("pagecreate", function () {
    $(window).resize(function () {
        resizeCanvas();
    });

    var options = {
        target: '#output',   // target element(s) to be updated with server response
        beforeSubmit: beforeSubmit,  // pre-submit callback
        success: afterSuccess,  // post-submit callback
        uploadProgress: OnProgress, //upload progress callback
        resetForm: true        // reset the form after successful submit
    };

    $('#cancelUploadBtn').unbind('click').bind('click', function () {
        $('#aggiungiImmaginePopup').popup("close");
    });

    $('#cancelUploadFileBtn').unbind('click').bind('click', function () {
        $('#aggiungiFilePopup').popup("close");
    });

    $('#MyUploadForm').unbind('submit').bind('submit', function () {
        //$('#MyUploadForm').submit(function () {
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        var day = today.getDate();

        try {
            year = data.files[index].lastModifiedDate.getFullYear();
            month = data.files[index].lastModifiedDate.getMonth() + 1;
            day = data.files[index].lastModifiedDate.getDate();
        }
        catch (err) {
        }
        var str = "" + month;
        var pad = "00";
        month = pad.substring(0, pad.length - str.length) + str;
        str = "" + day;
        day = pad.substring(0, pad.length - str.length) + str;

        $('#mittente').val(mittenteUpload);
        if (mittenteUpload == 1) {
            $('#codiceOggetto').val($('#textCodice').val());
            $('#URL').val("./" + $('#textLayer0').val() + "/" + $('#textLayer1').val() + "/" + $('#textLayer2').val() + "/" + $('#textLayer3').val() + "/" + $('#textName').val() + "/");
        }
        else if (mittenteUpload == 2) {
            $('#codiceOggetto').val($('#textCodiceVersione').val());
            $('#URL').val("./" + $('#textLayer0').val() + "/" + $('#textLayer1').val() + "/" + $('#textLayer2').val() + "/" + $('#textLayer3').val() + "/" + $('#textName').val() + "/");
        }
        /*        else if (mittenteUpload == 2) {
         $('#codiceIntervento').val($('#versionImage').data("rifint"));
         $('#URL').val("./Interventi/" + $('#textLayer0').val() + "/");
         }
         else if (mittenteUpload == 3) {
         $('#codiceIntervento').val($('#addPhoto03').data("rifint"));
         $('#URL').val("./Interventi/" + $('#textLayer0').val() + "/");
         }*/
        else {
            return false;
        }
        $('#dataIns').val("" + year + "-" + month + "-" + day + "");


        $(this).ajaxSubmit(options);
        // always return false to prevent standard browser submit and page navigation
        return false;
    });

    $('#FileUploadForm').unbind('submit').bind('submit', function () {
        //$('#MyUploadForm').submit(function () {
        var today = new Date();
        var year = today.getFullYear();
        var month = today.getMonth() + 1;
        var day = today.getDate();

        try {
            year = data.files[index].lastModifiedDate.getFullYear();
            month = data.files[index].lastModifiedDate.getMonth() + 1;
            day = data.files[index].lastModifiedDate.getDate();
        }
        catch (err) {
        }
        var str = "" + month;
        var pad = "00";
        month = pad.substring(0, pad.length - str.length) + str;
        str = "" + day;
        day = pad.substring(0, pad.length - str.length) + str;

        $('#mittenteFile').val(mittenteUpload);
        if (mittenteUpload == 11) {
            $('#codiceFileOggetto').val($('#textCodice').val());
            $('#URLFile').val("./" + $('#textLayer0').val() + "/" + $('#textLayer1').val() + "/" + $('#textLayer2').val() + "/" + $('#textLayer3').val() + "/" + $('#textName').val() + "/");
        }
        else if (mittenteUpload == 12) {
            $('#codiceFileOggetto').val($('#textCodiceVersione').val());
            $('#URLFile').val("./" + $('#textLayer0').val() + "/" + $('#textLayer1').val() + "/" + $('#textLayer2').val() + "/" + $('#textLayer3').val() + "/" + $('#textName').val() + "/");
        }
        else {
            return false;
        }
        $('#dataInsFile').val("" + year + "-" + month + "-" + day + "");

        var options2 = {
            target: '#outputFile',   // target element(s) to be updated with server response
            beforeSubmit: beforeSubmitFile,  // pre-submit callback
            success: afterSuccessFile,  // post-submit callback
            uploadProgress: OnProgressFile, //upload progress callback
            resetForm: true        // reset the form after successful submit
        };

        $(this).ajaxSubmit(options2);
        // always return false to prevent standard browser submit and page navigation
        return false;
    });

    $.event.special.tap.emitTapOnTaphold = 'false';

    $("#loginForm").unbind('submit').bind('submit', function (event) {
        $("#popupLogin").popup("close");
    });

    $("#enableTexture").unbind('click').bind('click', function () {
        $("#enableTexture").toggleClass("ui-icon-cloud ui-icon-grid");
        _textureEnable = $("#enableTexture").hasClass("ui-icon-cloud");

        var blocchi = _myScene.findNode("block");
        blocchi.eachNode(
            function () {
                var sel_lod = $('#select-lodtexture option:selected').val();
                if (_textureEnable) {
                    LoadTexture(this, sel_lod);
                }
                else {
                    this.node(0).node(0).node(0).node(0).setSrc("trasparent.png");
                }
            }
        );

        var blocchi = _myScene.findNode("MultiTexture");
        blocchi.eachNode(
            function () {
                var lodTexture = $('#select-lodtexture option:selected').val();
                this.data.TextureLoD = lodTexture;

                var multiblocco = this.node(0).node(0).node(0);
                multiblocco.eachNode(
                    function () {
                        if (_textureEnable) {
                            var id = this.getId();
                            var pos = id.lastIndexOf("_");
                            var multi = parseInt(id.substring(pos + 1, id.length));
                            id = id.substring(1, pos);
                            LoadMultiTexture(this, "m" + id, multi * 100 + parseInt(lodTexture));
                        }
                        else {
                            this.node(0).setSrc("trasparent.png");
                        }
                    },
                    {
                        andSelf: false,     // Visit our myLookat node as well
                        depthFirst: false   // Descend depth-first into tree
                    }
                );
            }
        );
    });

    $("#editToolbar").unbind('click').bind('click', function () {
        var bar = $("#hideObjectToolbar");
        var header = $(".ui-header");
        var footerBar = $("#footerBar");
        $("#editToolbar").toggleClass("ui-icon-carat-d ui-icon-carat-u");
        if (bar.hasClass("hideToolbar")) {
            $("#editToolbar").attr("title","Nasconde la toolbar di editing");
            bar.removeClass("hideToolbar").addClass("showToolbar");
            $("#pippo").css("height", "calc(100% - 2px - " + footerBar.css("height") + " - " + header.css("height") + ")");
        }
        else {
            //$("#theCanvas").css("height", "calc(100% - 4px)");
            $("#editToolbar").attr("title","Visualizza la toolbar di editing");
            bar.removeClass("showToolbar").addClass("hideToolbar");
            $("#pippo").css("height", "calc(100% - 2px - " + footerBar.css("height") + " - " + header.css("height") + ")");
        }
        resizeCanvas();
    });

    $("#showNavigation").unbind('click').bind('click', function () {
        var bar = $("#hideObjectToolbar");
        var header = $(".ui-header");
        var footerBar = $("#footerBar");
        var footerGrid = $("#footerGrid");
        if (footerBar.css("height") == "0px") {
            footerBar.css("height", "auto");
            footerGrid.css("height", "auto");
            $("#pippo").css("height", "calc(100% - 2px - " + footerBar.css("height") + " - " + header.css("height") + ")");
        }
        else {
            //$("#theCanvas").css("height", "calc(100% - 4px)");
            footerBar.css("height", "0px");
            footerGrid.css("height", "0px");
            $("#pippo").css("height", "calc(100% - 2px - " + footerBar.css("height") + " - " + header.css("height") + ")");
        }
        resizeCanvas();
    });

    $("#selectAnchor").unbind('click').bind('click', function () {
        $("#selectAnchor").toggleClass("ui-icon-navigation ui-icon-plus");
        _singleSelecting = $("#selectAnchor").hasClass("ui-icon-navigation")
    });

    $("#enableDistance").unbind('click').bind('click', function () {
        $("#enableDistance").toggleClass("ui-icon-bars ui-icon-bullets");
        _measureDistance = $("#enableDistance").hasClass("ui-icon-bullets");
        if (_measureDistance) {
            $("#enableDistance").attr("title","Disabilita la misurazione della distanza");
            $("#distanceText").text("click to set start point for the measurement");
        }
        else {
            CleanDistanceHit();
            $("#enableDistance").attr("title","Abilita la misurazione della distanza");
            $("#distanceText").text("");
        }
    });

    $("#addHotSpot").unbind('click').bind('click', function () {
        $("#addHotSpot").toggleClass("ui-icon-star ui-icon-edit");
        _addHotSpot = $("#addHotSpot").hasClass("ui-icon-edit");
        if (_addHotSpot) {
            $("#addHotSpotText").text("click where you want to add a new HotSpot");
        }
        else {
            $("#addHotSpotText").text("");
        }
    });

    $("#cancelHotSpotBtn").unbind('click').bind('click', function () {
        $("#aggiungiHotSpotPopup").popup( "close" );
    });

    $("#addHotSpotBtn").unbind('click').bind('click', function () {
/*        var colors = hexToRgb($("#colorHotSpotColor")[0].value);

        $.ajax({
            type: 'POST',
            url: 'php/addNewHotSpot.php',
            data: {
                layer0: $('#textHotSpotLayer0').val(),
                layer1: $('#textHotSpotLayer1').val(),
                layer2: $('#textHotSpotLayer2').val(),
                layer3: $('#textHotSpotLayer3').val(),
                nome: $('#textHotSpotName').val(),
                xc: pickHotSpot.worldPos[0],
                yc: pickHotSpot.worldPos[1],
                zc: pickHotSpot.worldPos[2],
                radius: $('#numberHotSpotRadius').val(),
                colorr: colors.r/255,
                colorg: colors.g/255,
                colorb: colors.b/255,
                colora: 0.6,
            },
            dataType: "json",
            success: function (resultData) {
                $("#aggiungiHotSpotPopup").popup( "close" );

                LoadScene("", "", "", "", "", $('#select-lod option:selected').val(),$('#select-lodtexture option:selected').val(), true);

                $("#addHotSpot").toggleClass("ui-icon-star ui-icon-edit");
                _addHotSpot = $("#addHotSpot").hasClass("ui-icon-edit");
                $("#addHotSpotText").text("");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si � verificato un errore.");
            }
        });*/
        if ($('#HotSpotCategoryCombo').val() != 0) {
            $.ajax({
                type: 'POST',
                url: 'php/addNewHotSpotCategory.php',
                data: {
                    layer0: $('#textHotSpotLayer0').val(),
                    layer1: $('#textHotSpotLayer1').val(),
                    layer2: $('#textHotSpotLayer2').val(),
                    layer3: $('#textHotSpotLayer3').val(),
                    nome: $('#textHotSpotName').val(),
                    xc: pickHotSpot.worldPos[0],
                    yc: pickHotSpot.worldPos[1],
                    zc: pickHotSpot.worldPos[2],
                    radius: $('#numberHotSpotRadius').val(),
                    category: $('#HotSpotCategoryCombo').val()
                },
                dataType: "json",
                success: function (resultData) {
                    $("#aggiungiHotSpotPopup").popup("close");

                    LoadScene("", "", "", "", "", $('#select-lod option:selected').val(), $('#select-lodtexture option:selected').val(), true);

                    $("#addHotSpot").toggleClass("ui-icon-star ui-icon-edit");
                    _addHotSpot = $("#addHotSpot").hasClass("ui-icon-edit");
                    $("#addHotSpotText").text("");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Si � verificato un errore.");
                }
            });
        }
        else {
            alert("You must choose a category!");
        }
    });

    $("#cancelrenameObjectBtn").unbind('click').bind('click', function () {
        $("#renameObjectPopup").popup( "close" );
    });

    $("#renameObjectOKBtn").unbind('click').bind('click', function () {
        if ($('#textrenameObjectLayer0').val() != "" && $('#textrenameObjectLayer1').val() != "" && $('#textrenameObjectLayer2').val() != "" && $('#textrenameObjectLayer3').val() != "" && $('#textrenameObjectName').val() != "") {
            if (confirm("Are you sure?")) {
                $.ajax({
                    type: 'POST',
                    url: 'php/renameObject.php',
                    data: {
                        codiceOggetto: $('#textCodice').val(),
                        layer0: $('#textrenameObjectLayer0').val(),
                        layer1: $('#textrenameObjectLayer1').val(),
                        layer2: $('#textrenameObjectLayer2').val(),
                        layer3: $('#textrenameObjectLayer3').val(),
                        nome: $('#textrenameObjectName').val(),
                    },
                    dataType: "json",
                    success: function (resultData) {
                        $("#renameObjectPopup").popup("close");
                        alert("Object is renamed successful");
                        $('#textLayer0').val($('#textrenameObjectLayer0').val());
                        $('#textLayer1').val($('#textrenameObjectLayer1').val());
                        $('#textLayer2').val($('#textrenameObjectLayer2').val());
                        $('#textLayer3').val($('#textrenameObjectLayer3').val());
                        $('#textName').val($('#textrenameObjectName').val());
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Si è verificato un errore.");
                    }
                });
            }
            else {
                $("#renameObjectPopup").popup("close");
            }
        }
        else {
            alert("You must choose not empty values!");
        }
    });

    $("#cancelComboValueBtn").unbind('click').bind('click', function () {
        $("#addComboValuePopup").popup( "close" );
    });



    $("#slider-r1").on("slidestart", function (event, ui) {
            SetAuxScene();
        })
        .on("slidestop", function (event, ui) {
            SetAuxScene();

            $("#slider-r1").val(0).slider('refresh');
        })
        .unbind('change').bind('change', function () {
        RotateXZ(0, Math.PI / 180.0 * $(this).val());
    });

    $("#slider-r3").on("slidestart", function (event, ui) {
            SetAuxScene();
        })
        .on("slidestop", function (event, ui) {
            SetAuxScene();

            $("#slider-r3").val(0).slider('refresh');
        })
        .unbind('change').bind('change', function () {
        RotateXZ(-Math.PI / 180.0 * $(this).val(), 0);
    });

    $("#slider-z").on("slidestart", function (event, ui) {
            SetAuxScene();
        })
        .on("slidestop", function (event, ui) {
            SetAuxScene();

            $("#slider-z").val(0).slider('refresh');
        })
        .unbind('change').bind('change', function () {
        Zoom($(this).val() / 100);
    });

    $("#slider-p1").on("slidestart", function (event, ui) {
            SetAuxScene();
        })
        .on("slidestop", function (event, ui) {
            SetAuxScene();

            $("#slider-p1").val(0).slider('refresh');
        })
        .unbind('change').bind('change', function () {
        PanXZ(0, -$(this).val() / 200);
    });

    $("#slider-p2").on("slidestart", function (event, ui) {
            SetAuxScene();
        })
        .on("slidestop", function (event, ui) {
            SetAuxScene();

            $("#slider-p2").val(0).slider('refresh');
        })
        .unbind('change').bind('change', function () {
        PanXZ($(this).val() / 200, 0);
    });

    $("#slider-p3").on("slidestart", function (event, ui) {
            SetAuxScene();
        })
        .on("slidestop", function (event, ui) {
            SetAuxScene();

            $("#slider-p3").val(0).slider('refresh');
        })
        .unbind('change').bind('change', function () {
        PanY(-$(this).val() / 200);
    });
});

$.mobile.document
    .on("listviewcreate", "#select-layer0-menu", function (e) {
        var input,
            listbox = $("#select-layer0-listbox"),
            form = listbox.jqmData("filter-form"),
            listview = $(e.target);
        if (listbox.height() < 10000) {
            listbox.height("10000")
        }
        if (!form) {
            input = $("<input data-type='search'></input>");
            form = $("<form></form>").append(input);
            input.textinput();
            $("#select-layer0-listbox")
                .prepend(form)
                .jqmData("filter-form", form);
        }
        listview.filterable({input: input});
    })
    .on("pagebeforeshow pagehide", "#select-layer0-dialog", function (e) {
        var form = $("#select-layer0-listbox").jqmData("filter-form"),
            placeInDialog = (e.type === "pagebeforeshow"),
            destination = placeInDialog ? $(e.target).find(".ui-content") : $("#select-layer0-listbox");
        form
            .find("input")
            .textinput("option", "inset", !placeInDialog)
            .end()
            .prependTo(destination);
        $("#caricamentoPanel").panel("open");
    })
    .on("listviewcreate", "#select-layer1-menu", function (e) {
        var input,
            listbox = $("#select-layer1-listbox"),
            form = listbox.jqmData("filter-form"),
            listview = $(e.target);
        if (listbox.height() < 10000) {
            listbox.height("10000")
        }
        if (!form) {
            input = $("<input data-type='search'></input>");
            form = $("<form></form>").append(input);
            input.textinput();
            $("#select-layer1-listbox")
                .prepend(form)
                .jqmData("filter-form", form);
        }
        listview.filterable({input: input});
    })
    .on("pagebeforeshow pagehide", "#select-layer1-dialog", function (e) {
        var form = $("#select-layer1-listbox").jqmData("filter-form"),
            placeInDialog = (e.type === "pagebeforeshow"),
            destination = placeInDialog ? $(e.target).find(".ui-content") : $("#select-layer1-listbox");
        form
            .find("input")
            .textinput("option", "inset", !placeInDialog)
            .end()
            .prependTo(destination);
        if (!placeInDialog) {
            if ($('#select-layer1 option:selected').val() == "-") {
                var html = "";
                html += "<option value=\"\">all items</option>";
                html += "<option value=\"-\" selected=\"selected\">model of previous levels</option>";

                var elem = $("#select-layer2");
                elem.html(html);
                elem.selectmenu('refresh', true);

                elem = $("#select-layer3");
                elem.html(html);
                elem.selectmenu('refresh', true);

                elem = $("#select-nome");
                elem.html(html);
                elem.selectmenu('refresh', true);
            }
        }
        $("#caricamentoPanel").panel("open");
    })
    .on("listviewcreate", "#select-layer2-menu", function (e) {
        var input,
            listbox = $("#select-layer2-listbox"),
            form = listbox.jqmData("filter-form"),
            listview = $(e.target);
        if (listbox.height() < 10000) {
            listbox.height("10000")
        }
        if (!form) {
            input = $("<input data-type='search'></input>");
            form = $("<form></form>").append(input);
            input.textinput();
            $("#select-layer2-listbox")
                .prepend(form)
                .jqmData("filter-form", form);
        }
        listview.filterable({input: input});
    })
    .on("pagebeforeshow pagehide", "#select-layer2-dialog", function (e) {
        var form = $("#select-layer2-listbox").jqmData("filter-form"),
            placeInDialog = (e.type === "pagebeforeshow"),
            destination = placeInDialog ? $(e.target).find(".ui-content") : $("#select-layer2-listbox");
        form
            .find("input")
            .textinput("option", "inset", !placeInDialog)
            .end()
            .prependTo(destination);
        if ($('#select-layer2 option:selected').val() == "-") {
            var html = "";
            html += "<option value=\"\">all items</option>";
            html += "<option value=\"-\" selected=\"selected\">model of previous levels</option>";

            var elem = $("#select-layer3");
            elem.html(html);
            elem.selectmenu('refresh', true);

            elem = $("#select-nome");
            elem.html(html);
            elem.selectmenu('refresh', true);
        }
        $("#caricamentoPanel").panel("open");
    })
    .on("listviewcreate", "#select-layer3-menu", function (e) {
        var input,
            listbox = $("#select-layer3-listbox"),
            form = listbox.jqmData("filter-form"),
            listview = $(e.target);
        if (listbox.height() < 10000) {
            listbox.height("10000")
        }
        if (!form) {
            input = $("<input data-type='search'></input>");
            form = $("<form></form>").append(input);
            input.textinput();
            $("#select-layer3-listbox")
                .prepend(form)
                .jqmData("filter-form", form);
        }
        listview.filterable({input: input});
    })
    .on("pagebeforeshow pagehide", "#select-layer3-dialog", function (e) {
        var form = $("#select-layer3-listbox").jqmData("filter-form"),
            placeInDialog = (e.type === "pagebeforeshow"),
            destination = placeInDialog ? $(e.target).find(".ui-content") : $("#select-layer3-listbox");
        form
            .find("input")
            .textinput("option", "inset", !placeInDialog)
            .end()
            .prependTo(destination);
        if ($('#select-layer3 option:selected').val() == "-") {
            var html = "";
            html += "<option value=\"\">all items</option>";
            html += "<option value=\"-\" selected=\"selected\">model of previous levels</option>";

            var elem = $("#select-nome");
            elem.html(html);
            elem.selectmenu('refresh', true);
        }
        $("#caricamentoPanel").panel("open");
    })
    .on("listviewcreate", "#select-nome-menu", function (e) {
        var input,
            listbox = $("#select-nome-listbox"),
            form = listbox.jqmData("filter-form"),
            listview = $(e.target);
        if (listbox.height() < 10000) {
            listbox.height("10000")
        }
        if (!form) {
            input = $("<input data-type='search'></input>");
            form = $("<form></form>").append(input);
            input.textinput();
            $("#select-nome-listbox")
                .prepend(form)
                .jqmData("filter-form", form);
        }
        listview.filterable({input: input});
    })
    .on("pagebeforeshow pagehide", "#select-nome-dialog", function (e) {
        var form = $("#select-nome-listbox").jqmData("filter-form"),
            placeInDialog = (e.type === "pagebeforeshow"),
            destination = placeInDialog ? $(e.target).find(".ui-content") : $("#select-nome-listbox");
        form
            .find("input")
            .textinput("option", "inset", !placeInDialog)
            .end()
            .prependTo(destination);
        $("#caricamentoPanel").panel("open");
    });

function SetEventHandler() {
    _isDragging = false;
    var canvas = document.getElementById("theCanvas");
    canvas.addEventListener('mousedown', MouseDownHandler, true);
    document.addEventListener('mousemove', MouseMoveHandler, true);
    document.addEventListener('mouseup', MouseUpHandler, true);
    canvas.addEventListener("wheel", MouseWheelHandler, false);
    document.addEventListener('contextmenu', function (e) {
        if (_isDragging2) {
            e.preventDefault();
            _isDragging2 = false;
        }
    }, false);

    canvas.addEventListener("touchstart", TouchStart, false);
    canvas.addEventListener("touchend", TouchEnd, false);
    canvas.addEventListener("touchcancel", TouchCancel, false);
    canvas.addEventListener("touchmove", TouchMove, false);

    $("#select-lodtexture").on("change", ChangeSelectedTextureLod);

    $("#screenshotImage").unbind().bind("click", function (event) {
        event.preventDefault();
        $("#myThumbContainer").show();
        var imageElement = document.getElementById("myCapturedImage");
        _myScene.getNode("myCanvasCapture",
            function (myCanvasCapture) {
                myCanvasCapture.on("image",
                    function (data) {
                        imageElement.src = data.src;
                        $("#myCapturedImageHRef").attr('href', data.src);
                        $("#myCapturedImageHRef").attr('download', 'screenshot' + (new Date()).getTime() + '.jpg');
                    });
                myCanvasCapture.capture({format: "jpeg"});
            });
    });

    Leap.loop(controllerOptions, LeapController);

    SetToolbarEvent();
}

function SetToolbarEvent(blocchi) {
    $("#hideSelectedObject").unbind('click').bind('click', RemoveSelected);
    $("#selectAll").unbind('click').bind('click', SelectAll);
    $("#hideUnselectedObject").unbind('click').bind('click', RemoveUnselected);
    $("#showHidden").unbind('click').bind('click', ShowHiddenObject);
    $("#resetEye").unbind('click').bind('click', ResetEye);
    $("#renameObject").unbind('click').bind('click', RenameObject);
    $("#deleteObject").unbind('click').bind('click', DeleteObject);
    $("#addInteventoSubVersion").unbind('click').bind('click', AddInterventoSubVersion);
}

function MouseDownHandler(event) {
    SetAuxScene();
    _mouseStartX = event.clientX;
    _mouseStartY = event.clientY;
    switch (event.button) {
        case 0:
            _leftMouseDown = true;
            break;
        case 2:
            _rightMouseDown = true;
            _isDragging2 = true;
            break;
        case 1:
            _centerMouseDown = true;
            break;
    }
    _isDragging = true;
}

function Distance(startCord, endCord) {
    return Math.sqrt(Math.pow(endCord[0] - startCord[0], 2) + Math.pow(endCord[1] - startCord[1], 2) + Math.pow(endCord[2] - startCord[2], 2));
}

function ShowDistanceText(coords) {
    var pickRecord = _myScene.pick({canvasPos: [coords.x, coords.y], rayPick: true});
    if (pickRecord) {
        var dist = Distance(_measureFirstCord, pickRecord.worldPos);
        var tmp = dist / 0.52;
        var cubit = Math.floor(tmp);
        tmp = (tmp - cubit) * 7;
        var palm = Math.floor(tmp);
        var finger = Math.floor((tmp - palm) * 4);
        $("#distanceText").text("distance: " + dist.toFixed(2) + " m - royal cubit: " + cubit + "c " + palm + "p " + finger + "f");
    }
    else {
        $("#distanceText").text("outside object!");
    }
}

function MouseMoveHandler(event) {
    if (_isDragging) {
        _dragged = true;
        if (_rightMouseDown && _leftMouseDown) {
            PanY((event.clientY - _mouseStartY) / 100);
        }
        else if (_leftMouseDown) {
            PanXZ((event.clientX - _mouseStartX) / 2000, (event.clientY - _mouseStartY) / 2000)
        }
        else if (_rightMouseDown) {
            RotateXZ(Math.PI / 360.0 * (event.clientY - _mouseStartY), Math.PI / 360.0 * (event.clientX - _mouseStartX));
        }
        else if (_centerMouseDown) {
            LookRotateXZ(Math.PI / 360.0 * (event.clientY - _mouseStartY), Math.PI / 360.0 * (event.clientX - _mouseStartX));
        }
    }
    else if (_measureStep == 1) {
        var coords = ClickCoordsWithinElement(event);
        ShowDistanceText(coords);
    }
}

function MouseUpHandler(event) {
    switch (event.button) {
        case 0:
            _leftMouseDown = false;
            if (_isDragging && !_dragged) {
                MouseLeftClickHandler(event);
            }
            break;
        case 2:
            _rightMouseDown = false;
            break;
        case 1:
            _centerMouseDown = false;
            break;
    }
    _isDragging = false;
    _dragged = false;
    SetAuxScene();
}

function MouseWheelHandler(event) {
    event.preventDefault();
    WheelZoom(event.deltaY / 100);
}

function MouseLeftClickHandler(event) {
    var coords = ClickCoordsWithinElement(event);

    SceneClickHandler(coords);
}

function TouchStart(event) {
    event.preventDefault();
    SetAuxScene();
    var touchobj = event.changedTouches[0];
    _touchEventCache.push(event);
    _touchStartX = touchobj.pageX;
    _touchStartY = touchobj.pageY;
    _isTouching = true;
    if (_touchEventCache.length == 2)
    {
        var touchObj0 = _touchEventCache[0].changedTouches[0];
        var touchObj1 = _touchEventCache[1].changedTouches[0];

        _startTouchDiff = Math.sqrt(Math.pow((touchObj0.pageX - touchObj1.pageX), 2) + Math.pow((touchObj0.pageY - touchObj1.pageY), 2));

        var theCanvas = $("#theCanvas");
        _canvasDiagonal = Math.sqrt(Math.pow(theCanvas.width(), 2) + Math.pow(theCanvas.height(), 2));
    }
}

function TouchMove(event) {
    event.preventDefault();
    if (_isTouching) {
        _dragged = true;
        if (!_isTouchPinch && !_isTouchRotate && _touchEventCache.length == 1) {
            var startTouchObj = _touchEventCache[0].changedTouches[0];
            var touchObj = event.changedTouches[0];
            PanXZ((touchObj.pageX - startTouchObj.pageX) / 1350, (touchObj.pageY - startTouchObj.pageY) / 1350)
        }
        else if (!_isTouchRotate && _touchEventCache.length == 2)  {
            _isTouchPinch = true;
            for (var i = 0; i < _touchEventCache.length; i++) {
                var startTouchObj = _touchEventCache[i].changedTouches[0];
                var touchObj = event.changedTouches[0];
                if (startTouchObj.identifier == touchObj.identifier) {
/*                    var touchObj0 = _touchEventCache[0].changedTouches[0];
                    var touchObj1 = _touchEventCache[1].changedTouches[0];
                    var startTouchDiff = Math.sqrt(Math.pow((touchObj0.pageX - touchObj1.pageX), 2) + Math.pow((touchObj0.pageY - touchObj1.pageY), 2));*/
                    _touchEventCache[i] = event;
                   /* var touchObj0 = _touchEventCache[0].changedTouches[0];
                    var touchObj1 = _touchEventCache[1].changedTouches[0];
                    var currentTouchDiff = Math.sqrt(Math.pow((touchObj0.pageX - touchObj1.pageX), 2) + Math.pow((touchObj0.pageY - touchObj1.pageY), 2));
                    var dist = Math.sqrt(Math.pow((touchObj.pageX - startTouchObj.pageX), 2) + Math.pow((touchObj.pageY - startTouchObj.pageY), 2)) * (currentTouchDiff < startTouchDiff) ? 1 : -1;
                    WheelZoom(dist / 100);*/
                    break;
                }
            }

            var touchObj0 = _touchEventCache[0].changedTouches[0];
            var touchObj1 = _touchEventCache[1].changedTouches[0];
            var currentTouchDiff = Math.sqrt(Math.pow((touchObj0.pageX - touchObj1.pageX), 2) + Math.pow((touchObj0.pageY - touchObj1.pageY), 2));

            //Zoom((currentTouchDiff - _startTouchDiff) / (_startTouchDiff));


            var zoom = (currentTouchDiff - _startTouchDiff) / (_startTouchDiff * 3 * ((_canvasDiagonal - _startTouchDiff) / _canvasDiagonal))

            /*if (zoom < 0){
                zoom = zoom * 4;
            }*/

            Zoom(zoom);


            /*var startTouchObj0 = _touchEventCache[0].changedTouches[0];
            var touchObj0 = event.changedTouches[0];
            var startTouchObj1 = _touchEventCache[1].changedTouches[0];
            var touchObj1 = event.changedTouches[0];
            var startDiff = Math.abs(_touchEventCache[0].clientX - _touchEventCache[1].clientX);
            var actualDiff = Math.abs(event.clientX - event.clientX);
            WheelZoom((actualDiff - startDiff) / 100);*/
 /*           for (var i = 0; i < _touchEventCache.length; i++) {
                if (event.pointerId == _touchEventCache[i].pointerId) {
                    var startTouchObj = _touchEventCache[i].changedTouches[0];
                    var touchObj = event.changedTouches[0];
                    var dist = Math.sqrt(Math.pow((touchObj.pageX - startTouchObj.pageX), 2) + Math.pow((touchObj.pageY - startTouchObj.pageY), 2)) * (touchObj.pageX < startTouchObj.pageX) ? 1 : -1;
                    WheelZoom(dist / 100);
                    _touchEventCache[i] = event;
                    break;
                }
            }*/
        }
        else if (_touchEventCache.length == 3)  {
            _isTouchPinch = false;
            _isTouchRotate = true;
            var startTouchObj = _touchEventCache[0].changedTouches[0];
            var touchObj = event.changedTouches[0];
            if (startTouchObj.identifier == touchObj.identifier) {
                RotateXZ(Math.PI / 360.0 * (touchObj.pageY - startTouchObj.pageY), Math.PI / 360.0 * (touchObj.pageX - startTouchObj.pageX));
            }
        }
    }
}

function TouchEnd(event) {
    event.preventDefault();
    if (_isTouching && !_dragged) {
        TouchClickHandler(event);
    }
   for (var i = 0; i < _touchEventCache.length; i++) {
        if (_touchEventCache[i].changedTouches[0].identifier == event.changedTouches[0].identifier) {
            _touchEventCache.splice(i, 1);
            SetAuxScene();
            break;
        }
    }
    if (_touchEventCache.length == 0) {
        _dragged = false;
        _isTouching = false;
        _isTouchPinch = false;
        _isTouchRotate = false;
        SetAuxScene();
    }
}

function TouchCancel(event) {
    TouchEnd(event);
}

function TouchClickHandler(event) {
    var coords = {x: 0, y: 0};
    var element = event.target;
    var totalOffsetLeft = 0;
    var totalOffsetTop = 0;

    while (element.offsetParent) {
        totalOffsetLeft += element.offsetLeft;
        totalOffsetTop += element.offsetTop;
        element = element.offsetParent;
    }
    coords.x = _touchStartX - totalOffsetLeft;
    coords.y = _touchStartY - totalOffsetTop;

    SceneClickHandler(coords);
}

// selection functions
function ClickCoordsWithinElement(event) {
    var coords = {x: 0, y: 0};

    if (!event) {
        event = window.event;
        coords.x = event.x;
        coords.y = event.y;
    } else {
        var element = event.target;
        var totalOffsetLeft = 0;
        var totalOffsetTop = 0;

        while (element.offsetParent) {
            totalOffsetLeft += element.offsetLeft;
            totalOffsetTop += element.offsetTop;
            element = element.offsetParent;
        }
        coords.x = event.pageX - totalOffsetLeft;
        coords.y = event.pageY - totalOffsetTop;
    }
    return coords;
}

function AddObjectToSelected(obj) {
    obj.node(0).node(0).node(0).setParams({colorTransEnabled: !obj.node(0).node(0).node(0).getParams().colorTransEnabled});
    _selectedObjectList.push(obj);
}

function SelectObject(pickedObject) {
    if (_singleSelecting) {
        UnselectAllObjects();
    }
    AddObjectToSelected(pickedObject);

    LookAtObject(pickedObject);

    ChangeTextureLod(pickedObject);
}

function SelectAll() {
    _selectedObjectList = [];
    var blocchi = _myScene.findNode("block");

    blocchi.eachNode(
        function () {
            AddObjectToSelected(this);
        },
        {
            andSelf: false,     // Visit our myLookat node as well
            depthFirst: false   // Descend depth-first into tree
        }
    );
}

function UnselectObject(pickedObject) {
    pickedObject.node(0).node(0).node(0).setParams({colorTransEnabled: false});
    _selectedObjectList.splice(_selectedObjectList.indexOf(pickedObject), 1);

    ResetAllPanels();
}

function UnselectAllObjects() {
    for (var i in _selectedObjectList) {
        (_selectedObjectList[i]).node(0).node(0).node(0).setParams({colorTransEnabled: false})
    }
    _selectedObjectList = [];

    ResetAllPanels();
}

function ResetAllPanels() {
    $("#CategoryCombo").selectmenu('disable').val(0).selectmenu('refresh');
    ResetCategoryVisibility();
    ResetInfoPanel(".infoOggettoPanelAux2");
    ResetInfoPanel(".infoVersionPanelAux2");
    for (i = 0; i < maxSubVersion; i++) {
        ResetInfoPanel(".infoSubVersion" + i);

    }
    UpdateImagePanel(0);
    UpdateFilePanel(0);
    _selectedWriteMode = false;
}

function LookAtObject(pickedObject) {
/*    var bbox;
    if (pickedObject.id.substring(0, 1) != 'p')
    {
        bbox = pickedObject.node(0).node(0).node(0).node(0).node(0).node(0).getBoundary();
    }
    else
    {
        bbox = pickedObject.node(0).node(0).node(0).node(0).node(0).getBoundary();
    }*/
    var mv = _myScene.findNode("mainview");
    var target = mv.getLook();

/*    target.x = (bbox.xmin + bbox.xmax) / 2;
    target.y = (bbox.ymin + bbox.ymax) / 2;
    target.z = (bbox.zmin + bbox.zmax) / 2;*/
    target.x = pickedObject.data.xc;
    target.y = pickedObject.data.yc;
    target.z = pickedObject.data.zc;

    mv.setLook(target);
    _auxLook = target;
}

function GetWriteMode(codice) {
    $.ajax({
        url: "./php/getWriteMode.php",
        dataType: "json",
        crossDomain: false,
        data: {
            codiceOggetto: codice
        },
        success: function (resultData) {
            _selectedWriteMode = (resultData[0].rw == "t");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });
}

// visibility function
function RemoveSelected() {
    $.each(_selectedObjectList, function (index, value) {
        try {
            value.node(0).setEnabled(false);
        }
        catch (err) {
            alert("Error removing nodes: ".err);
        }
    });
    UnselectAllObjects();
}

function RemoveUnselected() {
    var blocchi = _myScene.findNode("block");
    blocchi.eachNode(
        function () {
            if (jQuery.inArray(this, _selectedObjectList) == -1) {
                this.node(0).setEnabled(false);
            }
        },
        {
            andSelf: false,     // Visit our myLookat node as well
            depthFirst: false   // Descend depth-first into tree
        }
    );

    var multitexture = _myScene.findNode("MultiTexture");
    multitexture.eachNode(
        function () {
            if (jQuery.inArray(this, _selectedObjectList) == -1) {
                this.node(0).setEnabled(false);
            }
        },
        {
            andSelf: false,     // Visit our myLookat node as well
            depthFirst: false   // Descend depth-first into tree
        }
    );

    var pointCloud = _myScene.findNode("PointCloud");
    pointCloud.eachNode(
        function () {
            if (jQuery.inArray(this, _selectedObjectList) == -1) {
                this.node(0).setEnabled(false);
            }
        },
        {
            andSelf: false,     // Visit our myLookat node as well
            depthFirst: false   // Descend depth-first into tree
        }
    );

    var hotSpots = _myScene.findNode("HotSpot");
    hotSpots.eachNode(
        function () {
            if (jQuery.inArray(this, _selectedObjectList) == -1) {
                this.node(0).node(0).setEnabled(false);
            }
        },
        {
            andSelf: false,     // Visit our myLookat node as well
            depthFirst: false   // Descend depth-first into tree
        }
    );
}

function ShowHiddenObject() {
    var blocchi = _myScene.findNode("block");
    blocchi.eachNode(
        function () {
            if (!this.node(0).getEnabled()) {
                this.node(0).setEnabled(true);
            }
        },
        {
            andSelf: false,     // Visit our myLookat node as well
            depthFirst: false   // Descend depth-first into tree
        }
    );

    var multitexture = _myScene.findNode("MultiTexture");
    multitexture.eachNode(
        function () {
            if (!this.node(0).getEnabled()) {
                this.node(0).setEnabled(true);
            }
        },
        {
            andSelf: false,     // Visit our myLookat node as well
            depthFirst: false   // Descend depth-first into tree
        }
    );

    var pointCloud = _myScene.findNode("PointCloud");
    pointCloud.eachNode(
        function () {
            if (!this.node(0).getEnabled()) {
                this.node(0).setEnabled(true);
            }
        },
        {
            andSelf: false,     // Visit our myLookat node as well
            depthFirst: false   // Descend depth-first into tree
        }
    );

    var hotSpots = _myScene.findNode("HotSpot");
    hotSpots.eachNode(
        function () {
            if (!this.node(0).node(0).getEnabled()) {
                this.node(0).node(0).setEnabled(true);
            }
        },
        {
            andSelf: false,     // Visit our myLookat node as well
            depthFirst: false   // Descend depth-first into tree
        }
    );
}

// Interventi function
function AddInterventoSubVersion() {
    if (confirm("Are you sure to add a new maintenance for subversion to current selected objects?")) {
        var first = true;
        var padri = "";
        $.each(_selectedObjectList, function (index, value) {
            if (first)
            {
                first = false;
            }
            else
            {
                padri += ",";
            }
            padri += value.getName().substring(1);
        });

        $.ajax({
            url: "./php/addInterventoSubVersion.php",
            dataType: "json",
            crossDomain: false,
            data: {
                codiciPadri: padri,
            },
            success: function (resultData) {
                alert("Mainteinance added!");
                UnselectAllObjects();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si è verificato un errore.");
            }
        });

    }
}

// information panel functions
function ResetInfoPanel(panel) {
    function ResetValue() {
        $(panel).children("div.ui-collapsible").each(function (i, elem) {
            $(this).find("input").each(function (i, inputElem) {
                if ($(this)[0].type == "checkbox" || $(this)[0].type == "link") {
                    $(this).prop("checked", false).checkboxradio("refresh");
                    $(this).checkboxradio("option", "disabled", true);
                }
                else {
                    $(this).val("");
                    $(this).textinput("disable");
                }
                $(".salvaImmagineButton[href='" + $(this)[0].id + "']").css('visibility', 'collapse');
            });
            $(this).find("select").each(function (i, inputElem) {
                $(this).val(0).selectmenu('refresh');
                $(this).selectmenu('disable');
                $(".salvaImmagineButton[href='" + $(this)[0].id + "']").css('visibility', 'collapse');
            });
            $(this).find("textarea").each(function (i, inputElem) {
                $(this).val("");
                $(this).textinput("disable");
                $(".salvaImmagineButton[href='" + $(this)[0].id + "']").css('visibility', 'collapse');
            });
        });
    }

    function ResetExpanderColor() {
        $(panel).find("h5.infoTitleExpander").each(function (i, inputElem) {
            if ($(this).hasClass("ui-page-theme-a")) {
                $(this).removeClass("ui-page-theme-a").addClass("ui-page-theme-b");
                $(this).children("a").each(function (i, inputElem) {
                    //$(this).css("color", "#555").css("background", "#444");
                    $(this).css("color", "#999").css("background", "#444");
                });
            }
        });
    }

    ResetExpanderColor();

    ResetValue();
}

function SetSaveInfoButton(panel) {
    function ChangeSelect( event, ui ) {
        $(".salvaImmagineButton[href='" + event.currentTarget.id + "']").css('visibility', 'visible');
    }

    $(panel).children("div.ui-collapsible").each(function (i, elem) {
            if ($(this).find("div.infoOggettoPanelInfo").length == 0 && $(this).find("div.infoVersionPanelInfo").length == 0) {
                $(this).find("input").each(function (i, inputElem) {
                    var elemID = $(this)[0].id;
                    if ($(this)[0].type == "checkbox" || $(this)[0].type == "link") {
                        $(this).checkboxradio("option", "disabled", false);
                    }
                    else {
                        $(this).textinput("enable");
                    }
                    $(".salvaImmagineButton[href='" + elemID + "']").css('visibility', 'collapse');
                    $(this).off('change', ChangeSelect).on('change', ChangeSelect).off('input', ChangeSelect).on('input', ChangeSelect);
/*                    $(this).unbind('change').bind('change', function () {
                        $(".salvaImmagineButton[href='" + elemID + "']").css('visibility', 'visible');
                    });*/
                });
                $(this).find("select").each(function (i, inputElem) {
                    var elemID = $(this)[0].id;
                    $(this).selectmenu('enable');
                    $(".salvaImmagineButton[href='" + elemID + "']").css('visibility', 'collapse');
                    $(this).off('change', ChangeSelect).on('change', ChangeSelect).off('input', ChangeSelect).on('input', ChangeSelect);
                });
            }
        $(this).find("textarea").each(function (i, inputElem) {
                var elemID = $(this)[0].id;
                $(this).textinput("enable");
                $(".salvaImmagineButton[href='" + elemID + "']").css('visibility', 'collapse');
                $(this).unbind('change').bind('change', function () {
                    $(".salvaImmagineButton[href='" + elemID + "']").css('visibility', 'visible');
                });
            });
        }
    );
}

function UpdateInfoPanel(codice) {
    function SetExpanderColor(titleId) {
        if ($(titleId).hasClass("ui-page-theme-b")) {
            $(titleId).removeClass("ui-page-theme-b").addClass("ui-page-theme-a");
            $(titleId).children("a").each(function (i, inputElem) {
                $(this).css("color", "").css("background", "");
            });
        }
    }

    function SetDynamicBoxData(resultData2, id) {
        if (resultData2.IsText == "t") {
            $(id).val(resultData2.TextValue);
        }
        else if (resultData2.IsInt == "t") {
            $(id).val(resultData2.IntValue);
        }
        else if (resultData2.IsReal == "t") {
            $(id).val(resultData2.RealValue);
        }
        else if (resultData2.IsTimestamp == "t") {
            $(id).val(getLocaleDateTime(resultData2.TimestampValue));
        }
        else if (resultData2.IsCombo == "t") {
            $(id).val(resultData2.ComboValue).selectmenu('refresh');
        }
        else if (resultData2.IsMultiCombo == "t") {
            $(id).val(resultData2.MultiComboValue.split('_')).selectmenu('refresh');
        }
        else if (resultData2.IsBool == "t" || resultData2.IsLink == "t") {
            $(id).prop("checked", resultData2.BoolValue == "t").checkboxradio("refresh");
        }
    }

    function ChangeSelectCategory( event, ui ) {
        $(".salvaImmagineButton[href='CategoryCombo']").css('visibility', 'visible');
        $("#infoOggettoPanel").panel("open");
    }

    function SetCategoryVisibility(categoria) {
        ResetCategoryVisibility();

        $.ajax({
            type: 'POST',
            url: 'php/getOggettiCategorySchede.php',
            data: {
                categoria: categoria
            },
            dataType: "json",
            success: function (resultData) {
                for (i in resultData) {
                    var id = ".infoOggettoPanelDynamic_" + resultData[i].CodiceScheda;
                   $(id).parent().parent().removeClass("HiddenUI").addClass("VisibleUI");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si � verificato un errore.");
            }
        });

        $.ajax({
            type: 'POST',
            url: 'php/getOggettiVersionCategorySchede.php',
            data: {
                categoria: categoria
            },
            dataType: "json",
            success: function (resultData) {
                for (i in resultData) {
                    var id = ".infoOggettoVersionPanelDynamic_" + resultData[i].CodiceScheda;
                    $(id).parent().parent().removeClass("HiddenUI").addClass("VisibleUI");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si � verificato un errore.");
            }
        });

        $.ajax({
            type: 'POST',
            url: 'php/getListaSubVersion.php',
            data: {
                codice: codice
            },
            dataType: "json",
            success: function (resultData) {
                for (i in resultData) {
                    var subVersion = resultData[i].SubVersion;
                    var id = ".subVersion" + subVersion;
                    $(id).parent().parent().removeClass("HiddenUI").addClass("VisibleUI");
                    //id = ".InfoSubVersion" + resultData[i].SubVersion;
                    //$(id).parent().parent().removeClass("HiddenUI").addClass("VisibleUI");
                    SetSaveInfoButton(".infoSubVersion" + subVersion);

                    $.ajax({
                        type: 'POST',
                        url: 'php/getOggettiSubVersionCategorySchede.php',
                        subVersion: subVersion,
                        data: {
                            categoria: categoria
                        },
                        dataType: "json",
                        success: function (resultData2) {
                            for (j in resultData2) {
                                var id = ".infoSubVersion" + this.subVersion + "_PanelDynamic_" + resultData2[j].CodiceScheda;
                                $(id).parent().parent().removeClass("HiddenUI").addClass("VisibleUI");
                            }
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            alert("Si � verificato un errore.");
                        }
                    });

                    if (subVersion < resultData.length - 1)
                    {
                        id = ".infoInterventoSubVersion" + subVersion;
                        $(id).parent().parent().removeClass("HiddenUI").addClass("VisibleUI");
                    }
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si � verificato un errore.");
            }
        });
    }

    $.ajax({
        type: 'POST',
        url: 'php/getInfoOggettiBase.php',
        data: {
            codice: codice
        },
        dataType: "json",
        success: function (resultData) {
            $("#textLayer0").val(resultData[0].Layer0);
            $("#textLayer1").val(resultData[0].Layer1);
            $("#textLayer2").val(resultData[0].Layer2);
            $("#textLayer3").val(resultData[0].Layer3);
            $("#textName").val(resultData[0].Name);
            $("#textCreated").val(getLocaleDateTime(resultData[0].DataCreazione));
            $("#textRemoved").val(getLocaleDateTime(resultData[0].DataEliminazione));
            $("#textCantiereCreazione").val(resultData[0].CantiereCreazione);
            $("#textCantiereCreazioneInizio").val(getLocaleDate(resultData[0].DataInizio));
            $("#textCantiereCreazioneFine").val(getLocaleDate(resultData[0].DataFine));
            $("#textCantiereEliminazione").val(resultData[0].CantiereEliminazione);
            $("#textCantiereEliminazioneInizio").val(getLocaleDate(resultData[0].DataInizio2));
            $("#textCantiereEliminazioneFine").val(getLocaleDate(resultData[0].DataFine2));

            if (resultData[0].Categoria == null)
            {
                resultData[0].Categoria = 0;
            }
            $("#CategoryCombo").selectmenu('enable').val(resultData[0].Categoria).selectmenu('refresh');
            $(".salvaImmagineButton[href='CategoryCombo']").css('visibility', 'collapse');
            $("#CategoryCombo").off('change', ChangeSelectCategory).on('change', ChangeSelectCategory);
            SetCategoryVisibility(resultData[0].Categoria);

            SetSaveInfoButton(".infoOggettoPanelAux2");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });

    $.ajax({
        type: 'POST',
        url: 'php/getInfoVersionBase.php',
        data: {
            codice: codice
        },
        dataType: "json",
        success: function (resultData) {
            switch (resultData[0].Live) {
                case "0":
                    $("#textLive").val("Non attivo");
                    break;
                case "1":
                    $("#textLive").val("Live on-line");
                    break;
                case "2":
                    $("#textLive").val("Live on-line, ma morto (figli non pronti)");
                    break;
                case "3":
                    $("#textLive").val("Modello ancora da creare");
                    break;
                case "4":
                    $("#textLive").val("Inserito da Rhino, da attivare");
                    break;
                case "5":
                    $("#textLive").val("Live on-line e clonato");
                    break;
                case "6":
                    $("#textLive").val("Modello pronto, ma non ancora on-line");
                    break;
                case "7":
                    $("#textLive").val("Live on-line e clonato, ma morto (figli non pronti)");
                    break;
                case "8":
                    $("#textLive").val("Non attivo e clonato");
                    break;
                default:
                    $("#textLive").val(resultData[0].Live);
                    break;
            }
            $("#textCodice").val(resultData[0].CodiceOggetto);
            $("#textCodiceVersione").val(resultData[0].Codice);
            $("#textVersione").val(resultData[0].Versione);
            $("#textOriginale").val(resultData[0].Originale);
            $("#textCodiceModello").val(resultData[0].CodiceModello);
            $("#textLastUpdateBy").val(resultData[0].LastUpdateBy);
            $("#textLastUpdate").val(getLocaleDateTime(resultData[0].LastUpdate));
            $("#textLock").val(resultData[0].Lock);

            $.ajax({
                type: 'POST',
                url: 'php/getInfoModello.php',
                data: {
                    codice: resultData[0].CodiceModello
                },
                dataType: "json",
                success: function (resultData2) {
                    $("#textCodiceModello2").val(resultData2[0].Codice);

                    if (resultData2[0].Superficie == null || resultData2[0].Superficie == 0) {
                        $("#textSuperficie").val("Unknown");
                    }
                    else if (resultData2[0].Superficie < 0) {
                        $("#textSuperficie").val("Computed area untrusted!");
                    }
                    else {
                        $("#textSuperficie").val(parseFloat(resultData2[0].Superficie).toFixed(4) + " m\u00B2");
                    }

                    if (resultData2[0].Volume == null || resultData2[0].Volume == 0) {
                        $("#textVolume").val("Unknown");
                    }
                    else if (resultData2[0].Volume < 0) {
                        $("#textVolume").val("Computed area untrusted!");
                    }
                    else {
                        $("#textVolume").val(parseFloat(resultData2[0].Volume).toFixed(6) + " m\u00B3");
                    }

                    $("#textUpdateBy").val(resultData2[0].LastUpdateBy);
                    $("#textUpdateOn").val(getLocaleDateTime(resultData2[0].LastUpdate));

                    if (resultData2[0].xc == null) {
                        $("#textCenterX").val("Unknown");
                    }
                    else {
                        $("#textCenterX").val(parseFloat(resultData2[0].xc).toFixed(2) + " m");
                    }
                    if (resultData2[0].yc == null) {
                        $("#textCenterY").val("Unknown");
                    }
                    else {
                        $("#textCenterY").val(parseFloat(resultData2[0].yc).toFixed(2) + " m");
                    }
                    if (resultData2[0].zc == null) {
                        $("#textCenterZ").val("Unknown");
                    }
                    else {
                        $("#textCenterZ").val(parseFloat(resultData2[0].zc).toFixed(2) + " m");
                    }
                    if (resultData2[0].zc == null) {
                        $("#textDiagonal").val("Unknown");
                    }
                    else {
                        $("#textDiagonal").val((parseFloat(resultData2[0].Radius) * 2).toFixed(2) + " m");
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Si � verificato un errore.");
                }
            });

            SetSaveInfoButton(".infoVersionPanelAux2");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });

    $.ajax({
        type: 'POST',
        url: 'php/getInfoDynamic.php',
        data: {
            codice: codice
        },
        dataType: "json",
        success: function (resultData) {
            for (i in resultData) {
                var id = "#textDynamic_____" + resultData[i].CodiceCampo;
                var titleId = "#titleInfoOggettoPanelDynamic_" + resultData[i].CodiceTitolo;

                SetExpanderColor(titleId);
                SetDynamicBoxData(resultData[i], id);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });

    $.ajax({
        type: 'POST',
        url: 'php/getInfoVersionDynamic.php',
        data: {
            codice: codice
        },
        dataType: "json",
        success: function (resultData) {
            for (i in resultData) {
                var id = "#textVersionDynamic_____" + resultData[i].CodiceCampo;;
                var titleId = "#titleInfoVersionPanelDynamic_" + resultData[i].CodiceTitolo;

                SetExpanderColor(titleId);
                SetDynamicBoxData(resultData[i], id);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });

    $.ajax({
        type: 'POST',
        url: 'php/getInfoSubVersionDynamic.php',
        data: {
            codice: codice
        },
        dataType: "json",
        success: function (resultData) {
            for (i in resultData) {
                var id = "#textDynamicSubVersion" + resultData[i].SubVersion + "_____" + resultData[i].CodiceCampo;
                var titleId = "#titleInfoSubVersion" + resultData[i].SubVersion + "_PanelDynamic_" + resultData[i].CodiceTitolo;

                SetExpanderColor(titleId);
                SetDynamicBoxData(resultData[i], id);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });
}

function getLocaleDateTime(data) {
    return data != null ? new Date(Date.parse(data.replace(" ", "T").substring(0, data.length - 3))).toLocaleString() : "";
}

function getLocaleDate(data) {
    return data != null ? new Date(Date.parse(data.replace(" ", "T").substring(0, data.length - 3))).toLocaleDateString() : "";
}

// image panel functions
function UpdateImagePanel(codice) {
    $.ajax({
        type: 'POST',
        url: 'php/getElencoImmaginiSoloOggetto.php',
        data: {
            codice: "" + codice + ""
        },
        dataType: "json",
        success: function (resultData) {
            var index;
            var html = '';
            var html2 = '';

            $(".immaginiOggetto").remove();

            html += '<div style="position: relative">';
            html += '<label class="aggiungiImmagineLabel">Object Images</label>';
            html += '<a id="objectImage" title="Add an image to the object..." href="" class="aggiungiImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext <?php if(!isset($_SESSION[\'validUser\'])) {echo "hide";}?>">navigation</a>';
            html += '</div>';
            for (index = 0; index < resultData.length; ++index) {
                var popupId = "immagine" + index;
                html += '<div class="thumbContainer">';
                html += '<a href="#' + popupId + '" data-rel="popup" data-position-to="window" data-transition="fade"><img class="popphoto" id="' + popupId + 'min" data-riftype="oggetto" data-rifpz="' + codice + '" data-rifurl="' + encodeURIComponent(resultData[index].URL) + '" alt="Immagine" style="width:200px"></a>';
//                html += '<a href="#' + popupId + '" data-rel="popup" data-position-to="window" data-transition="fade"><img class="popphoto" src="php/getImmagineOggetto.php?codice=' + codice + '&url=' + encodeURIComponent(resultData[index].URL) + '&quality=min' + '" alt="Immagine" style="width:200px"></a>';
                html2 += '<div data-role="popup" id="' + popupId + '" class="immaginiOggetto" data-overlay-theme="b" data-theme="b" data-corners="false">';
                html2 += '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a><img class="popphoto" id="' + popupId + 'max" data-riftype="oggetto" data-rifpz="' + codice + '" data-rifurl="' + encodeURIComponent(resultData[index].URL) + '" style="max-height:512px;" alt="Immagine">';
                //html += '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a><img class="popphoto" src="" data-rifsrc="php/getImmagineOggetto.php?codice=' + riferimentoOggetto + '&url=' + encodeURIComponent(resultData[index].URL) + '&quality=max' + '" style="max-height:512px;" alt="Immagine">';
                html2 += '</div>';
                html += '<a title="Delete image..." data-riftype="oggetto" data-rifpz="' + codice + '" data-rifurl="' + encodeURIComponent(resultData[index].URL) + '" href="" class="rimuoviImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-minus ui-btn-icon-notext <?php if(!isset($_SESSION[\'validUser\'])) {echo "hide";}?>">navigation</a>';
                html += '<a title="Information ..." data-riftype="oggetto" data-rifpz="' + codice + '" data-rifurl="' + encodeURIComponent(resultData[index].URL) + '" href="" class="infoImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-info ui-btn-icon-notext <?php if(!isset($_SESSION[\'validUser\'])) {echo "hide";}?>">navigation</a>';
                html += '</div>'
            }
            $.ajax({
                type: 'POST',
                url: 'php/getElencoImmaginiSoloVersione.php',
                data: {
                    codice: "" + codice + ""
                },
                dataType: "json",
                success: function (resultData2) {
                    html += '<div style="position: relative">';
                    html += '<label class="aggiungiImmagineLabel">Version Images</label>';
                    html += '<a id="versionImage" title="Add an image to the version of the object..." href="" class="aggiungiImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext <?php if(!isset($_SESSION[\'validUser\'])) {echo "hide";}?>">navigation</a>';
                    html += '</div>';
                    for (index = 0; index < resultData2.length; ++index) {
                        var popupId = "immagineVersione" + index;
                        html += '<div class="thumbContainer">';
                        html += '<a href="#' + popupId + '" data-rel="popup" data-position-to="window" data-transition="fade"><img class="popphoto" id="' + popupId + 'min" data-riftype="versione" data-rifpz="' + codice + '" data-rifurl="' + encodeURIComponent(resultData2[index].URL) + '" alt="Immagine" style="width:200px"></a>';
                        //html += '<a href="#' + popupId + '" data-rel="popup" data-position-to="window" data-transition="fade"><img class="popphoto" src="php/getImmagineVersione.php?codice=' + codice + '&url=' + encodeURIComponent(resultData2[index].URL) + '&quality=min' + '" alt="Immagine" style="width:200px"></a>';
                        html2 += '<div data-role="popup" id="' + popupId + '" class="immaginiOggetto" data-overlay-theme="b" data-theme="b" data-corners="false">';
                        html2 += '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a><img class="popphoto" id="' + popupId + 'max" data-riftype="versione" data-rifpz="' + codice + '" data-rifurl="' + encodeURIComponent(resultData2[index].URL) + '" style="max-height:512px;" alt="Immagine">';
                        //html2 += '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-shadow ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right">Close</a><img class="popphoto" src="php/getImmagineVersione.php?codice=' + codice + '&url=' + encodeURIComponent(resultData2[index].URL) + '&quality=max' + '" style="max-height:512px;" alt="Immagine">';
                        html2 += '</div>';
                        html += '<a title="Delete image..." data-riftype="versione" data-rifpz="' + codice + '" data-rifurl="' + encodeURIComponent(resultData2[index].URL) + '" href="" class="rimuoviImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-minus ui-btn-icon-notext <?php if(!isset($_SESSION[\'validUser\'])) {echo "hide";}?>">navigation</a>';
                        html += '<a title="Information ..." data-riftype="versione" data-rifpz="' + codice + '" data-rifurl="' + encodeURIComponent(resultData2[index].URL) + '" href="" class="infoImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-info ui-btn-icon-notext <?php if(!isset($_SESSION[\'validUser\'])) {echo "hide";}?>">navigation</a>';
                        html += '</div>'
                    }

                    $.ajax({
                        type: 'POST',
                        url: 'php/getElencoOrtofoto.php',
                        data: {
                            codice: "" + codice + ""
                        },
                        dataType: "json",
                        success: function (resultData3) {
                            html += '<div style="position: relative">';
                            html += '<label class="aggiungiImmagineLabel">Ortho Images</label>';
                            html += '<a id="orthoImage" title="Add an ortho image to the selected objects..." href="" class="aggiungiImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext <?php if(!isset($_SESSION[\'validUser\'])) {echo "hide";}?>">navigation</a>';
                            for (index = 0; index < resultData3.length; ++index) {
                                html += '<div class="thumbContainer">';
                                html += '<a href="' + encodeURI("./ortofoto/viewOrtofoto.php?immagine=") + encodeURIComponent(resultData3[index]) + '" target="_blank"><img class="popphoto" src="' + encodeURI('./iipsrv/iipsrv.fcgi?FIF=/var/images/' + dbName + '/' + resultData3[index] + '&WID=256&CVT=jpeg') + '" alt="Immagine" style="width:200px"></a>';
                                html += '<a title="Save image..." href="' + encodeURI("./php/getOrtofoto.php?immagine=") + encodeURIComponent(resultData3[index]) + '" target="_blank" ' + 'class="salvaOrtofotoButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-arrow-d ui-btn-icon-notext <?php if(!isset($_SESSION[\'validUser\'])) {echo "hide";}?>">navigation</a>';
                                html += '<a title="Delete ortho image..." data-riftype="versione" data-rifpz="' + codice + '" data-rifurl="' + encodeURIComponent(resultData3[index]) + '" href="" class="rimuoviOrthoButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-minus ui-btn-icon-notext <?php if(!isset($_SESSION[\'validUser\'])) {echo "hide";}?>">navigation</a>';
                                html += '</div>';
                            }
                            html += '</div>';

                            $("#immaginiOggettoPanelAux2").html(html + html2);

                            function LoadCacheImage(id, quality, tipo) {
                                var img = $("#" + id + quality);
                                var MyImageCacheManager = new ImageCacheManager();
                                MyImageCacheManager.fileReceived = function (data) {
                                    img.attr('src', "data:Content-Type: image/jpeg;base64," + data.innerData);
                                };
                                MyImageCacheManager.getFile(img.data("rifpz"), img.data("rifurl"), quality, tipo);
                            }

                            for (index = 0; index < resultData.length; ++index) {
                                var popupId = "immagine" + index;
                                LoadCacheImage(popupId, "min", 0);
                            }
                            for (index = 0; index < resultData2.length; ++index) {
                                var popupId = "immagineVersione" + index;
                                LoadCacheImage(popupId, "min", 1);
                            }
                            for (index = 0; index < resultData.length; ++index) {
                                var popupId = "immagine" + index;
                                LoadCacheImage(popupId, "max", 0);
                            }
                            for (index = 0; index < resultData2.length; ++index) {
                                var popupId = "immagineVersione" + index;
                                LoadCacheImage(popupId, "max", 1);
                            }

                            $(".immaginiOggetto").popup().trigger("create");

                            SetImagesEvents();
                        },
                     error: function (jqXHR, textStatus, errorThrown) {
                     alert("Si � verificato un errore.");
                     }
                     });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Si � verificato un errore.");
                }
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });

}

function SetImagesEvents() {
    $(".immaginiOggetto").on({
        popupbeforeposition: function () {
            var maxHeight = $(window).height() - 60 + "px";
            $(".immaginiOggetto img").css("max-height", maxHeight);
        }
    });

    $("#objectImage").unbind().bind("click", function (event) {
        event.preventDefault();
        mittenteUpload = 1;
        if (_selectedWriteMode) {
            $("#aggiungiImmaginePopup").popup("open");
        }
        else {
            alert("The object must be imported in write mode!");
        }
    });
    $("#versionImage").unbind().bind("click", function (event) {
        event.preventDefault();
        mittenteUpload = 2;
        if (_selectedWriteMode) {
            $("#aggiungiImmaginePopup").popup("open");
        }
        else {
            alert("The object must be imported in write mode!");
        }
    });

    $("#orthoImage").unbind().bind("click", function (event) {
        event.preventDefault();
        mittenteUpload = 3;
        if (_selectedWriteMode) {
            $("#aggiungiOrthoPopup").popup("open");
        }
        else {
            alert("The object must be imported in write mode!");
        }
    });

    $(".rimuoviImmagineButton").unbind().bind("click", function (event) {
        event.preventDefault();

        RemoveImage($(this));
    });

    $(".rimuoviOrthoButton").unbind().bind("click", function (event) {
        event.preventDefault();
        if (_selectedWriteMode) {
            RemoveOrtho($(this));
        }
        else {
            alert("The object must be imported in write mode!");
        }
    });

    $(".infoImmagineButton").unbind().bind("click", function (event) {
        event.preventDefault();

        ShowInfoImage($(this));
    });

    $("#textImmagineDescrizione").unbind('change').bind('change', function () {
        $(".salvaImmagineButton[href='textImmagineDescrizione']").css('visibility', 'visible');
    });
    $(".salvaImmagineButton[href='textImmagineDescrizione']").unbind('click').bind('click', function (e) {
        e.preventDefault();
        var elem = $("#" + this.pathname.substr(1));
        var btn = $(this);

        SaveInfoImage(btn, elem);
    });
}

function RemoveOrthoImage(codice, url) {
    $.ajax({
        type: 'POST',
        url: 'php/removeOrthoOggetto.php',
        data: {
            codiceOggetto: codice,
            URL: decodeURIComponent(url)
        },
        dataType: "text",
        success: function (resultData) {
            UpdateImagePanel(codice);
            alert("Immagine rimossa.");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });
}

function RemoveObjectImage(codice, url) {
    $.ajax({
        type: 'POST',
        url: 'php/removeImageOggetto.php',
        data: {
            codiceOggetto: codice,
            URL: decodeURIComponent(url)
        },
        dataType: "text",
        success: function (resultData) {
            UpdateImagePanel(codice);
            alert("Immagine rimossa.");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });
}

function RemoveVersionImage(codice, url) {
    $.ajax({
        type: 'POST',
        url: 'php/removeImageVersione.php',
        data: {
            codiceVersione: codice,
            URL: "" + decodeURIComponent(url)
        },
        dataType: "text",
        success: function (resultData) {
            UpdateImagePanel(codice);
            alert("Immagine rimossa.");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });
}

function RemoveImage(image) {
    if (_selectedWriteMode) {
        if (confirm('Eliminare la fotografia selezionata?')) {
            if (decodeURIComponent(image.data("riftype")) == "oggetto") {
                RemoveObjectImage(image.data("rifpz"), image.data("rifurl"));
            }
            else if (decodeURIComponent(image.data("riftype")) == "versione") {
                RemoveVersionImage(image.data("rifpz"), image.data("rifurl"));
            }
            else {
                alert("Si � verificato un errore.")
            }
        }
    }
    else {
        alert("The object must be imported in write mode!");
    }
}

function RemoveOrtho(image) {
    if (_selectedWriteMode) {
        if (confirm('Eliminare l\'ortofoto selezionata?')) {
            RemoveOrthoImage(image.data("rifpz"), image.data("rifurl"));
        }
    }
    else {
        alert("The object must be imported in write mode!");
    }
}

function UpdateInfoImage(box, data) {
    $("#immaginiInfoPopup").popup("open");
    $("#textImmagineName").val("");
    $("#textImmagineDataScatto").val("");
    $("#textImmagineDescrizione").val("");
    $("#textImmagineName").val(decodeURIComponent(box.data("rifurl")));
    $("#textImmagineDataScatto").val(getLocaleDate(data[0].DataScatto));
    $("#textImmagineDescrizione").val(data[0].Descrizione);
    $(".salvaImmagineButton[href='textImmagineDescrizione']").data("rifurl", box.data("rifurl"));
    $(".salvaImmagineButton[href='textImmagineDescrizione']").data("rifpz", box.data("rifpz"));
    $(".salvaImmagineButton[href='textImmagineDescrizione']").data("riftype", box.data("riftype"));
    $(".salvaImmagineButton[href='textImmagineDescrizione']").css('visibility', 'collapse');
}

function ShowInfoImage(box) {
    if (decodeURIComponent(box.data("riftype")) == "oggetto") {
        $.ajax({
            type: 'POST',
            url: 'php/getInfoImmagineOggetto.php',
            data: {
                codiceOggetto: box.data("rifpz"),
                URL: decodeURIComponent(box.data("rifurl"))
            },
            dataType: "json",
            success: function (resultData) {
                UpdateInfoImage(box, resultData);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si � verificato un errore.");
            }
        });
    }
    else if (decodeURIComponent(box.data("riftype")) == "versione") {
        $.ajax({
            type: 'POST',
            url: 'php/getInfoImmagineVersione.php',
            data: {
                codiceVersione: box.data("rifpz"),
                URL: decodeURIComponent(box.data("rifurl"))
            },
            dataType: "json",
            success: function (resultData) {
                UpdateInfoImage(box, resultData);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si � verificato un errore.");
            }
        });
    }
}

function SaveInfoImage(btn, elem) {
    if (_selectedWriteMode) {
        if (decodeURIComponent(btn.data("riftype")) == "oggetto") {
            $.ajax({
                url: "./php/setInfoImmagineDescrizione.php",
                dataType: "json",
                crossDomain: false,
                data: {
                    codiceOggetto: btn.data("rifpz"),
                    URL: btn.data("rifurl"),
                    descrizione: elem.val()
                },
                success: function (resultData) {
                    btn.removeClass("ui-btn-active");
                    btn.css('visibility', 'collapse');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Si � verificato un errore.");
                }
            });
        }
        else if (decodeURIComponent(btn.data("riftype")) == "versione") {
            $.ajax({
                url: "./php/setInfoImmagineVersioneDescrizione.php",
                dataType: "json",
                crossDomain: false,
                data: {
                    codiceVersione: btn.data("rifpz"),
                    URL: btn.data("rifurl"),
                    descrizione: elem.val()
                },
                success: function (resultData) {
                    btn.removeClass("ui-btn-active");
                    btn.css('visibility', 'collapse');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Si � verificato un errore.");
                }
            });
        }
    }
    else {
        alert("The object must be imported in write mode!");
    }
}

// file panel functions

function UpdateFilePanel(codice) {
    $.ajax({
        type: 'POST',
        url: 'php/getElencoFileSoloOggetto.php',
        data: {
            codice: "" + codice + ""
        },
        dataType: "json",
        success: function (resultData) {
            var index;
            var html = '';
            var html2 = '';

            $(".fileOggetto").remove();

            html += '<div style="position: relative">';
            html += '<label class="aggiungiFileLabel">Object Files</label>';
            html += '<a id="objectFile" title="Add a file to the object..." href="" class="aggiungiFileButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext <?php if(!isset($_SESSION[\'validUser\'])) {echo "hide";}?>">navigation</a>';
            html += '</div>';
            for (index = 0; index < resultData.length; ++index) {
                html += '<div class="fileLinkContainer">';
                html += '<a class="fileLink" target="_blank" href="./php/getFileOggetto.php?codice=' + codice + '&url=' + encodeURIComponent(resultData[index].URL) + '" data-riftype="oggetto" data-rifpz="' + codice + '" data-rifurl="' + encodeURIComponent(resultData[index].URL) + '">' + resultData[index].URL + '</a>';
                html += '<a title="Delete file..." data-riftype="oggetto" data-rifpz="' + codice + '" data-rifurl="' + encodeURIComponent(resultData[index].URL) + '" href="" class="rimuoviFileButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-minus ui-btn-icon-notext">navigation</a>';
                html += '</div>'
            }
            $.ajax({
                type: 'POST',
                url: 'php/getElencoFileSoloVersione.php',
                data: {
                    codice: "" + codice + ""
                },
                dataType: "json",
                success: function (resultData2) {
                    html += '<div style="position: relative">';
                    html += '<label class="aggiungiFileLabel">Version Files</label>';
                    html += '<a id="versionFile" title="Add a file to the version of the object..." href="" class="aggiungiFileButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext <?php if(!isset($_SESSION[\'validUser\'])) {echo "hide";}?>">navigation</a>';
                    html += '</div>';
                    for (index = 0; index < resultData2.length; ++index) {
                        html += '<div class="fileLinkContainer">';
                        html += '<a class="fileLink" target="_blank" href="./php/getFileVersion.php?codice=' + codice + '&url=' + encodeURIComponent(resultData2[index].URL) + '" data-riftype="versione" data-rifpz="' + codice + '" data-rifurl="' + encodeURIComponent(resultData2[index].URL) + '"">' + resultData2[index].URL + '</a>';
                        html += '<a title="Delete file..." data-riftype="versione" data-rifpz="' + codice + '" data-rifurl="' + encodeURIComponent(resultData2[index].URL) + '" href="" class="rimuoviFileButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-minus ui-btn-icon-notext">navigation</a>';
                        html += '</div>'
                    }

                    $("#fileOggettoPanelAux2").html(html + html2);

                    SetFilesEvents();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Si � verificato un errore.");
                }
            });

        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });

}

function SetFilesEvents() {
    function RemoveFile(file) {
        function RemoveObjectFile(codice, url) {
            $.ajax({
                type: 'POST',
                url: 'php/removeFileOggetto.php',
                data: {
                    codiceOggetto: codice,
                    URL: decodeURIComponent(url)
                },
                dataType: "text",
                success: function (resultData) {
                    UpdateFilePanel(codice);
                    alert("File rimosso.");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Si è verificato un errore.");
                }
            });
        }

        function RemoveVersionFile(codice, url) {
            $.ajax({
                type: 'POST',
                url: 'php/removeFileVersione.php',
                data: {
                    codiceVersione: codice,
                    URL: "" + decodeURIComponent(url)
                },
                dataType: "text",
                success: function (resultData) {
                    UpdateFilePanel(codice);
                    alert("File rimosso.");
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Si è verificato un errore.");
                }
            });
        }

        if (_selectedWriteMode) {
            if (confirm('Eliminare il file selezionato?')) {
                if (decodeURIComponent(file.data("riftype")) == "oggetto") {
                    RemoveObjectFile(file.data("rifpz"), file.data("rifurl"));
                }
                else if (decodeURIComponent(file.data("riftype")) == "versione") {
                    RemoveVersionFile(file.data("rifpz"), file.data("rifurl"));
                }
                else {
                    alert("Si � verificato un errore.")
                }
            }
        }
        else {
            alert("The object must be imported in write mode!");
        }
    }

    $("#objectFile").unbind().bind("click", function (event) {
        event.preventDefault();
        mittenteUpload = 11;
        if (_selectedWriteMode) {
            $("#aggiungiFilePopup").popup("open");
        }
        else {
            alert("The object must be imported in write mode!");
        }
    });
    $("#versionFile").unbind().bind("click", function (event) {
        event.preventDefault();
        mittenteUpload = 12;
        if (_selectedWriteMode) {
            $("#aggiungiFilePopup").popup("open");
        }
        else {
            alert("The object must be imported in write mode!");
        }
    });

    $(".rimuoviFileButton").unbind().bind("click", function (event) {
        event.preventDefault();

        RemoveFile($(this));
    });
}

//function after successful file upload (when server response)
function afterSuccessFile() {
    $('#submitFile-btn').show(); //hide submit button
    $('#loadingFile-img').hide(); //hide submit button
    $('#progressboxFile').delay(1000).fadeOut(); //hide progress bar

    UpdateFilePanel($('#textCodice').val());
}

//function to check file size before uploading.
function beforeSubmitFile() {
    //check whether browser fully supports all File API
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        if (!$('#FileInputFile').val()) //check empty input filed
        {
            $("#outputFile").html("Are you kidding me?");
            return false
        }

        var fsize = $('#FileInputFile')[0].files[0].size; //get file size
        var ftype = $('#FileInputFile')[0].files[0].type; // get file type


        //allow file types
/*        switch (ftype) {
            case 'image/png':
            case 'image/gif':
            case 'image/jpeg':
            case 'image/pjpeg':
                //case 'text/plain':
                //case 'text/html':
                //case 'application/x-zip-compressed':
                //case 'application/pdf':
                //case 'application/msword':
                //case 'application/vnd.ms-excel':
                //case 'video/mp4':
                break;
            default:
                $("#output").html("<b>" + ftype + "</b> Unsupported file type!");
                return false
        }*/

        //Allowed file size is less than 5 MB (1048576)
        if (fsize > 33554432) {
            $("#output").html("<b>" + bytesToSize(fsize) + "</b> Too big file! <br />File is too big, it should be less than 12 MB.");
            return false
        }

        $('#submitFile-btn').hide(); //hide submit button
        $('#loadingFile-img').show(); //hide submit button
        $("#outputFile").html("");
    }
    else {
        //Output error to older unsupported browsers that doesn't support HTML5 File API
        $("#outputFile").html("Please upgrade your browser, because your current browser lacks some new features we need!");
        return false;
    }
}

//progress bar function
function OnProgressFile(event, position, total, percentComplete) {
    //Progress bar
    $('#progressboxFile').show();
    $('#progressbarFile').width(percentComplete + '%'); //update progressbar percent complete
    $('#statustxtFile').html(percentComplete + '%'); //update status text
    if (percentComplete > 50) {
        $('#statustxtFile').css('color', '#000'); //change status text to white after 50%
    }
}


// reset functions
function resettaListaImportazione() {
    var azzeraListaImportazione = $.ajax({
        type: 'POST',
        url: 'php/resettaListaImportazione.php',
        dataType: "text",
        success: function (resultData) {
            alert("Lista correttamente cancellata");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });
}

function resettaVista() {
    var blocchi = _myScene.findNode("block");
    for (var i = blocchi.nodes.length - 1; i > -1; i--) {
        blocchi.nodes[i].destroy();
    }
    blocchi = _myScene.findNode("MultiTexture");
    for (var i = blocchi.nodes.length - 1; i > -1; i--) {
        blocchi.nodes[i].destroy();
    }
    var pointCloud = _myScene.findNode("PointCloud");
    for (var i = pointCloud.nodes.length - 1; i > -1; i--) {
        pointCloud.nodes[i].destroy();
    }
    var hotSpots = _myScene.findNode("HotSpot");
    for (var i = hotSpots.nodes.length - 1; i > -1; i--) {
        hotSpots.nodes[i].destroy();
    }
}

// information management
function UpdateCategory() {
    function UpdateHotSpotColor(codice, categoria) {
        var obj = _myScene.findNode("p" + codice);
        if (categoria != 0)
        {
            $.ajax({
                type: 'POST',
                url: "./php/getCategoryColor.php",
                dataType: "json",
                crossDomain: false,
                data: {
                    category: categoria,
                },
                success: function (resultData) {
                    obj.node(0).node(0).node(0).setParams({colorImported: [resultData[0].ColorR, resultData[0].ColorG, resultData[0].ColorB]});
                    obj.parent.setAlpha(resultData[0].ColorA);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Si � verificato un errore.");
                }
            });
        }
        else
        {
            $.ajax({
                type: 'POST',
                url: "./php/getHotspotColor.php",
                dataType: "json",
                crossDomain: false,
                data: {
                    codice: codice,
                },
                success: function (resultData) {
                    obj.node(0).node(0).node(0).setParams({colorImported: [resultData[0].ColorR, resultData[0].ColorG, resultData[0].ColorB]});
                    obj.parent.setAlpha(resultData[0].ColorA);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Si � verificato un errore.");
                }
            });
        }
    }

    $.ajax({
        type: 'POST',
        url: 'php/getCategoryList.php',
        data: {
        },
        dataType: "json",
        success: function (resultData2) {
            var combo = "<option value='0'>-</option>";
            for (i in resultData2) {
                combo += " <option value=\"" + resultData2[i].Codice + "\">" + resultData2[i].Nome + "</option>";
            }
            $("#CategoryCombo").html(combo);
            $("#CategoryCombo").val(0).selectmenu('refresh');
            $("#HotSpotCategoryCombo").html(combo);
            $("#HotSpotCategoryCombo").val(0).selectmenu('refresh');
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });

    $(".salvaImmagineButton[href='CategoryCombo']").unbind('click').bind('click', function (e) {
        e.preventDefault();
        var elem = $("#CategoryCombo");
        var valore = elem.val();
        var codice = $('#textCodice').val();
        var btn = $(this);

        if (_selectedWriteMode) {
            $.ajax({
                    url: "./php/setCategory.php",
                    dataType: "json",
                    crossDomain: false,
                    data: {
                        codiceOggetto: codice,
                        valore: valore
                    },
                    success: function (resultData) {
                        btn.removeClass("ui-btn-active");
                        btn.css('visibility', 'collapse');
                        UpdateInfoPanel(codice);
                        UpdateHotSpotColor(codice, valore);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Si � verificato un errore.");
                    }
                })
        }
        else {
            alert("You can't modify category: selected item is imported read-only!");
        }
    });
}

function ResetCategoryVisibility() {
    var childs = $(".infoOggettoPanelAux2").children();
    childs.splice(0, 1);
    childs.each(function () {
        $(this).removeClass("VisibleUI").addClass("HiddenUI").collapsible( "collapse" );
    });

    childs = $(".infoVersionPanelAux2").children();
    childs.splice(0, 2);
    childs.each(function () {
        $(this).removeClass("VisibleUI").addClass("HiddenUI").collapsible( "collapse" );
    });

    childs = $(".infoSubVersionPanelAux2").children();
    childs.splice(0, 1);
    childs.each(function () {
        $(this).removeClass("VisibleUI").addClass("HiddenUI").collapsible( "collapse" );
    });
    for (i = 0; i < maxSubVersion; i++) {
        $(".infoSubVersion" + i).children().each(function () {
            $(this).removeClass("VisibleUI").addClass("HiddenUI").collapsible( "collapse" );
        });
        $(".infoInterventoSubVersion" + i).parent().parent().removeClass("VisibleUI").addClass("HiddenUI").collapsible( "collapse" );
    }
}

function CreateSchede() {
    var childs = $(".infoOggettoPanelAux2").children();
    childs.splice(0, 1);
    childs.find("select").each(function (i, elem) {
        $(this).selectmenu( "destroy" );
    });
    childs.each(function () {
        this.remove();
    });
    $.ajax({
        type: 'POST',
        url: 'php/getListaSchede.php',
        data: {},
        dataType: "json",
        success: function (resultData) {
            for (i in resultData) {
                $(".infoOggettoPanelAux2").append("<div data-role=\"collapsible\" data-inset=\"false\" class=\"HiddenUI\"><h5 class=\"infoTitleExpander ui-page-theme-a\" id=\"titleInfoOggettoPanelDynamic_" + resultData[i].Codice+ "\">" + resultData[i].Titolo + "</h5><div class=\"infoOggettoPanelDynamic_" + resultData[i].Codice + "\"></div></div>");
                CreateSchedeContent(resultData[i].Codice);
            }
            ///////////////////////////////
            $(".infoOggettoPanelAux2").trigger("create");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });

    childs = $(".infoVersionPanelAux2").children();
    childs.splice(0, 2);
    childs.find("select").each(function (i, elem) {
        $(this).selectmenu( "destroy" );
    });
    childs.each(function () {
        this.remove();
    });
    $.ajax({
        type: 'POST',
        url: 'php/getListaSchedeVersion.php',
        data: {},
        dataType: "json",
        success: function (resultData) {
            for (i in resultData) {
                $(".infoVersionPanelAux2").append("<div data-role=\"collapsible\" data-inset=\"false\" class=\"HiddenUI\"><h5 class=\"infoTitleExpander ui-page-theme-a\" id=\"titleInfoVersionPanelDynamic_" + resultData[i].Codice + "\">" + resultData[i].Titolo + "</h5><div class=\"infoOggettoVersionPanelDynamic_" + resultData[i].Codice + "\"></div></div>");
                CreateSchedeVersionContent(resultData[i].Codice);
            }

            $(".infoVersionPanelAux2").trigger("create");
            ///////////////////////////////
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });

    childs = $(".infoSubVersionPanelAux2").children();
    childs.find("select").each(function (i, elem) {
        $(this).selectmenu( "destroy" );
    });
    childs.each(function () {
        this.remove();
    });
    $.ajax({
        type: 'POST',
        url: 'php/getMaxSubVersion.php',
        data: {},
        dataType: "json",
        success: function (resultData) {
            maxSubVersion = parseInt(resultData[0].MaxSubVersion) + 3;
            for (i = 0; i < maxSubVersion; i++) {
                $(".infoSubVersionPanelAux2").append("<div data-role=\"collapsible\" data-inset=\"false\" class=\"HiddenUI\"><h5 class=\"infoTitleExpander ui-page-theme-a\" id=\"titleSubVersion" + i + "\">SubVersion " + i + "</h5><div class=\"subVersion" + i + "\"></div></div>");
                var exp = $(".subVersion" + i);
                exp.append("<div data-role=\"collapsible\" data-inset=\"false\"><h5 class=\"infoTitleExpander ui-page-theme-a\" id=\"titleInfoSubVersion" + i + "\">SubVersion Information " + i + "</h5><div class=\"infoSubVersion" + i + "\"></div></div>");
                CreateSchedeSubVersion(i);
                if (i < maxSubVersion - 1)
                {
                    exp.append("<div data-role=\"collapsible\" data-inset=\"false\" class=\"HiddenUI\"><h5 class=\"infoTitleExpander ui-page-theme-a\" id=\"titleInfoInterventoSubVersion" + i + "\">Manteinance Information " + i + "</h5><div class=\"infoInterventoSubVersion" + i + "\"></div></div>");
                    CreateSchedeContentInterventoSubVersion(i);
                }
                //exp.trigger("create");
            }
            $(".infoSubVersionPanelAux2").trigger("create");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });
}

function CreateSchedeContent(codiceScheda) {
    function FillComboValue(codiceCampo) {
        var id2 = "textDynamic_____" + codiceCampo;
        $.ajax({
            type: 'POST',
            url: 'php/getInfoComboValue.php',
            data: {
                CodiceCampo: codiceCampo
            },
            dataType: "json",
            success: function (resultData2) {
                var combo = "<option value='0'>-</option>";
                for (i in resultData2) {
                    combo += " <option value=\"" + resultData2[i].Codice + "\">" + resultData2[i].Value + "</option>";
                }
                $("#" + id2).html(combo).selectmenu('refresh');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si � verificato un errore.");
            }
        });
    }

    var id = ".infoOggettoPanelDynamic_" + codiceScheda;

    $.ajax({
        type: 'POST',
        url: 'php/getListaInformazioni.php',
        data: {
            CodiceTitolo: codiceScheda
        },
        dataType: "json",
        success: function (resultData) {
            for (i in resultData) {
                var campo = resultData[i].Campo;
                var codiceCampo = resultData[i].Codice;
                var id2 = "textDynamic_____" + resultData[i].Codice;

                if (resultData[i].IsTitle == "t") {
                    $(id).append("<h5 class=\"infoTitle\">" + campo + "</h5>");
                }
                else if (resultData[i].IsSeparator == "t") {
                    $(id).append("<hr>");
                }
                else {
                    var height = 33 * resultData[i].Height / 22;

                    $(id).append("<a title=\"Salva\" href=\"" + id2 + "\" class=\"salvaImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-check ui-btn-icon-notext hide\">navigation</a>");
                    if (resultData[i].IsCombo == "t") {
                    }
                    $(id).append("<label for=\"" + id2 + "\" class=\"infoLabel\">" + campo + "</label>");
                    if (resultData[i].IsBool == "t") {
                        $(id).append("<input type=\"checkbox\" class=\"infoInputText\" data-tipo=\"checkbox\" data-codice=\"" + codiceCampo + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" value=\"\">");
                    }
                    else if (resultData[i].IsLink == "t") {
                        $(id).append("<input type=\"checkbox\" class=\"infoInputText\" data-tipo=\"link\" data-codice=\"" + codiceCampo + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" value=\"\">");
                    }
                    else if (resultData[i].IsTimestamp == "t") {
                        $(id).append("<input type=\"text\" class=\"infoInputText\" data-tipo=\"timestamp\" data-codice=\"" + codiceCampo + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" data-clear-btn=\"true\" value=\"\">");
                        $("#" + id2).datetimepicker();
                    }
                    else if (resultData[i].IsInt == "t") {
                        $(id).append("<input type=\"number\" class=\"infoInputText infoInputNumber\" data-tipo=\"int\" data-codice=\"" + codiceCampo + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" data-clear-btn=\"true\" value=\"\">");
                    }
                    else if (resultData[i].IsReal == "t") {
                        $(id).append("<input type=\"number\" step=\"0.000001\" class=\"infoInputText infoInputNumber\" data-tipo=\"real\" data-codice=\"" + codiceCampo + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" data-clear-btn=\"true\" value=\"\">");
                    }
                    else if (resultData[i].IsCombo == "t") {
                        $(id).append("<a title=\"Aggiungi valore\" href=\"" + id2 + "\" class=\"addValueImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext\">navigation</a>");
                        $(id).append("<select data-native-menu=\"false\" class=\"infoInputText\" disabled=\"disabled\" data-tipo=\"combo\" data-codice=\"" + codiceCampo + "\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\">");
                        $(id).append("</select>");
                        FillComboValue(codiceCampo);
                    }
                    else if (resultData[i].IsMultiCombo == "t") {
                        $(id).append("<a title=\"Aggiungi valore\" href=\"" + id2 + "\" class=\"addValueImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext\">navigation</a>");
                        $(id).append("<select data-native-menu=\"false\" class=\"infoInputText\" multiple=\"multiple\" disabled=\"disabled\" data-tipo=\"multicombo\" data-codice=\"" + codiceCampo + "\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\">");
                        $(id).append("</select>");
                        FillComboValue(codiceCampo);
                    }
                    else {
                        if (height > 33) {
                            $(id).append("<textarea class=\"infoInputText\" data-tipo=\"text\" data-codice=\"" + codiceCampo + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" data-clear-btn=\"true\" value=\"\"></textarea>");
                        }
                        else {
                            $(id).append("<input type=\"text\" class=\"infoInputText\" data-tipo=\"text\" data-codice=\"" + codiceCampo + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" data-clear-btn=\"true\" value=\"\">");
                        }
                    }

                    $(".addValueImmagineButton[href='" + id2 + "']").unbind('click').bind('click', function (e) {
                        e.preventDefault();
                        if (_selectedWriteMode) {
                            var elem = $("#" + this.pathname.substr(1));
                            tempCodiceCampo = elem[0].dataset.codice;
                            $("#textAddInfoComboValue").val("");

                            $("#addComboValueBtn").unbind('click').bind('click', function () {
                                $.ajax({
                                    type: 'POST',
                                    url: 'php/addInfoComboValue.php',
                                    data: {
                                        CodiceCampo: tempCodiceCampo,
                                        Valore: $('#textAddInfoComboValue').val()
                                    },
                                    dataType: "json",
                                    success: function (resultData) {
                                        $("#addComboValuePopup").popup( "close" );
                                        var id = "#textDynamic_____" + tempCodiceCampo;
                                        var tempValue = $(id).val();
                                        FillComboValue(tempCodiceCampo);
                                        $(id).selectmenu( "refresh" );
                                        setTimeout(function () {
                                            $(id).val(tempValue).selectmenu('refresh');
                                        }, 100);
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                });
                            });

                            $("#addComboValuePopup").popup("open");
                        }
                        else {
                            alert("You can't modify informations: selected item is imported read-only!");
                        }
                    });

                    $(".salvaImmagineButton[href='" + id2 + "']").unbind('click').bind('click', function (e) {
                        e.preventDefault();
                        var elem = $("#" + this.pathname.substr(1));
                        var btn = $(this);

                        if (_selectedWriteMode) {
                            if (elem[0].dataset.tipo == "text") {
                                $.ajax({
                                    url: "./php/setInfoOggettoText.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodice').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        valore: elem.val().replace(/'/g, "''")
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "real") {
                                $.ajax({
                                    url: "./php/setInfoOggettoReal.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodice').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        valore: elem.val()
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "int") {
                                $.ajax({
                                    url: "./php/setInfoOggettoInt.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodice').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        valore: elem.val()
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "timestamp") {
                                $.ajax({
                                    url: "./php/setInfoOggettoTimestamp.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodice').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        valore: elem.val()
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "combo") {
                                $.ajax({
                                    url: "./php/setInfoOggettoCombo.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodice').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        valore: elem.val() == 0 ? null : elem.val()
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "multicombo") {
                                $.ajax({
                                    url: "./php/setInfoOggettoMultiCombo.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodice').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        valore: elem.val() == 0 ? null : elem.val().join('_')
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "checkbox" || elem[0].dataset.tipo == "link") {
                                $.ajax({
                                    url: "./php/setInfoOggettoCheckbox.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodice').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        valore: elem.prop("checked")
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                        }
                        else {
                            alert("You can't modify informations: selected item is imported read-only!");
                        }
                    });
                }
            }

            $(id).trigger("create");
            $(id).find("input").each(function (i, elem) {
                if ($(this).hasClass("infoInputNumber")) {
                    var btn = $(this).parent().children()[1];
                    $(btn).css('margin-right', '22px');
                }
            });

            ///////////////////////////////
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });
}

function CreateSchedeVersionContent(codiceScheda) {
    function FillComboValue(codiceCampo) {
        var id2 = "textVersionDynamic_____" + codiceCampo;
        $.ajax({
            type: 'POST',
            url: 'php/getInfoVersionComboValue.php',
            data: {
                CodiceCampo: codiceCampo
            },
            dataType: "json",
            success: function (resultData2) {
                var combo = "<option value='0'>-</option>";
                for (i in resultData2) {
                    combo += " <option value=\"" + resultData2[i].Codice + "\">" + resultData2[i].Value + "</option>";
                }
                $("#" + id2).html(combo).selectmenu('refresh');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si � verificato un errore.");
            }
        });
    }

    var id = ".infoOggettoVersionPanelDynamic_" + codiceScheda;

    $.ajax({
        type: 'POST',
        url: 'php/getListaVersionInformazioni.php',
        data: {
            CodiceTitolo: codiceScheda
        },
        dataType: "json",
        success: function (resultData) {
            for (i in resultData) {
                var campo = resultData[i].Campo;
                var codiceCampo = resultData[i].Codice;
                var id2 = "textVersionDynamic_____" + resultData[i].Codice;

                if (resultData[i].IsTitle == "t") {
                    $(id).append("<h5 class=\"infoTitle\">" + campo + "</h5>");
                }
                else if (resultData[i].IsSeparator == "t") {
                    $(id).append("<hr>");
                }
                else {
                    var height = 33 * resultData[i].Height / 22;

                    $(id).append("<a title=\"Salva\" href=\"" + id2 + "\" class=\"salvaImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-check ui-btn-icon-notext hide\">navigation</a>");
                    $(id).append("<label for=\"" + id2 + "\" class=\"infoLabel\">" + campo + "</label>");
                    if (resultData[i].IsBool == "t") {
                        $(id).append("<input type=\"checkbox\" class=\"infoInputText\" data-tipo=\"checkbox\" data-codice=\"" + codiceCampo + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" value=\"\">");
                    }
                    else if (resultData[i].IsLink == "t") {
                        $(id).append("<input type=\"checkbox\" class=\"infoInputText\" data-tipo=\"link\" data-codice=\"" + codiceCampo + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" value=\"\">");
                    }
                    else if (resultData[i].IsTimestamp == "t") {
                        $(id).append("<input type=\"text\" class=\"infoInputText\" data-tipo=\"timestamp\" data-codice=\"" + codiceCampo + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" data-clear-btn=\"true\" value=\"\">");
                        $("#" + id2).datetimepicker();
                    }
                    else if (resultData[i].IsInt == "t") {
                        $(id).append("<input type=\"number\" class=\"infoInputText infoInputNumber\" data-tipo=\"int\" data-codice=\"" + codiceCampo + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" data-clear-btn=\"true\" value=\"\">");
                    }
                    else if (resultData[i].IsReal == "t") {
                        $(id).append("<input type=\"number\" step=\"0.000001\" class=\"infoInputText infoInputNumber\" data-tipo=\"real\" data-codice=\"" + codiceCampo + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" data-clear-btn=\"true\" value=\"\">");
                    }
                    else if (resultData[i].IsCombo == "t") {
                        $(id).append("<a title=\"Aggiungi valore\" href=\"" + id2 + "\" class=\"addValueImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext\">navigation</a>");
                        $(id).append("<select data-native-menu=\"false\" class=\"infoInputText\" disabled=\"disabled\" data-tipo=\"combo\" data-codice=\"" + codiceCampo + "\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\">");
                        $(id).append("</select>");
                        FillComboValue(codiceCampo);
                    }
                    else if (resultData[i].IsMultiCombo == "t") {
                        $(id).append("<a title=\"Aggiungi valore\" href=\"" + id2 + "\" class=\"addValueImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext\">navigation</a>");
                        $(id).append("<select data-native-menu=\"false\" class=\"infoInputText\" multiple=\"multiple\" disabled=\"disabled\" data-tipo=\"combo\" data-codice=\"" + codiceCampo + "\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\">");
                        $(id).append("</select>");
                        FillComboValue(codiceCampo);
                    }
                    else {
                        if (height > 33) {
                            $(id).append("<textarea class=\"infoInputText\" data-tipo=\"text\" data-codice=\"" + codiceCampo + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" data-clear-btn=\"true\" value=\"\"></textarea>");
                        }
                        else {
                            $(id).append("<input type=\"text\" class=\"infoInputText\" data-tipo=\"text\" data-codice=\"" + codiceCampo + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" data-clear-btn=\"true\" value=\"\">");
                        }
                    }

                    $(".addValueImmagineButton[href='" + id2 + "']").unbind('click').bind('click', function (e) {
                        e.preventDefault();
                        if (_selectedWriteMode) {
                            var elem = $("#" + this.pathname.substr(1));
                            tempCodiceCampo = elem[0].dataset.codice;
                            $("#textAddInfoComboValue").val("");

                            $("#addComboValueBtn").unbind('click').bind('click', function () {
                                $.ajax({
                                    type: 'POST',
                                    url: 'php/addInfoVersionComboValue.php',
                                    data: {
                                        CodiceCampo: tempCodiceCampo,
                                        Valore: $('#textAddInfoComboValue').val()
                                    },
                                    dataType: "json",
                                    success: function (resultData) {
                                        $("#addComboValuePopup").popup( "close" );
                                        var id = "#textDynamic_____" + tempCodiceCampo;
                                        var tempValue = $(id).val();
                                        FillComboValue(tempCodiceCampo);
                                        $(id).selectmenu( "refresh" );
                                        setTimeout(function () {
                                            $(id).val(tempValue).selectmenu('refresh');
                                        }, 100);
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                });
                            });

                            $("#addComboValuePopup").popup("open");
                        }
                        else {
                            alert("You can't modify informations: selected item is imported read-only!");
                        }
                    });

                    $(".salvaImmagineButton[href='" + id2 + "']").unbind('click').bind('click', function (e) {
                        e.preventDefault();
                        var elem = $("#" + this.pathname.substr(1));
                        var btn = $(this);

                        if (_selectedWriteMode) {
                            if (elem[0].dataset.tipo == "text") {
                                $.ajax({
                                    url: "./php/setInfoVersionOggettoText.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodiceVersione').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        valore: elem.val().replace(/'/g, "''")
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "real") {
                                $.ajax({
                                    url: "./php/setInfoVersionOggettoReal.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodiceVersione').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        valore: elem.val()
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "int") {
                                $.ajax({
                                    url: "./php/setInfoVersionOggettoInt.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodiceVersione').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        valore: elem.val()
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "timestamp") {
                                $.ajax({
                                    url: "./php/setInfoVersionOggettoTimestamp.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodiceVersione').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        valore: elem.val()
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "combo") {
                                $.ajax({
                                    url: "./php/setInfoVersionOggettoCombo.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodiceVersione').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        valore: elem.val() == 0 ? null : elem.val()
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "multicombo") {
                                $.ajax({
                                    url: "./php/setInfoVersionOggettoMultiCombo.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodiceVersione').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        valore: elem.val() == 0 ? null : elem.val().join('_')
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "checkbox" || elem[0].dataset.tipo == "link") {
                                $.ajax({
                                    url: "./php/setInfoVersionOggettoCheckbox.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodiceVersione').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        valore: elem.prop("checked")
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                        }
                        else {
                            alert("You can't modify informations: selected item is imported read-only!");
                        }
                    });
                }
            }

            $(id).trigger("create");
            $(id).find("input").each(function (i, elem) {
                if ($(this).hasClass("infoInputNumber")) {
                    var btn = $(this).parent().children()[1];
                    $(btn).css('margin-right', '22px');
                }
            });

            ///////////////////////////////
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });
}

function CreateSchedeSubVersion(subVersion) {
    var id = ".infoSubVersion" + subVersion;

    $.ajax({
        type: 'POST',
        url: 'php/getListaSchedeSubVersion.php',
        data: {},
        dataType: "json",
        success: function (resultData) {
            for (i in resultData) {
                $(id).append("<div data-role=\"collapsible\" data-inset=\"false\" class=\"HiddenUI\"><h5 class=\"infoTitleExpander ui-page-theme-a\" id=\"titleInfoSubVersion" + subVersion + "_PanelDynamic_" + resultData[i].Codice+ "\">" + resultData[i].Titolo + "</h5><div class=\"infoSubVersion" + subVersion + "_PanelDynamic_" + resultData[i].Codice + "\"></div></div>");
                CreateSchedeContentSubVersion(subVersion, resultData[i].Codice);
            }
            $(id).trigger("create");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });
}

function CreateSchedeContentSubVersion(subVersion, codiceScheda) {
    function FillComboValue(subVersion, codiceCampo) {
        var id2 = "textDynamicSubVersion" + subVersion + "_____" + codiceCampo;
        $.ajax({
            type: 'POST',
            url: 'php/getInfoComboValueSubVersion.php',
            data: {
                CodiceCampo: codiceCampo
            },
            dataType: "json",
            success: function (resultData2) {
                var combo = "<option value='0'>-</option>";
                for (i in resultData2) {
                    combo += " <option value=\"" + resultData2[i].Codice + "\">" + resultData2[i].Value + "</option>";
                }
                $("#" + id2).html(combo).selectmenu('refresh');
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si � verificato un errore.");
            }
        });
    }

    var id = ".infoSubVersion" + subVersion + "_PanelDynamic_" + codiceScheda;

    $.ajax({
        type: 'POST',
        url: 'php/getListaInformazioniSubVersion.php',
        data: {
            CodiceTitolo: codiceScheda
        },
        dataType: "json",
        success: function (resultData) {
            for (i in resultData) {
                var campo = resultData[i].Campo;
                var codiceCampo = resultData[i].Codice;
                var id2 = "textDynamicSubVersion" + subVersion + "_____" + resultData[i].Codice;

                if (resultData[i].IsTitle == "t") {
                    $(id).append("<h5 class=\"infoTitle\">" + campo + "</h5>");
                }
                else if (resultData[i].IsSeparator == "t") {
                    $(id).append("<hr>");
                }
                else {
                    var height = 33 * resultData[i].Height / 22;

                    $(id).append("<a title=\"Salva\" href=\"" + id2 + "\" class=\"salvaImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-check ui-btn-icon-notext hide\">navigation</a>");
                    if (resultData[i].IsCombo == "t") {
                    }
                    $(id).append("<label for=\"" + id2 + "\" class=\"infoLabel\">" + campo + "</label>");
                    if (resultData[i].IsBool == "t") {
                        $(id).append("<input type=\"checkbox\" class=\"infoInputText\" data-tipo=\"checkbox\" data-codice=\"" + codiceCampo + "\" data-subversion=\"" + subVersion + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" value=\"\">");
                    }
                    else if (resultData[i].IsLink == "t") {
                        $(id).append("<input type=\"checkbox\" class=\"infoInputText\" data-tipo=\"link\" data-codice=\"" + codiceCampo + "\" data-subversion=\"" + subVersion + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" value=\"\">");
                    }
                    else if (resultData[i].IsTimestamp == "t") {
                        $(id).append("<input type=\"text\" class=\"infoInputText\" data-tipo=\"timestamp\" data-codice=\"" + codiceCampo + "\" data-subversion=\"" + subVersion + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" data-clear-btn=\"true\" value=\"\">");
                        $("#" + id2).datetimepicker();
                    }
                    else if (resultData[i].IsInt == "t") {
                        $(id).append("<input type=\"number\" class=\"infoInputText infoInputNumber\" data-tipo=\"int\" data-codice=\"" + codiceCampo + "\" data-subversion=\"" + subVersion + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" data-clear-btn=\"true\" value=\"\">");
                    }
                    else if (resultData[i].IsReal == "t") {
                        $(id).append("<input type=\"number\" step=\"0.000001\" class=\"infoInputText infoInputNumber\" data-tipo=\"real\" data-codice=\"" + codiceCampo + "\" data-subversion=\"" + subVersion + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" data-clear-btn=\"true\" value=\"\">");
                    }
                    else if (resultData[i].IsCombo == "t") {
                        $(id).append("<a title=\"Aggiungi valore\" href=\"" + id2 + "\" class=\"addValueImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext\">navigation</a>");
                        $(id).append("<select data-native-menu=\"false\" class=\"infoInputText\" disabled=\"disabled\" data-tipo=\"combo\" data-codice=\"" + codiceCampo + "\" data-subversion=\"" + subVersion + "\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\">");
                        $(id).append("</select>");
                        FillComboValue(subVersion, codiceCampo);
                    }
                    else if (resultData[i].IsMultiCombo == "t") {
                        $(id).append("<a title=\"Aggiungi valore\" href=\"" + id2 + "\" class=\"addValueImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext\">navigation</a>");
                        $(id).append("<select data-native-menu=\"false\" class=\"infoInputText\" multiple=\"multiple\" disabled=\"disabled\" data-tipo=\"multicombo\" data-codice=\"" + codiceCampo + "\" data-subversion=\"" + subVersion + "\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\">");
                        $(id).append("</select>");
                        FillComboValue(subVersion, codiceCampo);
                    }
                    else {
                        if (height > 33) {
                            $(id).append("<textarea class=\"infoInputText\" data-tipo=\"text\" data-codice=\"" + codiceCampo + "\" data-subversion=\"" + subVersion + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" data-clear-btn=\"true\" value=\"\"></textarea>");
                        }
                        else {
                            $(id).append("<input type=\"text\" class=\"infoInputText\" data-tipo=\"text\" data-codice=\"" + codiceCampo + "\" data-subversion=\"" + subVersion + "\" disabled=\"disabled\" name=\"" + id2 + "\" id=\"" + id2 + "\" style=\"height: " + height + "px\" data-clear-btn=\"true\" value=\"\">");
                        }
                    }

                    $(".addValueImmagineButton[href='" + id2 + "']").unbind('click').bind('click', function (e) {
                        e.preventDefault();
                        if (_selectedWriteMode) {
                            var elem = $("#" + this.pathname.substr(1));
                            tempCodiceCampo = elem[0].dataset.codice;
                            $("#textAddInfoComboValue").val("");

                            $("#addComboValueBtn").unbind('click').bind('click', function () {
                                $.ajax({
                                    type: 'POST',
                                    url: 'php/addInfoSubVersionComboValue.php',
                                    data: {
                                        CodiceCampo: tempCodiceCampo,
                                        Valore: $('#textAddInfoComboValue').val()
                                    },
                                    dataType: "json",
                                    success: function (resultData) {
                                        $("#addComboValuePopup").popup( "close" );
                                        for (i = 0; i < maxSubVersion; i++) {
                                            var id = "#textDynamicSubVersion" + i + "_____" + tempCodiceCampo;
                                            var tempValue = $(id).val();
                                            FillComboValue(i, tempCodiceCampo);
                                            $(id).selectmenu("refresh");
                                            setTimeout(function () {
                                                $(id).val(tempValue).selectmenu('refresh');
                                            }, 100);
                                        }
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                });
                            });

                            $("#addComboValuePopup").popup("open");
                        }
                        else {
                            alert("You can't modify informations: selected item is imported read-only!");
                        }
                    });

                    $(".salvaImmagineButton[href='" + id2 + "']").unbind('click').bind('click', function (e) {
                        e.preventDefault();
                        var elem = $("#" + this.pathname.substr(1));
                        var btn = $(this);

                        if (_selectedWriteMode) {
                            if (elem[0].dataset.tipo == "text") {
                                $.ajax({
                                    url: "./php/setInfoOggettoSubVersionText.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodice').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        subVersion: elem[0].dataset.subversion,
                                        valore: elem.val().replace(/'/g, "''")
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "real") {
                                $.ajax({
                                    url: "./php/setInfoOggettoSubVersionReal.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodice').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        subVersion: elem[0].dataset.subversion,
                                        valore: elem.val()
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "int") {
                                $.ajax({
                                    url: "./php/setInfoOggettoSubVersionInt.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodice').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        subVersion: elem[0].dataset.subversion,
                                        valore: elem.val()
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "timestamp") {
                                $.ajax({
                                    url: "./php/setInfoOggettoSubVersionTimestamp.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodice').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        subVersion: elem[0].dataset.subversion,
                                        valore: elem.val()
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "combo") {
                                $.ajax({
                                    url: "./php/setInfoOggettoSubVersionCombo.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodice').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        subVersion: elem[0].dataset.subversion,
                                        valore: elem.val() == 0 ? null : elem.val()
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "multicombo") {
                                $.ajax({
                                    url: "./php/setInfoOggettoSubVersionMultiCombo.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodice').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        subVersion: elem[0].dataset.subversion,
                                        valore: elem.val() == 0 ? null : elem.val().join('_')
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                            else if (elem[0].dataset.tipo == "checkbox" || elem[0].dataset.tipo == "link") {
                                $.ajax({
                                    url: "./php/setInfoOggettoSubVersionCheckbox.php",
                                    dataType: "json",
                                    crossDomain: false,
                                    data: {
                                        codiceOggetto: $('#textCodice').val(),
                                        codiceCampo: elem[0].dataset.codice,
                                        subVersion: elem[0].dataset.subversion,
                                        valore: elem.prop("checked")
                                    },
                                    success: function (resultData) {
                                        btn.removeClass("ui-btn-active");
                                        btn.css('visibility', 'collapse');
                                    },
                                    error: function (jqXHR, textStatus, errorThrown) {
                                        alert("Si � verificato un errore.");
                                    }
                                })
                            }
                        }
                        else {
                            alert("You can't modify informations: selected item is imported read-only!");
                        }
                    });
                }
            }

            $(id).trigger("create");
            $(id).find("input").each(function (i, elem) {
                if ($(this).hasClass("infoInputNumber")) {
                    var btn = $(this).parent().children()[1];
                    $(btn).css('margin-right', '22px');
                }
            });

            ///////////////////////////////
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });
}

function CreateSchedeContentInterventoSubVersion(i) {
    var id = ".infoInterventoSubVersion" + i;



    $(id).trigger("create");
    $(id).find("input").each(function (i, elem) {
        if ($(this).hasClass("infoInputNumber")) {
            var btn = $(this).parent().children()[1];
            $(btn).css('margin-right', '22px');
        }
    });
}

//create hotspot
function AddNewHotSpot(pickRecord) {

    $("#aggiungiHotSpotPopup").popup( "open" );
    $("#textHotSpotName").val("");
    $("#numberHotSpotRadius").val("0.02");
    $("#colorHotSpotColor").val("#ff0000");

    pickHotSpot = pickRecord;
    var codice = pickRecord.name.substring(1);

    $.ajax({
        type: 'POST',
        url: 'php/getInfoOggettiBase.php',
        data: {
            codice: codice
        },
        dataType: "json",
        success: function (resultData) {
            $("#textHotSpotLayer0").val(resultData[0].Layer0);
            $("#textHotSpotLayer1").val(resultData[0].Layer1);
            $("#textHotSpotLayer2").val(resultData[0].Layer2);
            $("#textHotSpotLayer3").val(resultData[0].Layer3);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Si � verificato un errore.");
        }
    });
}

//Object Actions
function RenameObject() {
    if (_singleSelecting) {
        if (_selectedWriteMode) {
            $.ajax({
                url: "./php/canRenameObject.php",
                dataType: "json",
                crossDomain: false,
                data: {
                    codiceOggetto: $('#textCodice').val(),
                },
                success: function (resultData) {
                    if (resultData == "ok") {
                        $("#renameObjectPopup").popup( "open" );
                        $('#textrenameObjectLayer0').val($('#textLayer0').val());
                        $('#textrenameObjectLayer1').val($('#textLayer1').val());
                        $('#textrenameObjectLayer2').val($('#textLayer2').val());
                        $('#textrenameObjectLayer3').val($('#textLayer3').val());
                        $('#textrenameObjectName').val($('#textName').val());
                    }
                    else {
                        alert(resultData);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert("Si è verificato un errore.");
                }
            })
        }
        else {
            alert("You can't rename the object: selected item is imported read-only!");
        }
    }
    else {
        alert("You must select only one object!");
    }
}

function DeleteObject() {
    if (_singleSelecting) {
        if (_selectedWriteMode) {
            if (confirm("Are you sure to delete current object?")) {
                $.ajax({
                    url: "./php/deleteObject.php",
                    dataType: "json",
                    crossDomain: false,
                    data: {
                        codiceOggetto: $('#textCodice').val(),
                    },
                    success: function (resultData) {
                        alert("The object is deleted");
                        _selectedObjectList[0].destroy();
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        alert("Si è verificato un errore.");
                    }
                });
            }
        }
        else {
            alert("You can't rename the object: selected item is imported read-only!");
        }
    }
    else {
        alert("You must select only one object!");
    }
}

// upload images

//function after successful file upload (when server response)
function afterSuccess() {
    $('#submit-btn').show(); //hide submit button
    $('#loading-img').hide(); //hide submit button
    $('#progressbox').delay(1000).fadeOut(); //hide progress bar

    UpdateImagePanel($('#textCodice').val());
}

//function to check file size before uploading.
function beforeSubmit() {
    //check whether browser fully supports all File API
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        if (!$('#FileInput').val()) //check empty input filed
        {
            $("#output").html("Are you kidding me?");
            return false
        }

        var fsize = $('#FileInput')[0].files[0].size; //get file size
        var ftype = $('#FileInput')[0].files[0].type; // get file type


        //allow file types
        switch (ftype) {
            case 'image/png':
            case 'image/gif':
            case 'image/jpeg':
            case 'image/pjpeg':
                //case 'text/plain':
                //case 'text/html':
                //case 'application/x-zip-compressed':
                //case 'application/pdf':
                //case 'application/msword':
                //case 'application/vnd.ms-excel':
                //case 'video/mp4':
                break;
            default:
                $("#output").html("<b>" + ftype + "</b> Unsupported file type!");
                return false
        }

        //Allowed file size is less than 5 MB (1048576)
        if (fsize > 33554432) {
            $("#output").html("<b>" + bytesToSize(fsize) + "</b> Too big file! <br />File is too big, it should be less than 12 MB.");
            return false
        }

        $('#submit-btn').hide(); //hide submit button
        $('#loading-img').show(); //hide submit button
        $("#output").html("");
    }
    else {
        //Output error to older unsupported browsers that doesn't support HTML5 File API
        $("#output").html("Please upgrade your browser, because your current browser lacks some new features we need!");
        return false;
    }
}

//progress bar function
function OnProgress(event, position, total, percentComplete) {
    //Progress bar
    $('#progressbox').show();
    $('#progressbar').width(percentComplete + '%'); //update progressbar percent complete
    $('#statustxt').html(percentComplete + '%'); //update status text
    if (percentComplete > 50) {
        $('#statustxt').css('color', '#000'); //change status text to white after 50%
    }
}

//function to format bites bit.ly/19yoIPO
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Bytes';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

//

//leap
var previousFrame = null;
var touchDistance = false;
var paused = false;
var leapMode = 1;

// Setup Leap loop with frame callback function
var controllerOptions = {};

function DisplayRowData(frame) {
// Display Frame object data
    var frameOutput = document.getElementById("frameData");

    var frameString = "Frame ID: " + frame.id + "<br />"
        + "Timestamp: " + frame.timestamp + " &micro;s<br />"
        + "Hands: " + frame.hands.length + "<br />"
        + "Fingers: " + frame.fingers.length + "<br />";

    frameOutput.innerHTML = "<div style='width:300px; float:left; padding:5px'>" + frameString + "</div>";

    // Display Hand object data
    var handOutput = document.getElementById("handData");
    var handString = "";
    if (frame.hands.length > 0) {
        for (var i = 0; i < frame.hands.length; i++) {
            var hand = frame.hands[i];

            handString += "<div style='width:300px; float:left; padding:5px'>";
            handString += "Hand ID: " + hand.id + "<br />";
            handString += "Type: " + hand.type + " hand" + "<br />";
            handString += "Direction: " + vectorToString(hand.direction, 2) + "<br />";
            handString += "Palm position: " + vectorToString(hand.palmPosition) + " mm<br />";
            handString += "Grab strength: " + hand.grabStrength + "<br />";
            handString += "Pinch strength: " + hand.pinchStrength + "<br />";
            handString += "Confidence: " + hand.confidence + "<br />";
            handString += "Arm direction: " + vectorToString(hand.arm.direction()) + "<br />";
            handString += "Arm center: " + vectorToString(hand.arm.center()) + "<br />";
            handString += "Arm up vector: " + vectorToString(hand.arm.basis[1]) + "<br />";

            // IDs of pointables associated with this hand
            if (hand.pointables.length > 0) {
                var fingerIds = [];
                for (var j = 0; j < hand.pointables.length; j++) {
                    var pointable = hand.pointables[j];
                    fingerIds.push(pointable.id);
                }
                if (fingerIds.length > 0) {
                    handString += "Fingers IDs: " + fingerIds.join(", ") + "<br />";
                }
            }

            handString += "</div>";
        }
    }
    else {
        handString += "No hands";
    }
    handOutput.innerHTML = handString;

    // Display Pointable (finger) object data
    var pointableOutput = document.getElementById("pointableData");
    var pointableString = "";
    if (frame.pointables.length > 0) {
        var fingerTypeMap = ["Thumb", "Index finger", "Middle finger", "Ring finger", "Pinky finger"];
        var boneTypeMap = ["Metacarpal", "Proximal phalanx", "Intermediate phalanx", "Distal phalanx"];
        for (var i = 0; i < frame.pointables.length; i++) {
            var pointable = frame.pointables[i];

            pointableString += "<div style='width:250px; float:left; padding:5px'>";

            {
                pointableString += "Pointable ID: " + pointable.id + "<br />";
                pointableString += "Type: " + fingerTypeMap[pointable.type] + "<br />";
                pointableString += "Belongs to hand with ID: " + pointable.handId + "<br />";
                pointableString += "Classified as a finger<br />";
                pointableString += "Length: " + pointable.length.toFixed(1) + " mm<br />";
                pointableString += "Width: " + pointable.width.toFixed(1) + " mm<br />";
                pointableString += "Direction: " + vectorToString(pointable.direction, 2) + "<br />";
                pointableString += "Extended?: " + pointable.extended + "<br />";
                pointable.bones.forEach(function (bone) {
                    pointableString += boneTypeMap[bone.type] + " bone <br />";
                    pointableString += "Center: " + vectorToString(bone.center()) + "<br />";
                    pointableString += "Direction: " + vectorToString(bone.direction()) + "<br />";
                    pointableString += "Up vector: " + vectorToString(bone.basis[1]) + "<br />";
                });
                pointableString += "Tip position: " + vectorToString(pointable.tipPosition) + " mm<br />";
                pointableString += "</div>";
            }
        }
    }
    else {
        pointableString += "<div>No pointables</div>";
    }
    pointableOutput.innerHTML = pointableString;
}

function handIsClosed(hand) {
    if (hand.pointables.length > 0) {
        for (var i = 0; i < hand.pointables.length; i++) {
            var pointable = hand.pointables[i];
            if (pointable.type != 0 && pointable.extended)
                return false;
        }
    }
    return true;
}

function handIsOpen(hand) {
    if (hand.pointables.length > 0) {
        for (var i = 0; i < hand.pointables.length; i++) {
            var pointable = hand.pointables[i];
            if (pointable.type != 0 && !pointable.extended)
                return false;
        }
        return true;
    }
    return false;
}

function fingerOnly1(hand) {
    var found = false;
    if (hand.pointables.length > 0) {
        for (var i = 0; i < hand.pointables.length; i++) {
            var pointable = hand.pointables[i];
            if (pointable.extended && pointable.type == 1) {
                found = true;
            }
            else if (pointable.extended) {
                return false;
            }
        }
    }
    return found;
}

function fingerOnly12(hand) {
    var n = 0;
    if (hand.pointables.length > 0) {
        for (var i = 0; i < hand.pointables.length; i++) {
            var pointable = hand.pointables[i];
            if (pointable.extended && (pointable.type == 1 || pointable.type == 2)) {
                n = n + 1;
            }
            else if (pointable.extended) {
                return false;
            }
        }
    }
    return n == 2;
}

function fingerOnly123(hand) {
    var n = 0;
    if (hand.pointables.length > 0) {
        for (var i = 0; i < hand.pointables.length; i++) {
            var pointable = hand.pointables[i];
            if (pointable.extended && (pointable.type == 1 || pointable.type == 2 || pointable.type == 3)) {
                n = n + 1;
            }
            else if (pointable.extended) {
                return false;
            }
        }
    }
    return n == 3;
}

function LeapController(frame) {
    if (paused) {
        return; // Skip this update
    }
    //DisplayRowData(frame);

    var rightHand;
    var previousRightHand;
    if (frame.hands.length > 0) {
        for (var i = 0; i < frame.hands.length; i++) {
            var hand = frame.hands[i];
            if (hand.type == "right") {
                rightHand = hand;
            }
        }
    }
    if (previousFrame && previousFrame.hands.length > 0) {
        for (var i = 0; i < previousFrame.hands.length; i++) {
            var hand = previousFrame.hands[i];
            if (hand.type == "right") {
                previousRightHand = hand;
            }
        }
    }

    var leftHand;
    var previousLeftHand;
    if (leapMode > 1) {
        if (frame.hands.length > 0) {
            for (var i = 0; i < frame.hands.length; i++) {
                var hand = frame.hands[i];
                if (hand.type == "left") {
                    leftHand = hand;
                }
            }
        }
        if (previousFrame && previousFrame.hands.length > 0) {
            for (var i = 0; i < previousFrame.hands.length; i++) {
                var hand = previousFrame.hands[i];
                if (hand.type == "left") {
                    previousLeftHand = hand;
                }
            }
        }
    }

    var pointerCanvas = document.getElementById('pointerCanvas');
    var theCanvas = $("#theCanvas");
    pointerCanvas.width = theCanvas.width();
    pointerCanvas.height = theCanvas.height();

    if (leapMode == 1) {
        if (rightHand && previousRightHand) {
            if (handIsOpen(rightHand) && !handIsClosed(rightHand)) {
                //if (rightHand.grabStrength < 0.75) {
                SetAuxScene();
                WheelZoom((previousRightHand.palmPosition[2] - rightHand.palmPosition[2]) / 50);
                SetAuxScene();
                RotateXZ((previousRightHand.palmPosition[1] - rightHand.palmPosition[1]) / 50, (rightHand.palmPosition[0] - previousRightHand.palmPosition[0]) / 50);
                SetAuxScene();
            }
            else if (fingerOnly12(rightHand)) {
                SetAuxScene();
                PanXZ((rightHand.palmPosition[0] - previousRightHand.palmPosition[0]) / 100, (previousRightHand.palmPosition[1] - rightHand.palmPosition[1]) / 100);
                SetAuxScene();
                PanY((previousRightHand.palmPosition[2] - rightHand.palmPosition[2]) / 100);
                SetAuxScene();
            }
            else if (fingerOnly123(rightHand)) {
                SetAuxScene();
                LookRotateXZ((previousRightHand.palmPosition[1] - rightHand.palmPosition[1]) / 50, (rightHand.palmPosition[0] - previousRightHand.palmPosition[0]) / 50);
                SetAuxScene();
                PanY((previousRightHand.palmPosition[2] - rightHand.palmPosition[2]) / 100);
                SetAuxScene();
            }
            else if (fingerOnly1(rightHand)) {
                var indexFinger = rightHand.pointables[1];
                if (indexFinger.touchDistance >= 0) {
                    //Get a pointable and normalize the tip position
                    var interactionBox = frame.interactionBox;
                    var normalizedPosition = interactionBox.normalizePoint(indexFinger.tipPosition, true);

                    // Convert the normalized coordinates to span the canvas
                    var canvasX = pointerCanvas.width * normalizedPosition[0];
                    var canvasY = pointerCanvas.height * (1 - normalizedPosition[1]);

                    var context = pointerCanvas.getContext('2d');

                    context.beginPath();
                    context.arc(canvasX, canvasY, 8, 0, 2 * Math.PI);
                    context.fillStyle = '#00ff00';
                    context.fill();
                    context.lineWidth = 1;
                    context.strokeStyle = '#aaaaaa';
                    context.stroke();

                    touchDistance = false;

                    if (_measureStep == 1) {
                        ShowDistanceText({x: canvasX, y: canvasY});
                    }
                }
                else if (!touchDistance) {
                    touchDistance = true;
                    var theCanvas = $("#theCanvas");
                    //Get a pointable and normalize the tip position
                    var pointable = rightHand.pointables[1];
                    var interactionBox = frame.interactionBox;
                    var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);

                    // Convert the normalized coordinates to span the canvas
                    var canvasX = theCanvas.width() * normalizedPosition[0];
                    var canvasY = theCanvas.height() * (1 - normalizedPosition[1]);

                    SceneClickHandler({x: canvasX, y: canvasY});
                }
            }
        }
    }
    else if (leapMode == 2) {
        if (rightHand && previousRightHand) {
            if (handIsOpen(rightHand) && !handIsClosed(rightHand)) {
                SetAuxScene();
                LookRotateXZ((previousRightHand.palmPosition[1] - rightHand.palmPosition[1]) / 50, (rightHand.palmPosition[0] - previousRightHand.palmPosition[0]) / 50);
                SetAuxScene();
                PanY((previousRightHand.palmPosition[2] - rightHand.palmPosition[2]) / 100);
                SetAuxScene();
            }
            else if (fingerOnly12(rightHand)) {
                SetAuxScene();
                PanXZ((rightHand.palmPosition[0] - previousRightHand.palmPosition[0]) / 100, (previousRightHand.palmPosition[1] - rightHand.palmPosition[1]) / 100);
                SetAuxScene();
                PanY((previousRightHand.palmPosition[2] - rightHand.palmPosition[2]) / 100);
                SetAuxScene();
            }
            else if (fingerOnly1(rightHand)) {
                var indexFinger = rightHand.pointables[1];
                if (indexFinger.touchDistance >= 0) {
                    //Get a pointable and normalize the tip position
                    var interactionBox = frame.interactionBox;
                    var normalizedPosition = interactionBox.normalizePoint(indexFinger.tipPosition, true);

                    // Convert the normalized coordinates to span the canvas
                    var canvasX = pointerCanvas.width * normalizedPosition[0];
                    var canvasY = pointerCanvas.height * (1 - normalizedPosition[1]);

                    var context = pointerCanvas.getContext('2d');

                    context.beginPath();
                    context.arc(canvasX, canvasY, 8, 0, 2 * Math.PI);
                    context.fillStyle = '#00ff00';
                    context.fill();
                    context.lineWidth = 1;
                    context.strokeStyle = '#aaaaaa';
                    context.stroke();

                    touchDistance = false;

                    if (_measureStep == 1) {
                        ShowDistanceText({x: canvasX, y: canvasY});
                    }
                }
                else if (!touchDistance) {
                    touchDistance = true;
                    var theCanvas = $("#theCanvas");
                    //Get a pointable and normalize the tip position
                    var pointable = rightHand.pointables[1];
                    var interactionBox = frame.interactionBox;
                    var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);

                    // Convert the normalized coordinates to span the canvas
                    var canvasX = theCanvas.width() * normalizedPosition[0];
                    var canvasY = theCanvas.height() * (1 - normalizedPosition[1]);

                    SceneClickHandler({x: canvasX, y: canvasY});
                }
            }
        }
        if (leftHand && previousLeftHand) {
            if (handIsOpen(leftHand) && !handIsClosed(leftHand)) {
                //if (leftHand.grabStrength < 0.75) {
                SetAuxScene();
                WheelZoom((previousLeftHand.palmPosition[2] - leftHand.palmPosition[2]) / 50);
                SetAuxScene();
                RotateXZ((previousLeftHand.palmPosition[1] - leftHand.palmPosition[1]) / 50, (leftHand.palmPosition[0] - previousLeftHand.palmPosition[0]) / 50);
                SetAuxScene();
            }
            else if (fingerOnly12(leftHand)) {
                SetAuxScene();
                PanXZ((previousLeftHand.palmPosition[0] - leftHand.palmPosition[0]) / 100, (leftHand.palmPosition[1] - previousLeftHand.palmPosition[1]) / 100);
                SetAuxScene();
                PanY((previousLeftHand.palmPosition[2] - leftHand.palmPosition[2]) / 100);
                SetAuxScene();
            }
            else if (fingerOnly1(leftHand)) {
                var indexFinger = leftHand.pointables[1];
                if (indexFinger.touchDistance >= 0) {
                    //Get a pointable and normalize the tip position
                    var interactionBox = frame.interactionBox;
                    var normalizedPosition = interactionBox.normalizePoint(indexFinger.tipPosition, true);

                    // Convert the normalized coordinates to span the canvas
                    var canvasX = pointerCanvas.width * normalizedPosition[0];
                    var canvasY = pointerCanvas.height * (1 - normalizedPosition[1]);

                    var context = pointerCanvas.getContext('2d');

                    context.beginPath();
                    context.arc(canvasX, canvasY, 8, 0, 2 * Math.PI);
                    context.fillStyle = '#00ff00';
                    context.fill();
                    context.lineWidth = 1;
                    context.strokeStyle = '#aaaaaa';
                    context.stroke();

                    touchDistance = false;

                    if (_measureStep == 1) {
                        ShowDistanceText({x: canvasX, y: canvasY});
                    }
                }
                else if (!touchDistance) {
                    touchDistance = true;
                    var theCanvas = $("#theCanvas");
                    //Get a pointable and normalize the tip position
                    var pointable = leftHand.pointables[1];
                    var interactionBox = frame.interactionBox;
                    var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);

                    // Convert the normalized coordinates to span the canvas
                    var canvasX = theCanvas.width() * normalizedPosition[0];
                    var canvasY = theCanvas.height() * (1 - normalizedPosition[1]);

                    SceneClickHandler({x: canvasX, y: canvasY});
                }
            }
        }
    }
    else if (leapMode == 3) {
        if (rightHand && previousRightHand) {
            if (handIsOpen(rightHand) && !handIsClosed(rightHand)) {
                SetAuxScene();
                WheelZoom((previousRightHand.palmPosition[2] - rightHand.palmPosition[2]) / 50);
                SetAuxScene();
                RotateXZ((previousRightHand.palmPosition[1] - rightHand.palmPosition[1]) / 50, (rightHand.palmPosition[0] - previousRightHand.palmPosition[0]) / 50);
                SetAuxScene();
            }
            else if (fingerOnly12(rightHand)) {
                SetAuxScene();
                PanXZ((previousRightHand.palmPosition[0] - rightHand.palmPosition[0]) / 100, (rightHand.palmPosition[1] - previousRightHand.palmPosition[1]) / 100);
                SetAuxScene();
                PanY((previousRightHand.palmPosition[2] - rightHand.palmPosition[2]) / 100);
                SetAuxScene();
            }
            else if (fingerOnly1(rightHand)) {
                var indexFinger = rightHand.pointables[1];
                if (indexFinger.touchDistance >= 0) {
                    //Get a pointable and normalize the tip position
                    var interactionBox = frame.interactionBox;
                    var normalizedPosition = interactionBox.normalizePoint(indexFinger.tipPosition, true);

                    // Convert the normalized coordinates to span the canvas
                    var canvasX = pointerCanvas.width * normalizedPosition[0];
                    var canvasY = pointerCanvas.height * (1 - normalizedPosition[1]);

                    var context = pointerCanvas.getContext('2d');

                    context.beginPath();
                    context.arc(canvasX, canvasY, 8, 0, 2 * Math.PI);
                    context.fillStyle = '#00ff00';
                    context.fill();
                    context.lineWidth = 1;
                    context.strokeStyle = '#aaaaaa';
                    context.stroke();

                    touchDistance = false;

                    if (_measureStep == 1) {
                        ShowDistanceText({x: canvasX, y: canvasY});
                    }
                }
                else if (!touchDistance) {
                    touchDistance = true;
                    var theCanvas = $("#theCanvas");
                    //Get a pointable and normalize the tip position
                    var pointable = rightHand.pointables[1];
                    var interactionBox = frame.interactionBox;
                    var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);

                    // Convert the normalized coordinates to span the canvas
                    var canvasX = theCanvas.width() * normalizedPosition[0];
                    var canvasY = theCanvas.height() * (1 - normalizedPosition[1]);

                    SceneClickHandler({x: canvasX, y: canvasY});
                }
            }
        }
        if (leftHand && previousLeftHand) {
            if (handIsOpen(leftHand) && !handIsClosed(leftHand)) {
                SetAuxScene();
                LookRotateXZ((previousLeftHand.palmPosition[1] - leftHand.palmPosition[1]) / 50, (leftHand.palmPosition[0] - previousLeftHand.palmPosition[0]) / 50);
                SetAuxScene();
                PanY((previousLeftHand.palmPosition[2] - leftHand.palmPosition[2]) / 100);
                SetAuxScene();
            }
            else if (fingerOnly12(leftHand)) {
                SetAuxScene();
                PanXZ((leftHand.palmPosition[0] - previousLeftHand.palmPosition[0]) / 100, (previousLeftHand.palmPosition[1] - leftHand.palmPosition[1]) / 100);
                SetAuxScene();
                PanY((previousLeftHand.palmPosition[2] - leftHand.palmPosition[2]) / 100);
                SetAuxScene();
            }
            else if (fingerOnly1(leftHand)) {
                var indexFinger = leftHand.pointables[1];
                if (indexFinger.touchDistance >= 0) {
                    //Get a pointable and normalize the tip position
                    var interactionBox = frame.interactionBox;
                    var normalizedPosition = interactionBox.normalizePoint(indexFinger.tipPosition, true);

                    // Convert the normalized coordinates to span the canvas
                    var canvasX = pointerCanvas.width * normalizedPosition[0];
                    var canvasY = pointerCanvas.height * (1 - normalizedPosition[1]);

                    var context = pointerCanvas.getContext('2d');

                    context.beginPath();
                    context.arc(canvasX, canvasY, 8, 0, 2 * Math.PI);
                    context.fillStyle = '#00ff00';
                    context.fill();
                    context.lineWidth = 1;
                    context.strokeStyle = '#aaaaaa';
                    context.stroke();

                    touchDistance = false;

                    if (_measureStep == 1) {
                        ShowDistanceText({x: canvasX, y: canvasY});
                    }
                }
                else if (!touchDistance) {
                    touchDistance = true;
                    var theCanvas = $("#theCanvas");
                    //Get a pointable and normalize the tip position
                    var pointable = leftHand.pointables[1];
                    var interactionBox = frame.interactionBox;
                    var normalizedPosition = interactionBox.normalizePoint(pointable.tipPosition, true);

                    // Convert the normalized coordinates to span the canvas
                    var canvasX = theCanvas.width() * normalizedPosition[0];
                    var canvasY = theCanvas.height() * (1 - normalizedPosition[1]);

                    SceneClickHandler({x: canvasX, y: canvasY});
                }
            }
        }
    }

    // Store frame for motion functions
    previousFrame = frame;
}

function vectorToString(vector, digits) {
    if (typeof digits === "undefined") {
        digits = 1;
    }
    return "(" + vector[0].toFixed(digits) + ", "
        + vector[1].toFixed(digits) + ", "
        + vector[2].toFixed(digits) + ")";
}

function togglePause() {
    paused = !paused;

    if (paused) {
        document.getElementById("pause").innerText = "Resume";
    } else {
        document.getElementById("pause").innerText = "Pause";
    }
}
