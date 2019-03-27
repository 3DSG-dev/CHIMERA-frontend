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
    var portingWidth = $(window).width();
    var portingHeight = $(window).height();

    var width = portingWidth - 10;
    var maxWidth = true;
    if (width > 555) {
        width = width > 815 ? 760 : 500;
        maxWidth = false;
    }
    var height = portingHeight - 30;
    if (height > 450) {
        height -= height > 720 ? 150 : 90;
    }

    $("#informationWindow").data("kendoWindow").wrapper.css({
        width: width,
        height: height,
        top: (portingHeight - height) * 3 / 4,
        right: maxWidth ? "auto" : 55,
        left: "auto"
    });

    ChangeInformationFieldsStyle();
}

function ChangeInformationFieldsStyle(recompute) {
    /**
     * @return {boolean}
     */
    function SwitchFieldStyle(recompute) {
        /**
         * @return {boolean}
         */
        function SwitchFieldStyleClass(addLabel, removeLabel, addInput, removeInput, recompute) {
            if (!$("#infoCategoryContainer .labelContainer").hasClass(addLabel) || recompute === true) {
                $(".informationFieldContainer .labelContainer").removeClass(removeLabel).addClass(addLabel);
                $(".informationFieldContainer .k-textbox").removeClass(removeInput).addClass(addInput);
                $(".informationFieldContainer .k-widget").removeClass(removeInput).addClass(addInput);
                $(".informationFieldContainer .inputCheckboxContainer").removeClass(removeInput).addClass(addInput);

                return true;
            }
        }

        if ($("#informationObjectTab").width() > 710) {
            return SwitchFieldStyleClass("labelInline", "labelMultiline", "inputInline", "inputMultiline", recompute);
        }
        else {
            return SwitchFieldStyleClass("labelMultiline", "labelInline", "inputMultiline", "inputInline", recompute);
        }
    }

    function SwitchBoxedStyle(recompute) {
        function SetTwoColumnsBoxedStyle(informationTab) {
            var leftHeight = 0;
            var rightHeight = 0;
            $("#" + informationTab).children(".sheetBoxedContainer").each(function () {
                var sheet = $(this);
                var sheetHeight = sheet.outerHeight(true);
                var addClass = "sheetBoxedColumnLeft";
                if (rightHeight < leftHeight) {
                    rightHeight += sheetHeight;
                    addClass = "sheetBoxedColumnRight"
                }
                else {
                    rightHeight -= leftHeight;
                    leftHeight = sheetHeight;
                }
                sheet.removeClass("sheetBoxedColumnLeft sheetBoxedColumnRight").addClass(addClass);
            })
        }

        if ($("#informationObjectTab").width() > 400) {
            if (recompute === true || !$("#infoCategoryContainer").hasClass("sheetBoxedColumnRight")) {
                SetTwoColumnsBoxedStyle("informationObjectTab");
                SetTwoColumnsBoxedStyle("informationVersionTab");
                SetTwoColumnsBoxedStyle("informationSubVersionTab");
            }
        }
        else if ($("#infoCategoryContainer").hasClass("sheetBoxedColumnRight")) {
            $(".informationWindowTabItem .sheetBoxedContainer").removeClass("sheetBoxedColumnLeft sheetBoxedColumnRight");
        }
    }

    var fieldStyleChanged = SwitchFieldStyle(recompute);
    SwitchBoxedStyle(fieldStyleChanged || recompute);
}

function ChangeObjectsGridAlignment() {
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
        url: 'php/getImportList.php',
        dataType: "json",
        success: function (resultData) {
            SetObjectGridDataSource(resultData["objectList"]);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            alert("Unexpected error while loading import list!");
        }
    });
}

function SearchObjects() {
    $.ajax({
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
            alert("Unexpected error while searching objects!");
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
            alert("Unexpected error while adding object to your list!");
        }
    });
}

function ChangeWriteMode(codiceVersione, rw) {
    $.ajax({
        url: 'php/removeFromImportListCodice.php',
        dataType: "json",
        data: {
            codiceVersione: codiceVersione
        },
        success: function (resultData) {
            if (resultData === "ok") {
                $.ajax({
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
                        alert("Unexpected error while adding object to your list!");
                    }
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            alert("Unexpected error while removing object to your list!");
        }
    });
}

function RemoveFromYourList(codiceVersione) {
    $.ajax({
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
            alert("Unexpected error while removing object to your list!");
        }
    });
}

// Information
/**
 * @return {string}
 */
function GetLocaleDateTime(data) {
    return data != null ? GetDateTime(data).toLocaleString() : "";
}

/**
 * @return {string}
 */
function GetDateTime(data) {
    return data != null ? new Date(Date.parse(data.replace(" ", "T").substring(0, data.length - 3))) : "";
}

/**
 * @return {string}
 */
function GetLocaleDate(data) {
    return data != null ? new Date(Date.parse(data.replace(" ", "T").substring(0, data.length - 3))).toLocaleDateString() : "";
}

function SetDynamicInformationFields() {
    function UpdateCategoryList() {
        $.ajax({
            url: './php/getCategoryList.php',
            dataType: "json",
            success: function (resultData) {
                var categoryCombo = $("#infoCategory").data("kendoComboBox");
                categoryCombo.setDataSource(resultData["categoryList"]);
                categoryCombo.dataSource.group({field: "GruppoCategoria"});
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                alert("Unexpected error during the update of the category list!");
            }
        });
    }

    function CreateDynamicInformationFields() {
        var children = $("#informationObjectTab").children();
        children.splice(0, 2);
        children.each(function () {
            this.remove();
        });

        function CreateInformationFieldSingleTab(fieldsList, destinationTab) {
            /**
             * @return {string}
             */
            function OpenCurrentSheet(currentScheda, titolo) {
                var html = "";
                if (currentScheda !== -1) {
                    html += '                    <div class="sheetBoxedContainer">\n';
                    html += '                        <h3 class="sheetTitle">' + titolo + '</h3>\n';
                }
                return html;
            }

            /**
             * @return {string}
             */
            function CloseCurrentSheet(currentScheda) {
                var html = "";
                if (currentScheda !== -1) {
                    html += '                        <div class="buttonContainer">\n';
                    html += '                            <button id="saveInfoObject-' + currentScheda + '" class="buttonBordered" disabled>SAVE</button>\n';
                    html += '                        </div>\n';
                    html += "                    </div>\n";
                }
                return html;
            }

            /**
             * @return {string}
             */
            function AddField(field) {
                var html = "";
                if (field["IsTitle"] === "t") {
                    html += '                        <h4 class="sheetSubTitle">' + field["Campo"] + '</h4>\n';
                }
                else if (field["IsSeparator"] === "t") {
                    html += '                        <hr class="k-separator">\n';
                }
                else if (field["IsBool"] === "t") {
                    html += '                        <div class="informationFieldContainer">\n';
                    html += '                            <div class="labelContainer"><label>' + field["Campo"] + '</label></div>\n';
                    html += '                            <label class="k-checkbox-label" for="' + destinationTab + '_' + field["Codice"] + '"></label>\n';
                    html += '                            <input data-tipoCampo="bool" data-codiceCampo="' + field["Codice"] + '" id="' + destinationTab + '_' + field["Codice"] + '" type="checkbox" class="k-checkbox" />\n';
                    html += '                        </div>\n';
                }
                else {
                    html += '                        <div class="informationFieldContainer">\n';
                    html += '                            <div class="labelContainer"><label for="' + destinationTab + '_' + field["Codice"] + '">' + field["Campo"] + '</label></div>\n';
                    if (field["IsTimestamp"] === "t") {
                        html += '                            <input data-tipoCampo="timestamp" data-codiceCampo="' + field["Codice"] + '" id="' + destinationTab + '_' + field["Codice"] + '">\n';
                    }
                    else if (field["IsInt"] === "t") {
                        html += '                            <input data-tipoCampo="int" data-codiceCampo="' + field["Codice"] + '" id="' + destinationTab + '_' + field["Codice"] + '" type="number">\n';
                    }
                    else if (field["IsReal"] === "t") {
                        html += '                            <input data-tipoCampo="real" data-codiceCampo="' + field["Codice"] + '" id="' + destinationTab + '_' + field["Codice"] + '" type="number">\n';
                    }
                    else if (field["IsCombo"] === "t") {
                        html += '                            <input data-tipoCampo="combo" data-codiceCampo="' + field["Codice"] + '" id="' + destinationTab + '_' + field["Codice"] + '">\n';
                    }
                    else if (field["IsMultiCombo"] === "t") {
                        html += '                            <input data-tipoCampo="multicombo" data-codiceCampo="' + field["Codice"] + '" id="' + destinationTab + '_' + field["Codice"] + '">\n';
                    }
                    else {
                        field["Height"] = field["Height"] / 22;
                        if (field["Height"] > 1) {
                            html += '                            <textarea data-tipoCampo="text" data-codiceCampo="' + field["Codice"] + '" id="' + destinationTab + '_' + field["Codice"] + '" style="height: ' + field["Height"] * 31 + 'px" type="text" class="k-textbox" readonly></textarea>\n';
                        }
                        else {
                            html += '                            <input data-tipoCampo="text" data-codiceCampo="' + field["Codice"] + '" id="' + destinationTab + '_' + field["Codice"] + '" type="text" class="k-textbox" readonly/>\n';
                        }
                    }
                    html += '                        </div>\n';
                }

                return html;
            }

            function InitializeFieldKendoComponents(destinationTab) {
                $("#" + destinationTab).find("input").each(function (i, inputField) {
                    var tipoCampo = inputField.dataset["tipocampo"];
                    var inputFieldSel = $(inputField);
                    switch (tipoCampo) {
                        case "timestamp":
                            inputFieldSel.kendoDateTimePicker({
                                timeFormat: "HH:mm",
                                format: "dd/MM/yy HH:mm",
                                parseFormats: ["dd/MM/yy hh:mm:ss", "dd/MM/yy HH:mm:ss", "dd/MM/yy hh:mm", "dd/MM/yy HH:mm", "dd/MM/yy", "HH:mm"]
                            });
                            inputFieldSel.data("kendoDateTimePicker").readonly();
                            break;
                        case "int":
                            inputFieldSel.kendoNumericTextBox({
                                decimals: 0,
                                restrictDecimals: true,
                                step: 1,
                                format: "0"
                            });
                            inputFieldSel.data("kendoNumericTextBox").readonly();
                            break;
                        case "real":
                            inputFieldSel.kendoNumericTextBox({
                                decimals: 13,
                                step: 0.001,
                                format: "0.#########"
                            });
                            inputFieldSel.data("kendoNumericTextBox").readonly();
                            break;
                        case "combo":
                            inputFieldSel.kendoDropDownList({
                                dataTextField: "text",
                                dataValueField: "value"
                            });
                            inputFieldSel.data("kendoDropDownList").readonly();
                            break;
                        case "multicombo":
                            /*inputFieldSel.kendoMultiSelect({
                                autoClose: false
                            }).data("kendoMultiSelect").readOnly();
                            inputFieldSel.data("kendoMultiSelect").readonly();*/
                            break;
                    }
                });
            }

            var html = "";
            var currentScheda = -1;
            $.each(fieldsList, function (key, field) {
                if (currentScheda !== field["CodiceTitolo"]) {
                    html += CloseCurrentSheet(currentScheda);
                    currentScheda = field["CodiceTitolo"];
                    html += OpenCurrentSheet(currentScheda, field["Titolo"]);
                }
                html += AddField(field);
            });

            html += CloseCurrentSheet(currentScheda);
            $("#" + destinationTab).append(html);

            InitializeFieldKendoComponents(destinationTab);
        }

        $.ajax({
            url: './php/getInformationFields.php',
            dataType: "json",
            success: function (resultData) {
                CreateInformationFieldSingleTab(resultData["SchedeOggetto"], "informationObjectTab");

                ChangeInformationFieldsStyle(true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                alert("Unexpected error while creating dynamic object information fields!");
            }
        });
    }

    ResetInformation();

    UpdateCategoryList();

    CreateDynamicInformationFields();
}

function ResetInformation() {
    $("#informationWindowTabControl").find("input, textarea").each(function (i, elem) {
        elem.value = null;
    });

    $("#saveInfoCategory").unbind("click", ChangeCategory);
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
            url: './php/getBaseInformation.php',
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
                alert("Unexpected error while loading base information!");
            }
        });
    }

    function UpdateDynamicInformation(codiceVersione) {
        function SetFieldValue(valueList, destinationTab) {
            $.each(valueList, function (key, value) {
                var fieldControl = $("#" + destinationTab + "_" + value["CodiceCampo"]);
                var tipoCampo = fieldControl[0].dataset["tipocampo"];
                switch (tipoCampo) {
                    case "text":
                        fieldControl.val(value["TextValue"]);
                        break;
                    case "bool":
                        //fieldControl.checked = value["TextValue"] === "t";
                        break;
                    case "timestamp":
                        fieldControl.data("kendoDateTimePicker").value(GetDateTime(value["TimestampValue"]));
                        break;
                    case "int":
                        fieldControl.data("kendoNumericTextBox").value(value["IntValue"]);
                        break;
                    case "real":
                        fieldControl.data("kendoNumericTextBox").value(value["RealValue"]);
                        break;
                }
            });
        }

        $.ajax({
            url: './php/getDynamicInformation.php',
            dataType: "json",
            data: {
                codiceVersione: codiceVersione
            },
            success: function (resultData) {
                SetFieldValue(resultData["InformazioniOggetto"], "informationObjectTab");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                alert("Unexpected error while loading dynamic information!");
            }
        });
    }

    function SetWriteMode(writeMode) {
        function SetWrite(inputField) {
            var tipoCampo = inputField.dataset["tipocampo"];
            switch (tipoCampo) {
                case "text":
                    inputField.removeAttribute("readonly");
                    break;
                case "timestamp":
                    $(inputField).data("kendoDateTimePicker").readonly(false);
                    break;
                case "int":
                    $(inputField).data("kendoNumericTextBox").readonly(false);
                    break;
                case "real":
                    $(inputField).data("kendoNumericTextBox").readonly(false);
                    break;
                case "combo":
                    $(inputField).data("kendoDropDownList").readonly(false);
                    break;
                case "multicombo":
                    //$(inputField).data("kendoMultiSelect").readonly(false);
                    break;
            }
        }

        function SetRead(inputField) {
            var tipoCampo = inputField.dataset["tipocampo"];
            switch (tipoCampo) {
                case "text":
                case "bool":
                    inputField.setAttribute("readonly", true);
                    break;
                case "timestamp":
                    $(inputField).data("kendoDateTimePicker").readonly();
                    break;
                case "int":
                    $(inputField).data("kendoNumericTextBox").readonly();
                    break;
                case "real":
                    $(inputField).data("kendoNumericTextBox").readonly();
                    break;
                case "combo":
                    $(inputField).data("kendoDropDownList").readonly();
                    break;
                case "multicombo":
                    //$(inputField).data("kendoMultiSelect").readonly();
                    break;
            }
        }

        var informationWindowTabControl = $("#informationWindowTabControl");
        informationWindowTabControl.find("input, textarea").each(function (i, inputField) {
            if (inputField.dataset["tipocampo"]) {
                if (writeMode) {
                    SetWrite(inputField);
                }
                else {
                    SetRead(inputField);
                    inputField.setAttribute("readonly", true);
                }
            }
        });
        informationWindowTabControl.find("button").each(function (i, saveButton) {
            if (writeMode) {
                saveButton.removeAttribute("disabled");
            }
            else {
                saveButton.setAttribute("disabled", true);
            }
        });
    }

    ResetInformation();
    UpdateBaseInformation(codiceVersione);
    UpdateDynamicInformation(codiceVersione);

    var writeMode = readonly === "f";
    $("#informationReadOnlySwitch").data("kendoSwitch").check(writeMode);
    SetWriteMode(writeMode);

    $("#saveInfoCategory").bind("click", ChangeCategory);
}

function ChangeCategory() {
    if ($("#informationReadOnlySwitch").data("kendoSwitch").check()) {
        var categoryCombo = $("#infoCategory").data("kendoComboBox");
        $.ajax({
            url: './php/setCategory.php',
            dataType: "json",
            data: {
                codiceOggetto: $("#infoCodiceOggetto").val(),
                codiceCategoria: categoryCombo.select() !== -1 ? categoryCombo.value() : "null"
            },
            success: function () {
                alert("Category changed");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                alert("Unexpected error while change object category!");
            }
        });
    }
    else {
        alert("Can't change category in read only mode!");
    }
}

// Components
function InitializeComponents() {
    function Windows_OnOpen() {
        _openedWindows++;

        ChangeObjectsGridAlignment();
    }

    function Windows_OnClose() {
        _openedWindows--;

        ChangeObjectsGridAlignment();
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
                url: './php/getListLayersAndName.php',
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
                    alert("Unexpected error during the update of the search fields!");
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
        function InformationWindow_OnResize() {
            ChangeInformationFieldsStyle();
        }

        function InformationWindowTabControl_OnShow() {
            ChangeInformationFieldsStyle(true);
        }

        function SetInformationTabControl() {
            $("#informationWindowTabControl").kendoTabStrip({
                animation: {
                    open: {effects: "fadeIn"}
                },
                show: InformationWindowTabControl_OnShow
            });
        }

        function AddReadWriteControl() {
            var html;
            html = '<div class="readOnlySwitchContainer">';
            html += '    <span class="readOnlySwitchLabel">Read</span>';
            html += '            <input type="checkbox" id="informationReadOnlySwitch">';
            html += '    <span class="readOnlySwitchLabel">Write</span>';
            html += '</div>';

            $(".informationWindowTitle").prepend(html);
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

            SetInformationCategorySheet();
        }

        var informationWindow = $("#informationWindow");
        informationWindow.removeClass("fixedPosition");

        informationWindow.kendoWindow({
            title: "Information",
            minWidth: 350,
            minHeight: 200,
            visible: false,
            resizable: true,
            open: Windows_OnOpen,
            close: Windows_OnClose,
            resize: InformationWindow_OnResize
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