//Global vars
var _openedWindows = 0;

// Events functions
$(function () {
    ResizeHeaderLoghi();

    if (Login()) {
        InitializeComponents();
        ResizeComponents();
    }
});

$(window).on("resize", function () {
    ResizeHeaderLoghi();
    ResizeComponents();
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

function ResizeComponents() {
    function ResizeObjectsGridContainer() {
        var availableSpace = $(window).height() - $("#headerContainer").outerHeight() - $(".selectObjectSection").outerHeight();
        if (availableSpace < 200) {
            availableSpace = 200;
        }

        $('#objectsGridContainer').outerHeight(availableSpace);

        ResizeObjectsGrid();
    }

    ResizeObjectsGridContainer();
    ResizeInformationWindow();
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

function ResizeInformationWindow() {
    var width = $(window).width();
    if (width > 500) {
        width = width > 700 ? 700 : 500;
    }

    var informationKendoWindow = $("#informationWindow").data("kendoWindow");
    informationKendoWindow.wrapper.css({width: (width)});
    informationKendoWindow.center();
}

function ChangeInformationFieldsStyle() {
    if ($("#informationWindowTabObject").width() < 600) {
        if (!$("#infoCategory").hasClass("labelMultiline")) {
            $(".informationFieldContainer label").removeClass("labelInline").addClass("labelMultiline");
            $(".informationFieldContainer .k-textbox").removeClass("inputInline").addClass("inputMultiline");
            $(".informationFieldContainer .k-widget").removeClass("inputInline").addClass("inputMultiline");
        }
    }
    else if (!$("#infoCategory").hasClass("labelInline")) {
        $(".informationFieldContainer label").removeClass("labelMultiline").addClass("labelInline");
        $(".informationFieldContainer .k-textbox").removeClass("inputMultiline").addClass("inputInline");
        $(".informationFieldContainer .k-widget").removeClass("inputMultiline").addClass("inputInline");
    }
}

function ObjectsGridChangeAlignment() {
    if (_openedWindows > 0) {
        $("#objectsGrid").css("margin", "0");
    }
    else {
        $("#objectsGrid").css("margin", "0 auto");
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
/**
 * @return {string, null}
 */
function GetDataItemFromVersione(codiceVersione) {
    var dataItem;
    var grid = $("#objectsGrid").data("kendoGrid");
    var items = grid.items();
    for (var i = 0; items.length; i++) {
        dataItem = grid.dataItem(items[i]);
        if (dataItem["CodiceVersione"] === codiceVersione) {
            return dataItem;
        }
    }
    return null;
}

function SetObjectGridDataSource(objectList) {
    $("#objectsGrid").data("kendoGrid").setDataSource(new kendo.data.DataSource({data: objectList}));

    SetDynamicInformationFields();
}

function LoadUserListObjectGrid() {
    $.ajax({
        type: 'GET',
        url: 'php/getImportList.php',
        dataType: "json",
        success: function (resultData) {
            SetObjectGridDataSource(resultData["objectList"]);
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
            SetObjectGridDataSource(resultData["objectList"]);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            alert("Unexpected error while searching objects.");
        }
    });
}

function AddToYourListObjectGrid(event, item) {
    event.stopPropagation();
    AddToYourList($('#objectsGrid').data('kendoGrid').dataItem(item.parent().parent())["CodiceVersione"], false);
}

function ChangeWriteModeObjectGrid(event, item, rw) {
    event.stopPropagation();
    ChangeWriteMode($('#objectsGrid').data('kendoGrid').dataItem(item.parent().parent())["CodiceVersione"], rw);
}

function RemoveFromYourListObjectGrid(event, item) {
    event.stopPropagation();
    RemoveFromYourList($('#objectsGrid').data('kendoGrid').dataItem(item.parent().parent())["CodiceVersione"]);
}

// Your list management
function AddToYourList(codiceVersione, rw) {
    $.ajax({
        type: 'GET',
        url: 'php/addImportListCodice.php',
        dataType: "json",
        data: {
            codiceVersione: codiceVersione,
            rw: rw
        },
        success: function (resultData) {
            var dataItem = GetDataItemFromVersione(codiceVersione);
            if (resultData["addimportcodice"] === "ok") {
                dataItem.set("readonly", rw ? "f" : "t");
            }
            else {
                if (resultData["addimportcodice"].substr(0, 10) === "ATTENZIONE") {
                    dataItem.set("readonly", "t");
                }
                alert(resultData["addimportcodice"]);
            }
            UpdateInformation(dataItem["CodiceVersione"], dataItem["readonly"])
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            alert("Unexpected error while adding object to your list");
        }
    });
}

function ChangeWriteMode(codiceVersione, rw) {
    $.ajax({
        type: 'GET',
        url: 'php/removeFromImportListCodice.php',
        dataType: "json",
        data: {
            codiceVersione: codiceVersione
        },
        success: function (resultData) {
            if (resultData === "ok") {
                $.ajax({
                    type: 'GET',
                    url: 'php/addImportListCodice.php',
                    dataType: "json",
                    data: {
                        codiceVersione: codiceVersione,
                        rw: rw
                    },
                    success: function (resultData2) {
                        var dataItem = GetDataItemFromVersione(codiceVersione);
                        if (resultData2["addimportcodice"] === "ok") {
                            dataItem.set("readonly", rw ? "f" : "t");
                        }
                        else {
                            if (resultData2["addimportcodice"].substr(0, 10) === "ATTENZIONE") {
                                dataItem.set("readonly", "t");
                            }
                            else {
                                dataItem.set("readonly", null);
                            }
                            alert(resultData2["addimportcodice"]);
                        }
                        UpdateInformation(dataItem["CodiceVersione"], dataItem["readonly"])
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        dataItem.set("readonly", null);
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

function RemoveFromYourList(codiceVersione) {
    $.ajax({
        type: 'GET',
        url: 'php/removeFromImportListCodice.php',
        dataType: "json",
        data: {
            codiceVersione: codiceVersione
        },
        success: function (resultData) {
            if (resultData === "ok") {
                var dataItem = GetDataItemFromVersione(codiceVersione);
                dataItem.set("readonly", null);
                UpdateInformation(dataItem["CodiceVersione"], dataItem["readonly"])
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            alert("Unexpected error while removing object to your list");
        }
    });
}

// Information
/**
 * @return {string}
 */
function GetLocaleDateTime(data) {
    return data != null ? new Date(Date.parse(data.replace(" ", "T").substring(0, data.length - 3))).toLocaleString() : "";
}

/**
 * @return {string}
 */
function GetLocaleDate(data) {
    return data != null ? new Date(Date.parse(data.replace(" ", "T").substring(0, data.length - 3))).toLocaleDateString() : "";
}

function SetDynamicInformationFields() {
    UpdateCategoryList();
    ResetInformation();
}

function UpdateCategoryList() {
    $.ajax({
        type: 'GET',
        url: 'php/getCategoryList.php',
        dataType: "json",
        data: {},
        success: function (resultData) {
            var categoryCombo = $("#infoCategory").data("kendoComboBox");
            categoryCombo.setDataSource(resultData["categoryList"]);
            categoryCombo.dataSource.group({field: "GruppoCategoria"});
            categoryCombo.value(null);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            alert("Unexpected error during the update of the category list.");
        }
    });
}

function ResetInformation() {
    $("#informationWindowTabControl").find("input").each(function (i, elem) {
        elem.value = null;
    });
}

function UpdateInformation(codiceVersione, readonly) {
    function UpdateBaseInformation(codiceVersione) {
        /**
         * @return {string}
         */
        function ParseLiveState(live) {
            switch (live) {
                case "0":
                    return "Non attivo";
                case "1":
                    return "Live on-line";
                case "2":
                    return "Live on-line, ma morto (figli non pronti)";
                case "3":
                    return "Modello ancora da creare";
                case "4":
                    return "Inserito da Rhino, da attivare";
                case "5":
                    return "Live on-line e clonato";
                case "6":
                    return "Modello pronto, ma non ancora on-line";
                case "7":
                    return "Live on-line e clonato, ma morto (figli non pronti)";
                case "8":
                    return "Non attivo e clonato";
                default:
                    return live;
            }
        }

        /**
         * @return {string}
         */
        function ParseAreaValue(area) {
            return (area == null || area === 0) ? "Unknown" : area < 0 ? "Computed area untrusted!" : parseFloat(area).toFixed(4) + " m\u00B2";
        }

        /**
         * @return {string}
         */
        function ParseVolumeValue(volume) {
            return (volume == null || volume === 0) ? "Unknown" : volume < 0 ? "Computed volume untrusted!" : parseFloat(volume).toFixed(6) + " m\u00B3";
        }

        $.ajax({
            type: 'GET',
            url: 'php/getBaseInformation.php',
            dataType: "json",
            data: {
                codiceVersione: codiceVersione
            },
            success: function (resultData) {
                $("#infoLayer0").val(resultData["Layer0"]);
                $("#infoLayer1").val(resultData["Layer1"]);
                $("#infoLayer2").val(resultData["Layer2"]);
                $("#infoLayer3").val(resultData["Layer3"]);
                $("#infoName").val(resultData["Name"]);
                $("#infoCreated").val(GetLocaleDateTime(resultData["DataCreazione"]));
                $("#infoRemoved").val(GetLocaleDateTime(resultData["DataEliminazione"]));
                $("#infoCantiereCreazione").val(resultData["CantiereCreazione"] + 1);
                $("#infoCantiereCreazioneInizio").val(GetLocaleDate(resultData["CreazioneDataInizio"]));
                $("#infoCantiereCreazioneFine").val(GetLocaleDate(resultData["CreazioneDataFine"]));
                $("#infoCantiereEliminazione").val(resultData["CantiereEliminazione"]);
                $("#infoCantiereEliminazioneInizio").val(GetLocaleDate(resultData["EliminazioneDataInizio"]));
                $("#infoCantiereEliminazioneFine").val(GetLocaleDate(resultData["EliminazioneDataFine"]));

                $("#infoCategory").data("kendoComboBox").value(resultData["Categoria"]);

                $("#infoCodiceOggetto").val(resultData["CodiceOggetto"]);
                $("#infoCodiceVersione").val(resultData["CodiceVersione"]);
                $("#infoVersione").val(resultData["Versione"]);
                $("#infoOriginale").val(resultData["Originale"]);
                $("#infoCodiceModello").val(resultData["CodiceModello"]);
                $("#infoLive").val(ParseLiveState(resultData["Live"]));
                $("#infoLastUpdateBy").val(resultData["UpdateFullName"] != null ? resultData["UpdateFullName"] : resultData["UpdateUser"]);
                $("#infoLastUpdate").val(GetLocaleDateTime(resultData["UpdateDatetime"]));
                $("#infoLock").val(resultData["LockFullName"] != null ? resultData["LockFullName"] : resultData["LockUser"]);

                $("#infoCodiceModello2").val(resultData["CodiceModello"]);
                $("#infoSuperficie").val(ParseAreaValue(resultData["Superficie"]));
                $("#infoVolume").val(ParseVolumeValue(resultData["Volume"]));
                $("#infoUpdateBy").val(resultData["UpdateModelliFullName"] != null ? resultData["UpdateModelliFullName"] : resultData["UpdateModelliUser"]);
                $("#infoUpdateOn").val(GetLocaleDateTime(resultData["LastUpdate"]));
                $("#infoCenterX").val(resultData["xc"] == null ? "Unknown" : parseFloat(resultData["xc"]).toFixed(2) + " m");
                $("#infoCenterY").val(resultData["yc"] == null ? "Unknown" : parseFloat(resultData["yc"]).toFixed(2) + " m");
                $("#infoCenterZ").val(resultData["zc"] == null ? "Unknown" : parseFloat(resultData["zc"]).toFixed(2) + " m");
                $("#infoRadius").val(resultData["Radius"] == null ? "Unknown" : parseFloat(resultData["Radius"]).toFixed(2) + " m");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                alert("Unexpected error while loading base information");
            }
        });
    }

    UpdateBaseInformation(codiceVersione);
    $("#informationReadOnlySwitch").data("kendoSwitch").check(readonly === "f");
}

// Components
function InitializeComponents() {
    function Windows_OnOpen() {
        _openedWindows++;

        ObjectsGridChangeAlignment();
    }

    function Windows_OnClose() {
        _openedWindows--;

        ObjectsGridChangeAlignment();
    }

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
                    template: "#= readonly === 'f' ? '<span class=\"k-icon k-i-check\" onclick=\"ChangeWriteModeObjectGrid(event,$(this),false)\"></span>' : '<span class=\"k-icon\" onclick=\"ChangeWriteModeObjectGrid(event,$(this),true)\"></span>' #",
                    attributes: {
                        "class": "writeReadFlagCell",
                        style: "text-align: center;"
                    }
                },
                {
                    field: "readonly",
                    title: "Your List",
                    width: 30,
                    template: "#= readonly == null ? '<span class=\"k-icon k-i-plus\" onclick=\"AddToYourListObjectGrid(event,$(this))\"></span>' : '<span class=\"k-icon k-i-minus\" onclick=\"RemoveFromYourListObjectGrid(event,$(this))\"></span>' #",
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

        function ObjectsGrid_OnChange() {
            var selectedObject = this.dataItem(this.select());
            UpdateInformation(selectedObject["CodiceVersione"], selectedObject["readonly"]);
        }

        $("#objectsGrid").kendoGrid({
            columns: SetColumnsHeader(),
            dataBound: AutoFitColumns,
            columnResize: ResizeObjectsGrid,
            change: ObjectsGrid_OnChange,
            sortable: {
                mode: "multiple",
                allowUnsort: true,
                showIndexes: true
            },
            pageable: false,
            scrollable: true,
            resizable: true,
            selectable: "row",
            mobile: false,
            editable: false
        });
    }

    function SetInformationWindow() {
        function SetInformationTabControl() {
            $("#informationWindowTabControl").kendoTabStrip({
                animation: {
                    open: {effects: "fadeIn"}
                }
            });
        }

        function AddReadWriteControl() {
            var htmlReadWriteSwitch;
            htmlReadWriteSwitch = '<div class="readwrite-checkbox">';
            htmlReadWriteSwitch += '    <span class="label_rw">Read</span>';
            htmlReadWriteSwitch += '            <input type="checkbox" id="informationReadOnlySwitch">';
            htmlReadWriteSwitch += '    <span class="label_rw">Write</span>';
            htmlReadWriteSwitch += '</div>';

            $(".informationWindowTitle").prepend(htmlReadWriteSwitch);
            $("#informationReadOnlySwitch").kendoSwitch({
                checked: false,
                change: function (event) {
                    var codiceVersione = $("#infoCodiceVersione").val();
                    if (codiceVersione != null && codiceVersione !== "") {
                        ChangeWriteMode(codiceVersione, event.checked);
                    }
                }
            });
        }

        function SetInformationDefaultSheets() {
            function SetInformationCategorySheet() {
                $("#infoCategory").kendoComboBox({
                    dataTextField: "Nome",
                    dataValueField: "Codice"
                }).data("kendoComboBox");
            }

            function SetInformationWindowProvaCard() {

                // create NumericTextBox from input HTML element
                $("#infoWndProvaCard #selectNumber").kendoNumericTextBox();
                $("#infoWndProvaCard #selectNumberDecimal").kendoNumericTextBox({
                    format: "# Kg",
                    decimals: 3
                });

                // create Timepicker from div HTML element
                $("#infoWndProvaCard #selectDate").kendoDateTimePicker({
                    value: new Date(),
                    dateInput: true
                });

                // create Dropdownlist from div HTML element
                var data = [
                    {text: "Black", value: "1"},
                    {text: "Orange", value: "2"},
                    {text: "Grey", value: "3"}
                ];

                $("#infoWndProvaCard #selectDropDown").kendoDropDownList({
                    dataTextField: "text",
                    dataValueField: "value",
                    dataSource: data
                });
            }

            SetInformationCategorySheet();
            SetInformationWindowProvaCard();
        }

        var informationWindow = $("#informationWindow");
        informationWindow.removeClass("fixedPosition");
        informationWindow.kendoWindow({
            title: "Information",
            width: 700,
            minWidth: 350,
            visible: false,
            resizable: true,
            open: Windows_OnOpen,
            close: Windows_OnClose,
            resize: ChangeInformationFieldsStyle
        }).data("kendoWindow");

        informationWindow.parents(".k-widget").addClass("windowTitle windowIcon informationWindowTitle informationWindowIcon");

        AddReadWriteControl();
        SetInformationTabControl();

        SetInformationDefaultSheets();
    }

    function SetToolbarButtons() {
        $("#informationButton").click(function () {
            var informationKendoWindow = $("#informationWindow").data("kendoWindow");
            if (!informationKendoWindow.options.visible) {
                informationKendoWindow.open();

                ResizeInformationWindow();
                ChangeInformationFieldsStyle();
            }
            else {
                informationKendoWindow.close();
            }
        })
    }

    SetSearchForm();
    SetObjectsGrid();
    SetInformationWindow();
    SetToolbarButtons();
}