function MyGeoLoader() {
    this.loadGeometry = function (id, callback) {
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
    };
}

SceneJS.Services.addService(SceneJS.Services.GEO_LOADER_SERVICE_ID, new MyGeoLoader());

var selectedObjectList = new Array();
var aspect = $("#theCanvas").width() / $("#theCanvas").height();
var refreshData = false;
setInterval(function () { refreshData = true }, 5000);

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

        var scene = SceneJS.scene("the-scene");
        var blocchi = scene.findNode("block");
        $.each(data.nodes, function (index, value) {
            try {
                blocchi.add("node", value);
            }
            catch (err) {
            }
        });
        refreshData = true;

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
                var pickRecord = scene.pick(coords.x, coords.y);
                if (pickRecord) {
                    for (var i in selectedObjectList) {
                        params = (selectedObjectList[i]).node(0).node(0)._targetNode.core.params;
                        params.colorTransEnabled = false;
                        (selectedObjectList[i]).node(0).node(0).set("params", params);
                    }
                    while (selectedObjectList.length > 0) selectedObjectList.pop();
                    selobj = scene.findNode(pickRecord.name);

                    params = selobj.node(0).node(0)._targetNode.core.params;
                    params.colorTransEnabled = !params.colorTransEnabled;
                    selobj.node(0).node(0).set("params", params);

                    selectedObjectList.push(selobj);

                    var bbox = selobj.node(0).node(0).node(0).get("boundary");
                    var mv = scene.findNode("mainview");
                    var target = mv.get("look");
                    target.x = (bbox.xmin + bbox.xmax) / 2;
                    target.y = (bbox.ymin + bbox.ymax) / 2;
                    target.z = (bbox.zmin + bbox.zmax) / 2;
                    mv.set("look", target);
                    /*
                    $.ajax({
                    type: "GET",
                    url: "./php/duomoDbSelect.php",
                    data: "guid=" + pickRecord.nodeId,
                    success: function (response) {
                    var queryResponse = jQuery.parseJSON(response);
                    $('#queryResult').empty().append(
                    'layer: ' + queryResponse.rows[0].dati.cartella +
                    '<br/>nome: ' + queryResponse.rows[0].dati.nome +
                    '<br/>data di creazione: ' + queryResponse.rows[0].dati.dataCreazione +
                    '<br/>data di rimozione: ' + queryResponse.rows[0].dati.dataRimozione +
                    '<br/>note: ' + queryResponse.rows[0].dati.note +
                    '<br/>note storiche: ' + queryResponse.rows[0].dati.noteStoriche
                    );
                    $.each(queryResponse.rows[0].origine,
                    function (index, el) {
                    if (index == 0) {
                    $('#queryResult').append(
                    '<br/>Primo rilievo:<br/>'
                    );
                    }
                    $('#queryResult').append(
                    el[3] + ':<div id="' + el[3] + '"><a href="#"><img src="' + el[2][0] + '"/></a></div>'
                    );
                    $('#' + el[3]).click(function () {
                    $.prettyPhoto.open(el[1], el[1], el[1], el[2]);
                    });
                    }
                    );
                    var i = 1;
                    while (i < queryResponse.rows.length) {
                    $('#queryResult').append(
                    '<br/>cantiere: ' + queryResponse.rows[i].dati.cantiere +
                    '<br/>sector: ' + queryResponse.rows[i].dati.sector +
                    '<br/>livello: ' + queryResponse.rows[i].dati.livello +
                    '<br/>numero: ' + queryResponse.rows[i].dati.numero +
                    '<br/>sub: ' + queryResponse.rows[i].dati.sub +
                    '<br/>sigla: ' + queryResponse.rows[i].dati.sigla +
                    '<br/>oggetto: ' + queryResponse.rows[i].dati.oggetto +
                    '<br/>cartella: ' + queryResponse.rows[i].dati.cartella +
                    '<br/>descrizione: ' + queryResponse.rows[i].dati.descrizione +
                    '<br/>l: ' + queryResponse.rows[i].dati.l +
                    '<br/>p: ' + queryResponse.rows[i].dati.p +
                    '<br/>h: ' + queryResponse.rows[i].dati.h +
                    '<br/>note: ' + queryResponse.rows[i].dati.note +
                    '<br/>uscito: ' + queryResponse.rows[i].dati.uscito +
                    '<br/>entrato: ' + queryResponse.rows[i].dati.entrato
                    );
                    $.each(queryResponse.rows[i].origine,
                    function (index, el) {
                    if (index == 0) {
                    $('#queryResult').append(
                    '<br/>Intervento:<br/>'
                    );
                    }
                    $('#queryResult').append(
                    el[3] + ':<div id="' + el[3] + '"><a href="#"><img src="' + el[2][0] + '"/></a></div>'
                    );
                    $('#' + el[3]).click(function () {
                    $.prettyPhoto.open(el[1], el[1], el[1], el[2]);
                    });
                    }
                    );
                    i++

                    }
                    }
                    });*/

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

                    mv = scene.findNode("mainview");
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
                    l01 = scene.findNode("light01");
                    l01dir = l01.get("dir");

                    l01dir.x = x;
                    l01dir.y = y;
                    l01dir.z = z;

                    l01.set("dir", l01dir);
                }
                else if (event.ctrlKey) {
                    mode = (Math.abs(event.clientX - lastX) > Math.abs(event.clientY - lastY)) ? (event.clientX - lastX) : (event.clientY - lastY);
                    mode = (mode > 0) ? 0.1 : -0.1;

                    mv = scene.findNode("mainview");

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

                    l01 = scene.findNode("light01");
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

        var baseDistance = 5.0;
        SceneJS.scene("the-scene").start({
            idleFunc: function () {  // Called continuously, within each interval
                if (refreshData) {
                    var scene = SceneJS.scene("the-scene");
                    var blocchi = scene.findNode("block");
                    blocchi.eachNode(
                        function () {
                            var centro = scene.node("mainview").get("eye");
                            var distance = Math.sqrt(Math.pow(this.get("data").xc - centro.x, 2) + Math.pow(this.get("data").yc - centro.y, 2) + Math.pow(this.get("data").zc - centro.z, 2));
                            distance = distance / baseDistance;
                            var levelToLoad = 0;
                            if (distance > 0) {
                                levelToLoad = Math.floor(Math.log(distance) / Math.LN2);
                                if (levelToLoad < 1) { levelToLoad = 1; }
                                if (levelToLoad > 3) { levelToLoad = 3; }
                            }
                            if (levelToLoad != this.get("data").ActualLevel) {

                                while (!(this.get("data").hasOwnProperty('l' + levelToLoad))) {
                                    levelToLoad--;
                                    if (levelToLoad < 0) break;
                                }
                                if ((levelToLoad >= 0) && (levelToLoad != this.get("data").ActualLevel)) {
                                    this.data("ActualLevel", -1);
                                    while (this.node(0).node(0)._targetNode.children.length > 0) {
                                        this.node(0).node(0)._targetNode.children[0].destroy();
                                    }
                                    /*
                                    this.node(0).node(0).eachNode(
                                        function () {
                                            this.destroy();
                                        },
                                        {
                                            andSelf: false,     // Visit our myLookat node as well
                                            depthFirst: false   // Descend depth-first into tree
                                        }

                                    );
                                    */
                                    for (i = 0; i < this.get("data")['l' + levelToLoad]; i++) {
                                        this.node(0).node(0).add("node",
                                            {
                                                type: "geometry",
                                                stream: (this.get("id") + "_" + i).toString().replace("LoDn", "" + "LoD_" + levelToLoad)
                                                //                                                stream: "./"+ this.get("id")
                                            }
                                        )
                                        if (i == (this.get("data")['l' + levelToLoad] - 1)) {
                                            this.data("ActualLevel", levelToLoad);
                                        }

                                    }
                                }
                            }
                        },
                        {
                            andSelf: false,     // Visit our myLookat node as well
                            depthFirst: false   // Descend depth-first into tree
                        }
                    );
                    refreshData = false;
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










