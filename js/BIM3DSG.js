var MiaLayer0List = [];
var MiaLayer1List = [];
var MiaLayer2List = [];
var MiaLayer3List = [];
var MiaNomeList = [];
var MiaGroupList = [];

// Events functions
$(document).ready(function () {
    function SetEventHandler_OnReady() {
        function SetToolbarEvents() {
            $("#openInformationWindowBtn").unbind('click').bind('click', function (e) {
                OpenInfoWindow();
            });
        }

        SetToolbarEvents();
    }

    ResizeHeaderLoghi();
    SetInfoWindow();
    SetEventHandler_OnReady();
    Login();
});

$(window).resize(function () {
    ResizeHeaderLoghi();
    ResizeInfoWindow();
});


// Resize functions
function ResizeHeaderLoghi() {
    var spazioPerLoghi = $(window).width() - $("#userContainer").outerWidth() - $("#logoutContainer").outerWidth();

    // quando lo spazio per entrambi i loghi small non è abbastanza
    if (spazioPerLoghi <= 200) {
        $("#logo3DSurveySmall").hide();
        $("#logo3DSurveyLarge").hide();
        $("#logoPolimiSmall").hide();
        $("#logoPolimiLarge").hide();
    }
    // quando basta lo spazio solo per il logo 3dsurvey SMALL (138px) <226
    else if (spazioPerLoghi <= 226) {
        $("#logo3DSurveySmall").show();
        $("#logo3DSurveyLarge").hide();
        $("#logoPolimiSmall").hide();
        $("#logoPolimiLarge").hide();

        // quando basta lo spazio solo per il logo 3dsurvey SMALL e Poli SMALL 138+68 < 551
    } else if (spazioPerLoghi <= 551) {
        $("#logo3DSurveySmall").show();
        $("#logo3DSurveyLarge").hide();
        $("#logoPolimiSmall").show();
        $("#logoPolimiLarge").hide();

        // quando basta lo spazio solo per il logo 3dsurvey BIG e Poli SMALL < 691
    } else if (spazioPerLoghi <= 691) {
        $("#logo3DSurveySmall").hide();
        $("#logo3DSurveyLarge").show();
        $("#logoPolimiSmall").show();
        $("#logoPolimiLarge").hide();

        // quando basta lo spazio per entrambi i loghi BIG < 691
    } else if (spazioPerLoghi > 691) {
        $("#logo3DSurveySmall").hide();
        $("#logo3DSurveyLarge").show();
        $("#logoPolimiSmall").hide();
        $("#logoPolimiLarge").show();
    }
}
function ResizeInfoWindow() {

    var widthScreen = $(window).width();
    $("#infoWindow").data("kendoWindow").center();

    if (widthScreen < 500) {
        $("#infoWindow").data("kendoWindow").wrapper.css({width: (widthScreen)});
    }
    else {
        $("#infoWindow").data("kendoWindow").wrapper.css({width: (widthScreen <= 700 ? 500 : 700)});
    }
}

function SetSearchResultGrid () {

    function SetGridColumnTitles() {
        $.ajax({
            type: 'GET',
            url: "php/getGridHeaderTitles.php",
            dataType: "json",
            success: function (gridHeaderTitles) {
                $("#gridResult").data("kendoGrid").setOptions({
                    columns: [
                        {field: "CodiceOggetto", title: "Object id", width:50},
                        {field: "CodiceVersione", title: "Version id", width:50},
                        {field: "Layer0", title: gridHeaderTitles[0], width: 50},
                        {field: "Layer1", title: gridHeaderTitles[1], width: 50},
                        {field: "Layer2", title: gridHeaderTitles[2], width: 50},
                        {field: "Layer3", title: gridHeaderTitles[3], width: 50},
                        {field: "Name", title: gridHeaderTitles[4], width: 50},
                        {field: "Version", title: gridHeaderTitles[5], width: 50},
                        {
                            field: "readonly",
                            title: "Write",
                            width: 30,
                            template: "#= readonly ? '<span class=\"k-icon k-i-check main-color\"></span>' : '' #",
                            attributes: {
                                "class": "writeReadFlagCell",
                                style: "text-align: center;"
                            }
                        },
                        {
                            title: "Remove", width: 30,
                            command: [{
                                name: "destroy",
                                template: '<a data-command="destroy" class="k-button k-grid-delete avoid-k-button-style"><span class="k-icon k-i-close"></span></a>'
                            }]
                        }
                    ]
                }, 100);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si è verificato un errore nel leggere i titoli di colonna.");
            }
        });
    }
    function LoadUserListGrid() {
        $.ajax({
            type: 'GET',
            url: 'php/getListaImportazioneUtente.php',
            dataType: "json",
            success: function (objectList) {
                var data = eval(objectList);
                yourObjectList = data.objectList;

                $(yourObjectList).each(function (key, item) {
                    $("#gridResult").data("kendoGrid").dataSource.add(item);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si è verificato un errore.");
            }
        });
    }
    function RemoveImportObject(codice) {
        $.ajax({
            type: 'POST',
            url: 'php/removeOggettoImportazione.php',
            dataType: "text",
            data: {
                codiceVersione: codice
            },
            success: function () {
                //alert("Oggetto correttamente eliminato");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si è verificato un errore.");
            }
        });

    }
    /*function toggleScrollbar(e) {
        var gridWrapper = e.sender.wrapper;
        var gridDataTable = e.sender.table;
        var gridDataArea = gridDataTable.closest(".k-grid-content");


        if ($("#UploadWindow").height() > $("#grid").height()) {
            gridWrapper.addClass("no-scrollbar");
        } else {
            gridWrapper.removeClass("no-scrollbar");
        };
    }*/

    SetGridColumnTitles();

    $("#gridResult").kendoGrid({
        dataSource: {
            /*pageSize: 5,*/
            autoSync: true,
            schema: {
                model: {
                    id: "CodiceOggetto",
                    fields: {
                        CodiceOggetto: {type: "number"},
                        CodiceVersione: {type: "number"},
                        Layer0: {type: "string"},
                        Layer1: {type: "string"},
                        Layer2: {type: "string"},
                        Layer3: {type: "string"},
                        Nome: {type: "string"},
                        Version: {type: "string"},
                        readonly: {type: "boolean"}
                    }
                }
            }
        },
        sortable: {
            mode: "single",
            allowUnsort: false
        },
        pageable: false,
        scrollable: true,
        height: 300,
        resizable: true,
        dataBound:  function(e) {
            //toggleScrollbar(e);
        },
        mobile: false,
        editable: {
            mode: "inline",
            confirmation: false
        },
        remove: function(e) {
            RemoveImportObject(e.model.CodiceVersione);
        }
    });

    LoadUserListGrid();
}

function SetComboboxes () {

    $("#ctrSelectLayer0").bind("tap", TapHandlerLayer0);
    $("#ctrSelectLayer1").bind("tap", TapHandlerLayer1); // dovrebbe attivarsi solo scrivendo nel combobox

    function onChangeLayer_refreshComboboxes() {
        $("#selectLayer0").data("kendoComboBox").setDataSource();
        $("#selectLayer0").data("kendoComboBox").refresh();
        TapHandlerLayer0();

        $("#selectLayer1").data("kendoComboBox").setDataSource();
        $("#selectLayer1").data("kendoComboBox").refresh();
        TapHandlerLayer1();

        $("#selectLayer2").data("kendoComboBox").setDataSource();
        $("#selectLayer2").data("kendoComboBox").refresh();
        TapHandlerLayer2();

        $("#selectLayer3").data("kendoComboBox").setDataSource();
        $("#selectLayer3").data("kendoComboBox").refresh();
        TapHandlerLayer3();

        $("#selectNome").data("kendoComboBox").setDataSource();
        $("#selectNome").data("kendoComboBox").refresh();
        TapHandlerNome();
    }

    function TapHandlerLayer0(event) {
        $.ajax({
            type: 'GET',
            url: 'php/getElementiModelloPerCombo.php',
            dataType: "json",
            data: {
                campo: "Layer0",
                layer1: $("#selectLayer1").data("kendoComboBox").value(),
                layer2: $("#selectLayer2").data("kendoComboBox").value(),
                layer3: $("#selectLayer3").data("kendoComboBox").value(),
                nome: $("#selectNome").data("kendoComboBox").value(),
            },
            success: function (layerlist) {
                var data = eval(layerlist);
                MiaLayer0List = data.layerlist;
                $(MiaLayer0List).each(function (key, item) {
                    $("#selectLayer0").data("kendoComboBox").dataSource.add(item);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si è verificato un errore.");
            }
        });
    }

    // create DropDownList from input HTML element
    $("#selectLayer0").kendoComboBox({
        filter: "contains",
        suggest: true,
        placeholder: "Select layer...",
        dataTextField: "Layer0",
        dataValueField: "Layer0",
        change: onChangeLayer_refreshComboboxes
    }).data("kendoComboBox");

    function TapHandlerLayer1(event) {
        $.ajax({
            type: 'GET',
            url: 'php/getElementiModelloPerCombo.php',
            dataType: "json",
            data: {
                campo: "Layer1",
                layer0: $("#selectLayer0").data("kendoComboBox").value(),
                layer2: $("#selectLayer2").data("kendoComboBox").value(),
                layer3: $("#selectLayer3").data("kendoComboBox").value(),
                nome: $("#selectNome").data("kendoComboBox").value(),
            },
            success: function (layerlist) {
                var data = eval(layerlist);
                MiaLayer1List = data.layerlist;
                $(MiaLayer1List).each(function (key, item) {
                    $("#selectLayer1").data("kendoComboBox").dataSource.add(item);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si è verificato un errore.");
            }
        });
    }

    // create DropDownList from input HTML element
    $("#selectLayer1").kendoComboBox({
        filter: "contains",
        suggest: true,
        placeholder: "Select layer...",
        dataTextField: "Layer1",
        dataValueField: "Layer1",
        change: onChangeLayer_refreshComboboxes
    }).data("kendoComboBox");

    function TapHandlerLayer2(event) {
        $.ajax({
            type: 'GET',
            url: 'php/getElementiModelloPerCombo.php',
            dataType: "json",
            data: {
                campo: "Layer2",
                layer0: $("#selectLayer0").data("kendoComboBox").value(),
                layer1: $("#selectLayer1").data("kendoComboBox").value(),
                layer3: $("#selectLayer3").data("kendoComboBox").value(),
                nome: $("#selectNome").data("kendoComboBox").value(),
            },
            success: function (layerlist) {
                var data = eval(layerlist);
                MiaLayer2List = data.layerlist;
                $(MiaLayer2List).each(function (key, item) {
                    $("#selectLayer2").data("kendoComboBox").dataSource.add(item);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si è verificato un errore.");
            }
        });
    }

    // create DropDownList from input HTML element
    $("#selectLayer2").kendoComboBox({
        filter: "contains",
        suggest: true,
        placeholder: "Select layer...",
        dataTextField: "Layer2",
        dataValueField: "Layer2",
        change: onChangeLayer_refreshComboboxes
    }).data("kendoComboBox");

    function TapHandlerLayer3(event) {
        $.ajax({
            type: 'GET',
            url: 'php/getElementiModelloPerCombo.php',
            dataType: "json",
            data: {
                campo: "Layer3",
                layer0: $("#selectLayer0").data("kendoComboBox").value(),
                layer1: $("#selectLayer1").data("kendoComboBox").value(),
                layer2: $("#selectLayer2").data("kendoComboBox").value(),
                nome: $("#selectNome").data("kendoComboBox").value(),
            },
            success: function (layerlist) {
                var data = eval(layerlist);
                MiaLayer3List = data.layerlist;
                $(MiaLayer3List).each(function (key, item) {
                    $("#selectLayer3").data("kendoComboBox").dataSource.add(item);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si è verificato un errore.");
            }
        });
    }

    // create DropDownList from input HTML element
    $("#selectLayer3").kendoComboBox({
        filter: "contains",
        suggest: true,
        placeholder: "Select layer...",
        dataTextField: "Layer3",
        dataValueField: "Layer3",
        change: onChangeLayer_refreshComboboxes
    }).data("kendoComboBox");

    function TapHandlerNome(event) {
        $.ajax({
            type: 'GET',
            url: 'php/getElementiModelloPerCombo.php',
            dataType: "json",
            data: {
                campo: "Name",
                layer0: $("#selectLayer0").data("kendoComboBox").value(),
                layer1: $("#selectLayer1").data("kendoComboBox").value(),
                layer2: $("#selectLayer2").data("kendoComboBox").value(),
                layer3: $("#selectLayer3").data("kendoComboBox").value(),
            },
            success: function (layerlist) {
                var data = eval(layerlist);
                MiaNomeList = data.layerlist;
                $(MiaNomeList).each(function (key, item) {
                    $("#selectNome").data("kendoComboBox").dataSource.add(item);
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert("Si è verificato un errore.");
            }
        });
    }

    // create DropDownList from input HTML element
    $("#selectNome").kendoComboBox({
        filter: "contains",
        suggest: true,
        placeholder: "Select layer...",
        dataTextField: "Name",
        dataValueField: "Name",
        change: onChangeLayer_refreshComboboxes
    }).data("kendoComboBox");


    TapHandlerLayer0();
    TapHandlerLayer1();
    TapHandlerLayer2();
    TapHandlerLayer3();
    TapHandlerNome();
}

function SetInfoWindow() {

    function SetInfoWindowTabstrip () {
        $("#infoWindowTabstrip").kendoTabStrip({
            animation:  {
                open: {
                    effects: "fadeIn"
                }
            }
        });
    }

    $("#infoWindow").kendoWindow({
        title: "Information board",
        width: 700,
        minWidth: 280,
        visible: false,
        resizable: true
    }).data("kendoWindow").center();

    $('#infoWindow').prev(".k-window-titlebar").addClass("information-window-titlebar");

    SetInfoWindowTabstrip ();
}


function OpenInfoWindow() {
    $("#infoWindow").data("kendoWindow").open();
}


// Login functions
function Login() {
    if ($("#actualUser").text() == "") {
        SetLoginDialog();
        $('#loginDialog').data("kendoDialog").open();

        function SetLoginDialog() {
            function OnLoginSubmit() {
                $("#loginForm").submit();
            }

            function LoginDialog_OnKeyUp() {
                $("#password").keyup(function (event) {
                    if (event.keyCode == 13) {
                        $(".loginboard-title .k-primary").click();
                    }
                });

                $("#username").keyup(function (event) {
                    if (event.keyCode == 13) {
                        $(".loginboard-title .k-primary").click();
                    }
                });
            }

            $('#loginDialog').kendoDialog({
                width: "250px",
                title: "Login board",
                closable: false,
                modal: true,
                content: '<form id="loginForm" method="post" action="./">' +
                         '  <div class="user-wrap">' +
                         '    <label for="username" class="login-label" >User:</label><br>' +
                         '    <input type="text" name="user" id="username" class="login-input" value="" placeholder="username">' +
                         '  </div>' +
                         ' <div class="pwd-wrap">' +
                         '    <label for="password" class="login-label">Password:</label><br>' +
                         '    <input type="password" name="pwd" id="password" class="login-input" value="" placeholder="password">' +
                         '  </div>' +
                         '</form>',
                actions: [
                    {text: 'LOGIN', primary: true, action: OnLoginSubmit}
                ]
            });

            $('#loginDialog').parents(".k-widget").addClass("loginboard-title");

            LoginDialog_OnKeyUp();
        }
    } else {
        SetSearchResultGrid ();
        SetComboboxes();
    }
}





