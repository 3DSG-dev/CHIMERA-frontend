function MyGeoLoader() {
    this.loadGeometry = function (id, callback) {
        var MyBIMDuomoCacheManager = new BIMCacheManager();
        MyBIMDuomoCacheManager.fileReceived = function (jsondata) {
            callback(jsondata);
        }
        MyBIMDuomoCacheManager.getFile(id)
        /*
        if (jsondata === null) {
        $.getJSON(id + ".json")
        .success(function (data, textStatus, jqXHR) {
        data.positions = new Float32Array(data.positions)
        data.normals = new Float32Array(data.normals);
        data.uv = null;
        data.indices = new Int32Array(data.indices);
        callback(
        data
        );
        })
        .error(function (jqXHR, textStatus, errorThrown) {
        var error = textStatus;
        error = errorThrown;
        })
        .complete(function () {
        });

        }
        else {
        callback(
        data
        );
        }
        }*/

    };
}

SceneJS.Services.addService(SceneJS.Services.GEO_LOADER_SERVICE_ID, new MyGeoLoader());

var selectedObjectList = new Array();
var aspect = $("#theCanvas").width() / $("#theCanvas").height();
var refreshData = false;
var firstRefresh = true;
var hitLOD;
var arrayLOD = new Array();
var picki1 = 1;
var pippo;
var scenenym;

setInterval(function () { refreshData = true }, 10000);

SceneJS.setDebugConfigs({
    shading: {
        logScripts: false,
        validate: true
    }
});

$.getJSON("./php/" + "modello" + ".php?aspect=" + aspect)
    .success(function (data, textStatus, jqXHR) {
        SceneJS.createScene({
            type: "scene",
            id: "the-scene",
            canvasId: "theCanvas",
            loggingElementId: "theLoggingDiv",
            nodes: data.emptyScene
        });

        scenenym = SceneJS.scene("the-scene");
        var blocchi = scenenym.findNode("block");
        $.each(data.nodes, function (index, value) {
            try {
                blocchi.add("node", value);
            }
            catch (err) {
            }
        });
        var yaw = 30;
        var pitch = -30;
        var lastX;
        var lastY;
        var dragging = false;

        var canvas = document.getElementById("theCanvas");

        function mouseDown(event) {
            lastX = event.clientX;
            lastY = event.clientY;
            dragging = true;

            if (event.shiftKey) {
                var coords = clickCoordsWithinElement(event);
                var pickRecord = scenenym.pick(coords.x, coords.y);
                if (pickRecord) {
                    for (var i in selectedObjectList) {
                        params = (selectedObjectList[i]).node(0).node(0)._targetNode.core.params;
                        params.colorTransEnabled = false;
                        (selectedObjectList[i]).node(0).node(0).set("params", params);
                    }
                    while (selectedObjectList.length > 0) selectedObjectList.pop();
                    selobj = scenenym.findNode(pickRecord.name);
                    alert(pickRecord.name);

                    params = selobj.node(0).node(0)._targetNode.core.params;
                    params.colorTransEnabled = !params.colorTransEnabled;
                    selobj.node(0).node(0).set("params", params);

                    selectedObjectList.push(selobj);

                    var bbox = selobj.node(0).node(0).node(0).get("boundary");
                    var mv = scenenym.findNode("mainview");
                    var target = mv.get("look");
                    target.x = (bbox.xmin + bbox.xmax) / 2;
                    target.y = (bbox.ymin + bbox.ymax) / 2;
                    target.z = (bbox.zmin + bbox.zmax) / 2;
                    mv.set("look", target);

                } else {
                }
            }
        }

        function mouseUp() {
            dragging = false;
        }


        function mouseMove(event) {
            if (dragging) {
                if (event.altKey) {

                    mv = scenenym.findNode("mainview");
                    dphi = Math.sin(Math.PI / 180 * (event.clientX - lastX));
                    dteta = Math.sin(Math.PI / 180 * (event.clientY - lastY));

                    eye = mv.get("eye");
                    target = mv.get("look");
                    x = -eye.x + target.x;
                    y = -eye.y + target.y;
                    z = -eye.z + target.z;
                    r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
                    theta = Math.acos(z / r);
                    phi = Math.atan2(y / r, x / r);

                    theta = (theta + Math.PI / 360.0 * (event.clientY - lastY));
                    phi = (phi - Math.PI / 360.0 * (event.clientX - lastX));
                    if (theta > Math.PI) theta = Math.PI;
                    if (theta < 0) theta = 0;

                    eye.x = -r * Math.sin(theta) * Math.cos(phi) + target.x;
                    eye.y = -r * Math.sin(theta) * Math.sin(phi) + target.y;
                    eye.z = -r * Math.cos(theta) + target.z;

                    mv.set("eye", eye);
                    l01 = scenenym.findNode("light01");
                    l01dir = l01.get("dir");

                    l01dir.x = x;
                    l01dir.y = y;
                    l01dir.z = z;

                    l01.set("dir", l01dir);
                }
                else if (event.ctrlKey) {
                    mode = (Math.abs(event.clientX - lastX) > Math.abs(event.clientY - lastY)) ? (event.clientX - lastX) : (event.clientY - lastY);
                    mode = (mode > 0) ? 0.1 : -0.1;

                    mv = scenenym.findNode("mainview");

                    eye = mv.get("eye");
                    target = mv.get("look");
                    x = -eye.x + target.x;
                    y = -eye.y + target.y;
                    z = -eye.z + target.z;
                    r = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));

                    eye.x = eye.x + x * mode;
                    eye.y = eye.y + y * mode;
                    eye.z = eye.z + z * mode;

                    mv.set("eye", eye);

                    l01 = scenenym.findNode("light01");
                    l01dir = l01.get("dir");

                    l01dir.x = x;
                    l01dir.y = y;
                    l01dir.z = z;

                    l01.set("dir", l01dir);

                }

                lastX = event.clientX;
                lastY = event.clientY

            }
        }

        function clickCoordsWithinElement(event) {
            var coords = { x: 0, y: 0 };
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

        canvas.addEventListener('mousedown', mouseDown, true);
        canvas.addEventListener('mousemove', mouseMove, true);
        canvas.addEventListener('mouseup', mouseUp, true);
        SceneJS.scene("the-scene").start({
            idleFunc: function () {  // Called continuously, within each interval

                if (firstRefresh) {
                    var blocchi = scenenym.findNode("block");
                    blocchi.eachNode(
                        function () {
                            var levelToLoad = 7;
                            if (levelToLoad < this.get("data").ActualLevel) {

                                while (!(this.get("data").hasOwnProperty('l' + levelToLoad))) {
                                    levelToLoad--;
                                    if (levelToLoad < 0) break;
                                }
                                if ((levelToLoad >= 0) && (levelToLoad < this.get("data").ActualLevel)) {
                                    this.data("ActualLevel", 65535);
                                    while (this.node(0).node(0)._targetNode.children.length > 0) {
                                        this.node(0).node(0)._targetNode.children[0].destroy();
                                    }
                                    for (i = 0; i < this.get("data")['l' + levelToLoad]; i++) {
                                        this.node(0).node(0).add("node",
                                            {
                                                type: "geometry",
                                                stream: (this.get("id") + "_" + i + "_" + levelToLoad)
                                            }
                                        )
                                    }
                                    this.data("ActualLevel", levelToLoad);
                                }
                            }
                        },
                        {
                            andSelf: false,     // Visit our myLookat node as well
                            depthFirst: false   // Descend depth-first into tree
                        }
                    );
                    firstRefresh = false;
                }

                if (refreshData) {
                    pippo = refreshData;
                    refreshData = false;
                    //scenenym = SceneJS.scene("the-scene");
                }
                if (pippo) {
                    //arrayLOD.length = 0;
                    //                    for (var i = 1; i <= $("#theCanvas").width(); i = i + 64) {
                    picki2 = picki1 + 129;
                    if (picki2 > $("#theCanvas").width()) picki2 = $("#theCanvas").width();
                    for (var i = picki1; i <= picki2; i = i + 64) {
                        for (var j = 1; j <= $("#theCanvas").height(); j = j + 64) {
                            hitLOD = scenenym.pick(i, j, { rayPick: false });
                            if (hitLOD) {
                                if (arrayLOD[hitLOD.name] == null) {
                                    arrayLOD[hitLOD.name] = 1;
                                }
                                else {
                                    arrayLOD[hitLOD.name]++;
                                }
                            }
                        }
                        picki1 = picki1 + 64;

                    }
///                    if (picki1 > $("#theCanvas").width()) {


                        if (arrayLOD.length > 0) {
                            for (var index in arrayLOD) {
                                var levelToLoad;
                                switch (arrayLOD[index]) {
                                    case 1:
                                        levelToLoad = 7;
                                        break;
                                    case 2: case 3: case 4:
                                        levelToLoad = 6;
                                        break;
                                    case 5: case 6: case 7: case 8: case 9:
                                        levelToLoad = 5;
                                        break;
                                    case 10: case 11: case 12: case 13: case 14: case 15: case 16:
                                        levelToLoad = 4;
                                        break;
                                    case 17: case 18: case 19: case 20: case 21: case 22: case 23: case 24: case 25:
                                        levelToLoad = 3;
                                        break;
                                    case 26: case 27: case 28: case 29: case 30: case 31: case 32: case 33: case 34: case 35: case 36:
                                        levelToLoad = 2;
                                        break;
                                    default:
                                        levelToLoad = 1;
                                        break;
                                }
                                var currentNode = scenenym.findNode(index)
                                if (levelToLoad < currentNode.get("data").ActualLevel) {
                                    //alert("cambio LOD")
                                    while (!(currentNode.get("data").hasOwnProperty('l' + levelToLoad))) {
                                        levelToLoad--;
                                        if (levelToLoad < 0) break;
                                    }
                                    if ((levelToLoad >= 0) && (levelToLoad < currentNode.get("data").ActualLevel)) {
                                        currentNode.data("ActualLevel", 65535);
                                        while (currentNode.node(0).node(0)._targetNode.children.length > 0) {
                                            currentNode.node(0).node(0)._targetNode.children[0].destroy();
                                        }
                                        for (i = 0; i < currentNode.get("data")['l' + levelToLoad]; i++) {
                                            currentNode.node(0).node(0).add("node",
                        {
                            type: "geometry",
                            stream: (currentNode.get("id") + "_" + i + "_" + levelToLoad)
                        }
                        )
                                        }
                                        currentNode.data("ActualLevel", levelToLoad)
                                    }
                                }
                            }
                        }
                        arrayLOD.length = 0;
                        if (picki1 > $("#theCanvas").width()) {

                        //refreshData = false;
                        pippo = false;
                        picki1 = 1;

                    }
                }

            },

            sleepFunc: function () {     // Called when all updates have been rendered
            }
        });

        /*
        var myBlockNode = SceneJS.scene("the-scene").findNode("block");

        myBlockNode.eachNode(
        function () {
        if (this.get("type") == "name") {
        this.bind(
        "rendered",
        function (event) {
        var params = event.params;
        var ulist = new Array();
        var vlist = new Array();
        var bbox = this.node(0).node(0).get("boundary");
        var uv = event.params.getCanvasPos([bbox.xmin, bbox.ymin, bbox.zmin]);
        uv = event.params.getCanvasPos([bbox.xmin, bbox.ymin, bbox.zmax]);
        ulist.push(uv.x);
        vlist.push(uv.y);
        uv = event.params.getCanvasPos([bbox.xmin, bbox.ymax, bbox.zmin]);
        ulist.push(uv.x);
        vlist.push(uv.y);
        uv = event.params.getCanvasPos([bbox.xmin, bbox.ymax, bbox.zmax]);
        ulist.push(uv.x);
        vlist.push(uv.y);
        uv = event.params.getCanvasPos([bbox.xmax, bbox.ymin, bbox.zmin]);
        ulist.push(uv.x);
        vlist.push(uv.y);
        uv = event.params.getCanvasPos([bbox.xmax, bbox.ymin, bbox.zmax]);
        ulist.push(uv.x);
        vlist.push(uv.y);
        uv = event.params.getCanvasPos([bbox.xmax, bbox.ymax, bbox.zmin]);
        ulist.push(uv.x);
        vlist.push(uv.y);
        uv = event.params.getCanvasPos([bbox.xmax, bbox.ymax, bbox.zmax]);
        ulist.push(uv.x);
        vlist.push(uv.y);
        var usize = Math.max.apply(Math, ulist) - Math.min.apply(Math, ulist);
        var vsize = Math.max.apply(Math, vlist) - Math.min.apply(Math, vlist);

        if (usize < 20 && vsize < 20 && (this.data("livello") == null || this.data("livello") == 1)) {
        this.data("livello", 0);
        this.node(0).remove("nodeAt", 0);
        this.node(0).insert("node",
        {
        type: "geometry",
        stream: this.get("id")
        }
        );
        }
        else if ((usize > 30 || vsize > 30) && (this.data("livello") == null || this.data("livello") == 0)) {
        this.data("livello", 1);
        this.node(0).remove("nodeAt", 0);
        this.node(0).insert("node",
        {
        type: "geometry",
        stream: "full/" + this.get("id")
        }
        );
        }
        }
        );
        }
        },
        {
        andSelf: false,
        depthFirst: false,
        breadthFirst: false
        }
        );*/
        ////

    })
    .error(function (jqXHR, textStatus, errorThrown) {
        alert(textStatus);
    })
    .complete(function () {
    });










