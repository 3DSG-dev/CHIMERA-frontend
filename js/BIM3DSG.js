// Events functions
$(function () {
    ResizeHeaderLoghi();
    getGridObjectListSearchResultHeight();

    if (Login()) {
        InitializeComponents();
    }
});

$(window).on("resize", function () {
    ResizeHeaderLoghi();
    ResizeObjectsGrid();

    getGridObjectListSearchResultHeight();
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

function getGridObjectListSearchResultHeight() {
    var gridResultSpace = $(window).height() - $("#headerContainer").outerHeight() - $(".selectObjectSection").outerHeight() - 70;
    $('.gridObjectListResultColumn').css('height', gridResultSpace);
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

function SearchObjects() {
    $.ajax({
        type: 'GET',
        url: 'php/searchObjects.php',
        dataType: "json",
        data: {
            layer0: $("#selectLayer0").data("kendoComboBox").value(),
            layer1: $("#selectLayer1").data("kendoComboBox").value(),
            layer2: $("#selectLayer2").data("kendoComboBox").value(),
            layer3: $("#selectLayer3").data("kendoComboBox").value(),
            nome: $("#selectName").data("kendoComboBox").value(),
            version: $("#selectVersione").data("kendoComboBox").value()
        },
        success: function (resultData) {
            $("#objectsGrid").data("kendoGrid").setDataSource(new kendo.data.DataSource({data: resultData["objectList"]}));
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            alert("Unexpected error while searching objects.");
        }
    });
}

function SetReadOnlyObjectGrid(item) {
    ChangeWriteMode($('#objectsGrid').data('kendoGrid').dataItem(item.parent().parent()), false);
}

function SetWriteObjectGrid(item) {
    ChangeWriteMode($('#objectsGrid').data('kendoGrid').dataItem(item.parent().parent()), true);
}

function ChangeWriteMode(dataItem, rw) {
    $.ajax({
        type: 'GET',
        url: 'php/removeFromImportListCodice.php',
        dataType: "json",
        data: {
            codiceVersione: dataItem["CodiceVersione"]
        },
        success: function (resultData) {
            if (resultData === "ok") {
                dataItem.set("readonly", null);
                $.ajax({
                    type: 'GET',
                    url: 'php/addImportListCodice.php',
                    dataType: "json",
                    data: {
                        codiceVersione: dataItem["CodiceVersione"],
                        rw: rw
                    },
                    success: function (resultData2) {
                        if (resultData2["addimportcodice"] === "ok") {
                            dataItem.set("readonly", rw ? "f" : "t");
                        }
                        else {
                            if (resultData2["addimportcodice"].substr(0, 10) === "ATTENZIONE") {
                                dataItem.set("readonly", "t");
                            }
                            alert(resultData2["addimportcodice"]);
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                        alert("Unexpected error while adding object to your list");
                    }
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            alert("Unexpected error while removing object to your list");
        }
    });
}

function AddToYourListObjectGrid(item) {
    AddToYourList($('#objectsGrid').data('kendoGrid').dataItem(item.parent().parent()), false);
}

function AddToYourList(dataItem, rw) {
    $.ajax({
        type: 'GET',
        url: 'php/addImportListCodice.php',
        dataType: "json",
        data: {
            codiceVersione: dataItem["CodiceVersione"],
            rw: rw
        },
        success: function (resultData) {
            if (resultData["addimportcodice"] === "ok") {
                dataItem.set("readonly", rw ? "f" : "t");
            }
            else {
                if (resultData["addimportcodice"].substr(0, 10) === "ATTENZIONE") {
                    dataItem.set("readonly", "t");
                }
                alert(resultData["addimportcodice"]);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            alert("Unexpected error while adding object to your list");
        }
    });
}

function RemoveFromYourListObjectGrid(item) {
    RemoveFromYourList($('#objectsGrid').data('kendoGrid').dataItem(item.parent().parent()));
}

function RemoveFromYourList(dataItem) {
    $.ajax({
        type: 'GET',
        url: 'php/removeFromImportListCodice.php',
        dataType: "json",
        data: {
            codiceVersione: dataItem["CodiceVersione"]
        },
        success: function (resultData) {
            if (resultData === "ok") {
                dataItem.set("readonly", null);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            alert("Unexpected error while removing object to your list");
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
                    template: "#= readonly === 'f' ? '<span class=\"k-icon k-i-check\" onclick=\"SetReadOnlyObjectGrid($(this))\"></span>' : '<span class=\"k-icon\" onclick=\"SetWriteObjectGrid($(this))\"></span>' #",
                    attributes: {
                        "class": "writeReadFlagCell",
                        style: "text-align: center;"
                    }
                },
                {
                    field: "readonly",
                    title: "Your List",
                    width: 30,
                    template: "#= readonly == null ? '<span class=\"k-icon k-i-plus\" onclick=\"AddToYourListObjectGrid($(this))\"></span>' : '<span class=\"k-icon k-i-minus\" onclick=\"RemoveFromYourListObjectGrid($(this))\"></span>' #",
                    attributes: {
                        "class": "writeReadFlagCell",
                        style: "text-align: center;"
                    }
                }
            ];
        }

        function AutoFitColumns(event) {
            var grid = event.sender;
            for (var i = 0; i < grid.columns.length; i++) {
                grid.autoFitColumn(i);
            }
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
            editable: false
        });
    }

    SetSearchForm();
    SetObjectsGrid();
}