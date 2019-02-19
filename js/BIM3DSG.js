// Events functions
$(function () {
    ResizeHeaderLoghi();

    if (Login()) {
        InitializeComponents();
    }
});

$(window).on("resize", function () {
    ResizeHeaderLoghi();
    ResizeObjectsGrid();
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

function ResizeObjectsGrid() {
    var objectsGrid = $("#objectsGrid");
    var objectsKendoGrid = objectsGrid.data("kendoGrid");

    objectsKendoGrid.resize();

    var width = kendo.support.scrollbar();
    objectsKendoGrid.columns.forEach(function (col) {
        width += col.width;
    });

    if (width < objectsGrid.parent().width()) {
        objectsGrid.width(width);
    }
    else {
        objectsGrid.css('width', 'auto');
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

//Object Grid Data
function LoadUserListObjectGrid() {
    $.ajax({
        type: 'GET',
        url: 'php/getImportList.php',
        dataType: "json",
        success: function (resultData) {
            $("#objectsGrid").data("kendoGrid").setDataSource(new kendo.data.DataSource({data: resultData["objectList"]}));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            alert("Unexpected error while loading import list.");
        }
    });
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
            CreateCombobox("Name", _nameLabel);
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
                        $("#select" + field).data("kendoComboBox").setDataSource(resultData[field]);
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

    function SetObjectsGrid() {
        function SetColumnsHeader() {
            return [
                {field: "CodiceOggetto", title: "Object id", width: 50},
                {field: "CodiceVersione", title: "Version id", width: 50},
                {field: "Layer0", title: _layer0Label, width: 50},
                {field: "Layer1", title: _layer1Label, width: 50},
                {field: "Layer2", title: _layer2Label, width: 50},
                {field: "Layer3", title: _layer3Label, width: 50},
                {field: "Name", title: _nameLabel, width: 50},
                {field: "Versione", title: _versionLabel, width: 50},
                {
                    field: "readonly",
                    title: "Write",
                    width: 30,
                    template: "#= readonly ? '' : '<span class=\"k-icon k-i-check main-color\"></span>' #",
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
            ];
        }

        function AutoFitColumns(event) {
            var grid = event.sender;
            for (var i = 0; i < grid.columns.length; i++) {
                grid.autoFitColumn(i);
            }
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

        $("#objectsGrid").kendoGrid({
            columns: SetColumnsHeader(),
            dataBound: AutoFitColumns,
            columnResize: ResizeObjectsGrid,
            sortable: {
                mode: "multiple",
                allowUnsort: true,
                showIndexes: true
            },
            pageable: false,
            scrollable: true,
            resizable: true,
            mobile: false,
            editable: false,
            remove: function (e) {
                RemoveImportObject(e.model.CodiceVersione);
            }
        });
    }

    SetSearchForm();
    SetObjectsGrid();
}