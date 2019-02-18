// Events functions
$(function () {
    ResizeHeaderLoghi();

    if (Login()) {
        InitializeComponents();
    }
});

$(window).on("resize", function () {
    ResizeHeaderLoghi();
});

// Resize functions
function ResizeHeaderLoghi() {
    var spazioPerLoghi = $(window).width();
    if (_validUser) {
        spazioPerLoghi -= $("#userContainer").outerWidth() + $("#logoutButton").outerWidth();
    }

    if (spazioPerLoghi <= 160) {
        $("#logo3DSurveySmall").hide();
        $("#logo3DSurveyLarge").hide();
        $("#logoPolimiSmall").hide();
        $("#logoPolimiLarge").hide();
    }
    else if (spazioPerLoghi <= 226) {
        $("#logo3DSurveySmall").show();
        $("#logo3DSurveyLarge").hide();
        $("#logoPolimiSmall").hide();
        $("#logoPolimiLarge").hide();
    }
    else if (spazioPerLoghi <= 551) {
        $("#logo3DSurveySmall").show();
        $("#logo3DSurveyLarge").hide();
        $("#logoPolimiSmall").show();
        $("#logoPolimiLarge").hide();
    }
    else if (spazioPerLoghi <= 691) {
        $("#logo3DSurveySmall").hide();
        $("#logo3DSurveyLarge").show();
        $("#logoPolimiSmall").show();
        $("#logoPolimiLarge").hide();
    }
    else if (spazioPerLoghi > 691) {
        $("#logo3DSurveySmall").hide();
        $("#logo3DSurveyLarge").show();
        $("#logoPolimiSmall").hide();
        $("#logoPolimiLarge").show();
    }
}

// Login functions
/**
 * @return {boolean}
 */
function Login() {
    function SetLoginDialog() {
        function OnLoginSubmit() {
            $("#loginForm").trigger("submit");
        }

        function LoginDialog_SetOnKeyUp() {
            $("#password").on("keyup", function (event) {
                if (event.key === "Enter") {
                    OnLoginSubmit();
                }
            });

            $("#username").on("keyup", function (event) {
                if (event.key === "Enter") {
                    OnLoginSubmit();
                }
            });
        }

        var html;
        html = '<form id="loginForm" method="post" action="./">';
        html += '   <div class="loginField">';
        html += '       <label for="username">User:</label><br/>';
        html += '       <input id="username" type="text" name="username" value="" placeholder="username">';
        html += '   </div>';
        html += '   <div class="loginField">';
        html += '       <label for="password">Password:</label><br/>';
        html += '       <input id="password" type="password" name="password" value="" placeholder="password">';
        html += '   </div>';
        html += '</form>';

        var loginDialog = $('#loginDialog');
        loginDialog.kendoDialog({
            width: "250px",
            title: "Login board",
            closable: false,
            modal: true,
            content: html,
            actions: [
                {text: 'LOGIN', primary: true, action: OnLoginSubmit}
            ]
        });

        loginDialog.parents(".k-widget").addClass("windowTitle windowIcon loginDialogTitle loginDialogIcon");

        LoginDialog_SetOnKeyUp();

        return loginDialog;
    }

    if (!_validUser) {
        var loginDialog = SetLoginDialog();
        loginDialog.data("kendoDialog").open();

        return false;
    }
    return true;
}

// Components
function InitializeComponents() {
    function SetSearchForm() {
        function CreateSearchFormCombobox() {
            function CreateCombobox(field, label) {
                function SearchFormCombobox_OnChange(event) {
                    UpdateSearchFormCombobox(event.sender.element[0].id.substr(6));
                }

                $("#select" + field).kendoComboBox({
                    filter: "contains",
                    suggest: true,
                    placeholder: "Select " + label + "...",
                    dataTextField: field,
                    dataValueField: field,
                    change: SearchFormCombobox_OnChange
                }).data("kendoComboBox");
            }

            CreateCombobox("Layer0", _layer0Label);
            CreateCombobox("Layer1", _layer1Label);
            CreateCombobox("Layer2", _layer2Label);
            CreateCombobox("Layer3", _layer3Label);
            CreateCombobox("Name", _nomeLabel);
            CreateCombobox("Versione", _versionLabel);
        }

        function UpdateSearchFormCombobox(senderId) {
            $.ajax({
                type: 'GET',
                url: 'php/getListLayersAndName.php',
                dataType: "json",
                data: {
                    senderId: senderId,
                    layer0: $("#selectLayer0").data("kendoComboBox").value(),
                    layer1: $("#selectLayer1").data("kendoComboBox").value(),
                    layer2: $("#selectLayer2").data("kendoComboBox").value(),
                    layer3: $("#selectLayer3").data("kendoComboBox").value(),
                    nome: $("#selectName").data("kendoComboBox").value(),
                    version: $("#selectVersione").data("kendoComboBox").value()
                },
                success: function (resultData) {
                    for (var field in resultData) {
                        var combo = $("#select" + field).data("kendoComboBox");
                        combo.setDataSource();
                        $(resultData[field]).each(function (key, item) {
                            combo.dataSource.add(item);
                        });
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                    alert("Unexpected error during the update of the search fields.");
                }
            });
        }

        CreateSearchFormCombobox();

        UpdateSearchFormCombobox();
    }

    function SetSearchResultGrid() {

        function SetGridColumnTitles() {
            $.ajax({
                type: 'GET',
                url: "php/getGridHeaderTitles.php",
                dataType: "json",
                success: function (gridHeaderTitles) {
                    $("#gridResult").data("kendoGrid").setOptions({
                        columns: [
                            {field: "CodiceOggetto", title: "Object id", width: 50},
                            {field: "CodiceVersione", title: "Version id", width: 50},
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
                    var yourObjectList = data.objectList;

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
            dataBound: function (e) {
                //toggleScrollbar(e);
            },
            mobile: false,
            editable: {
                mode: "inline",
                confirmation: false
            },
            remove: function (e) {
                RemoveImportObject(e.model.CodiceVersione);
            }
        });

        LoadUserListGrid();
    }

    SetSearchForm();

    SetSearchResultGrid();
}