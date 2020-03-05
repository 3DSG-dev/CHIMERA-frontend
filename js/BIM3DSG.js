// Constant
const ToRad = Math.PI / 180.0;

// Global vars
var _openedWindows = 0;

// Global model var
var _myScene;
var _resetEye;
var _resetLook;
var _startEye;
var _startLook;
var _startUpZ = 1;
var _pickedObject;

// Global Mouse var
var _isMouseDown = false;
var _leftMouseDown = false;
var _rightMouseDown = false;
var _centerMouseDown = false;
var _mouseStartX;
var _mouseStartY;
var _isDragging = false;
var _contextMenuToDisable = false;
var _dragged = false;

// Global Touch var
var _canvasDiagonal;
var _isTouching = false;
var _touchEventCache = [];
var _startTouchDiff = -1;
var _isTouchPinch = false;
var _isTouchRotate = false;

// Global 3D settings
var _textureEnable = true;
var _addHotSpotMode = false;

// Global select var
var _singleSelecting = true;
var _selected3dObjectList = [];

// Events functions
$(function () {
    window.addEventListener("resize", function () {
        ResizeHeaderLoghi();
        ResizeComponents();
    });
    ResizeHeaderLoghi();

    if (Login()) {
        InitializeComponents();
        ResizeComponents();
    }
});

// Resize functions
function ResizeHeaderLoghi() {
    function ShowHideLoghi(displayLogo3DSurveyLarge, displayLogo3DSurveySmall, displayLogoPolimiLarge, displayLogoPolimiSmall) {
        $("#logo3DSurveyLarge").css("display", displayLogo3DSurveyLarge);
        $("#logo3DSurveySmall").css("display", displayLogo3DSurveySmall);
        $("#logoPolimiLarge").css("display", displayLogoPolimiLarge);
        $("#logoPolimiSmall").css("display", displayLogoPolimiSmall);
    }

    var spazioPerLoghi = $(window).width();
    if (_validUser) {
        spazioPerLoghi -= $("#userContainer").outerWidth() + $("#logoutLinkContainer").outerWidth() + 58;
    }

    if (spazioPerLoghi <= 130) {
        ShowHideLoghi("none", "none", "none", "none");
    } else if (spazioPerLoghi <= 192) {
        ShowHideLoghi("none", "block", "none", "none");
    } else if (spazioPerLoghi <= 515) {
        ShowHideLoghi("none", "block", "none", "block");
    } else if (spazioPerLoghi <= 655) {
        ShowHideLoghi("block", "none", "none", "block");
    } else if (spazioPerLoghi > 655) {
        ShowHideLoghi("block", "none", "block", "none");
    }
}

function ResizeComponents() {
    function ResizeObjectsGridContainer() {
        var availableSpace = $(window).height() - $("#headerContainer").outerHeight() - $("#selectObjectContainer").outerHeight();
        if (availableSpace < 200) {
            availableSpace = 200;
        }

        $('#objectsGridContainer').outerHeight(availableSpace);

        ResizeObjectsGrid();
    }

    ResizeObjectsGridContainer();
    ResizeInformationWindow();
    ResizeModelWindow();
    ResizeGisWindow();
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
    } else {
        objectsGrid.css('width', 'auto');
    }
}

function GetAvailableWindowSize(bigWidth, mediumWidth, bigHeightReduction, mediumHeightReduction) {
    var portingWidth = $(window).width();
    var portingHeight = $(window).height();

    var width = portingWidth - 10;
    var maxWidth = true;
    if (width > mediumWidth + 55) {
        width = width > bigWidth + 55 ? bigWidth : mediumWidth;
        maxWidth = false;
    }
    var height = portingHeight - 30;
    if (height > 450) {
        height -= height > 720 ? bigHeightReduction : mediumHeightReduction;
    }
    return {width, maxWidth, height, portingHeight};
}

function ComputeCanvasDiagonal() {
    var modelCanvas = $("#modelCanvas");
    _canvasDiagonal = ComputeDiagonal(modelCanvas.width(), modelCanvas.height());
}

function SetCssLeftWindow(id) {
    var {width, maxWidth, height, portingHeight} = GetAvailableWindowSize(1000, 740, 120, 90);

    $(id).data("kendoWindow").wrapper.css({
        width: width,
        height: height,
        top: (portingHeight - height) * 3 / 4,
        right: "auto",
        left: maxWidth ? "auto" : 55
    });
}

function ResizeModelWindow() {
    SetCssLeftWindow("#modelWindow");
}

function ResizeGisWindow() {
    SetCssLeftWindow("#gisWindow");
}

function ResizeInformationWindow() {
    var {width, maxWidth, height, portingHeight} = GetAvailableWindowSize(760, 500, 120, 90);

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
                $(".informationFieldContainer .labelCheckboxContainer").removeClass(removeLabel).addClass(addLabel);
                $(".informationFieldContainer .k-textbox").removeClass(removeInput).addClass(addInput);
                $(".informationFieldContainer .k-widget").removeClass(removeInput).addClass(addInput);
                $(".informationFieldContainer .inputCheckboxContainer").removeClass(removeInput).addClass(addInput);
                $(".informationFieldContainer span.k-widget.k-tooltip-validation").removeClass(removeInput).addClass(addInput);
                return true;
            }
        }

        if ($("#informationWindow").width() > 730) {
            return SwitchFieldStyleClass("labelInline", "labelMultiline", "inputInline", "inputMultiline", recompute);
        } else {
            return SwitchFieldStyleClass("labelMultiline", "labelInline", "inputMultiline", "inputInline", recompute);
        }
    }

    function SwitchBoxedStyle(recompute) {
        function SetTwoColumnsBoxedStyle(informationTab) {
            var leftHeight = 0;
            var rightHeight = 0;
            $(informationTab).children(".boxedContainer").each(function (i, sheet) {
                var sheetSel = $(sheet);
                var sheetHeight = sheetSel.outerHeight(true);
                var addClass = "informationColumnLeft";
                if (rightHeight < leftHeight) {
                    rightHeight += sheetHeight;
                    addClass = "informationColumnRight";
                } else {
                    rightHeight -= leftHeight;
                    leftHeight = sheetHeight;
                }
                sheetSel.removeClass("informationColumnLeft informationColumnRight").addClass(addClass);
            })
        }

        if ($("#informationWindow").width() > 420) {
            if (recompute === true || !$("#infoCategoryContainer").hasClass("informationColumnRight")) {
                SetTwoColumnsBoxedStyle("#informationObjectTab");
                SetTwoColumnsBoxedStyle("#informationVersionTab");
                $("#informationSubVersionTab").find("div.subVersionPanelItem").each(function (i, panelItem) {
                    SetTwoColumnsBoxedStyle(panelItem);
                })
            }
        } else if ($("#infoCategoryContainer").hasClass("informationColumnRight")) {
            $(".informationWindowTabItem .boxedContainer").removeClass("informationColumnLeft informationColumnRight");
        }
    }

    var fieldStyleChanged = SwitchFieldStyle(recompute);
    SwitchBoxedStyle(fieldStyleChanged || recompute);
}

function ChangeInformationFieldsStyleFromElement(isMouseUp) {
    if (_isMouseDown) {
        if (isMouseUp) {
            _isMouseDown = false;
        }
        ChangeInformationFieldsStyle(true);
    }
}

function ChangeObjectsGridAlignment() {
    if (_openedWindows > 0) {
        $("#objectsGrid").css("margin", "0");
    } else {
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
            function SubmitOnEnter(event) {
                if (event.key === "Enter") {
                    OnLoginSubmit();
                }
            }

            $("#password").on("keyup", SubmitOnEnter);

            $("#username").on("keyup", SubmitOnEnter);
        }

        var html;
        html = '<form id="loginForm" method="post" action="./">';
        html += '   <div class="dialogFormField">';
        html += '       <label for="username">User:</label><br/>';
        html += '       <input id="username" type="text" name="username" value="" placeholder="username">';
        html += '   </div>';
        html += '   <div class="dialogFormField">';
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
    for (var i = 0; i < items.length; i++) {
        dataItem = grid.dataItem(items[i]);
        if (dataItem["CodiceVersione"] === codiceVersione) {
            return dataItem;
        }
    }
    return null;
}

function SetObjectGridDataSource(objectList) {
    $("#objectsGrid").data("kendoGrid").setDataSource(new kendo.data.DataSource({data: objectList}));

    ProgressBar(false);

    SetDynamicInformationFields();
}

function LoadUserListObjectGrid() {
    ProgressBar(true);

    $.ajax({
        url: 'php/getImportList.php',
        dataType: "json",
        success: function (resultData) {
            SetObjectGridDataSource(resultData);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            ProgressBar(false);
            AlertMessage("Unexpected error while loading import list!", textStatus + "; " + errorThrown);
        }
    });
}

function GetSearchFormComboValues() {
    return {
        layer0: $("#selectLayer0").data("kendoComboBox").value(),
        layer1: $("#selectLayer1").data("kendoComboBox").value(),
        layer2: $("#selectLayer2").data("kendoComboBox").value(),
        layer3: $("#selectLayer3").data("kendoComboBox").value(),
        nome: $("#selectName").data("kendoComboBox").value(),
        versione: $("#selectVersione").data("kendoComboBox").value(),
        includeLayerObjects: $("#includeLayerObjects").prop("checked")
    };
}

function SearchObjects() {
    ProgressBar(true);

    $.ajax({
        url: 'php/searchObjects.php',
        dataType: "json",
        data: GetSearchFormComboValues(),
        success: function (resultData) {
            SetObjectGridDataSource(resultData);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            ProgressBar(false);
            AlertMessage("Unexpected error while searching objects!", textStatus + "; " + errorThrown);
        }
    });
}

function SearchAndAddToTourList() {
    $.ajax({
        url: 'php/addObjectsToYourList.php',
        dataType: "json",
        data: GetSearchFormComboValues(),
        success: SearchObjects,
        error: function (jqXHR, textStatus, errorThrown) {
            AlertMessage("Unexpected error while adding objects to your list!", textStatus + "; " + errorThrown);
        }
    });
}

function GetObjectGridCellValue(item, column) {
    return $('#objectsGrid').data('kendoGrid').dataItem(item.parent().parent())[column];
}

function AddToYourListObjectGrid(event, item) {
    event.stopPropagation();
    AddToYourList(GetObjectGridCellValue(item, "CodiceVersione"), false);
}

function ChangeWriteModeObjectGrid(event, item, rw) {
    event.stopPropagation();
    ChangeWriteMode(GetObjectGridCellValue(item, "CodiceVersione"), rw);
}

function RemoveFromYourListObjectGrid(event, item) {
    event.stopPropagation();
    RemoveFromYourList(GetObjectGridCellValue(item, "CodiceVersione"));
}

function ObjectGridClearSelection() {
    var objectsGrid = $('#objectsGrid').data('kendoGrid');
    objectsGrid.clearSelection();
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
            } else {
                if (resultData["addimportcodice"].substr(0, 10) === "ATTENZIONE") {
                    dataItem.set("readonly", "t");
                }
                kendo.alert(resultData["addimportcodice"]);
            }
            UpdateInformation(dataItem["CodiceVersione"], dataItem["readonly"] !== "f")
        },
        error: function (jqXHR, textStatus, errorThrown) {
            AlertMessage("Unexpected error while adding object to your list!", textStatus + "; " + errorThrown);
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
                        } else {
                            if (resultData2["addimportcodice"].substr(0, 10) === "ATTENZIONE") {
                                dataItem.set("readonly", "t");
                            } else {
                                dataItem.set("readonly", null);
                            }
                            kendo.alert(resultData2["addimportcodice"]);
                        }
                        UpdateInformation(dataItem["CodiceVersione"], dataItem["readonly"] !== "f")
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        dataItem.set("readonly", null);
                        AlertMessage("Unexpected error while adding object to your list!", textStatus + "; " + errorThrown);
                    }
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            AlertMessage("Unexpected error while removing object to your list!", textStatus + "; " + errorThrown);
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
                UpdateInformation(dataItem["CodiceVersione"], dataItem["readonly"] !== "f");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            AlertMessage("Unexpected error while removing object to your list!", textStatus + "; " + errorThrown);
        }
    });
}

function GetWriteMode(codiceVersione) {
    return $.ajax({
        url: "./php/getWriteMode.php",
        dataType: "json",
        data: {
            codiceVersione: codiceVersione
        },
        error: function (jqXHR, textStatus, errorThrown) {
            AlertMessage("Unexpected error while checking write mode!", textStatus + "; " + errorThrown);
        }
    });
}

// Information
function SetDynamicInformationFields() {
    function UpdateCategoryList() {
        $.ajax({
            url: './php/getCategoryList.php',
            dataType: "json",
            success: function (resultData) {
                var categoryCombo = $("#infoCategory").data("kendoDropDownList");
                categoryCombo.setDataSource(resultData);
                categoryCombo.dataSource.group({field: "GruppoCategoria"});
            },
            error: function (jqXHR, textStatus, errorThrown) {
                AlertMessage("Unexpected error during the update of the category list!", textStatus + "; " + errorThrown);
            }
        });
    }

    function CreateDynamicInformationFields() {
        function DeleteDynamicInformationFields() {
            $("#informationSubVersionTab").empty();
            $("#informationWindowTabControl").find("div.boxedContainer").each(function (i, sheet) {
                if (sheet.dataset["codice"] > 0 || sheet.dataset["table"]) {
                    $(sheet).remove();
                }
            });
        }

        function CreateInformationFieldSingleTab(fieldsList, destinationTab) {
            /**
             * @return {string}
             */
            function GenerateControlsHtml(fieldsList, destinationTab) {
                /**
                 * @return {string}
                 */
                function StartSheet(codiceTitolo, titolo) {
                    var html = '                    <div data-codice="' + codiceTitolo + '" class="boxedContainer hidden">\n';
                    html += '                        <h3>' + titolo + '</h3>\n';
                    return html;
                }

                /**
                 * @return {string}
                 */
                function CloseSheet(currentSheet) {
                    var html = "";
                    if (currentSheet !== -1) {
                        html += '                        <div class="buttonContainer">\n';
                        html += '                            <button id="saveInfoObject-' + currentSheet + '" data-codice="' + currentSheet + '" class="buttonBordered" disabled>SAVE</button>\n';
                        html += '                        </div>\n';
                        html += "                    </div>\n";
                    }
                    return html;
                }

                /**
                 * @return {string}
                 */
                function AddField(destinationTab, field) {
                    var html = "";
                    var height;
                    if (field["IsTitle"] === "t") {
                        html += '                        <h4>' + field["Campo"] + '</h4>\n';
                    } else if (field["IsSeparator"] === "t") {
                        html += '                        <hr class="k-separator">\n';
                    } else if (field["IsBool"] === "t") {
                        html += '                        <div class="informationFieldContainer">\n';
                        html += '                            <div class="labelContainer labelCheckboxContainer">' + field["Campo"] + '</div>\n';
                        html += '                            <div class="inputCheckboxContainer">\n';
                        html += '                               <input data-tipo="bool" data-codice="' + field["Codice"] + '" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '" data-role="checkboxinfo" type="checkbox" class="k-checkbox" />\n';
                        html += '                               <label class="k-checkbox-label" for="' + destinationTab + '_' + field["Codice"] + '"></label>\n';
                        html += '                            </div>\n';
                        html += '                        </div>\n';
                    } else {
                        html += '                        <div class="informationFieldContainer">\n';
                        html += '                            <div class="labelContainer"><label for="' + destinationTab + '_' + field["Codice"] + '">' + field["Campo"] + '</label></div>\n';
                        if (field["IsTimestamp"] === "t") {
                            html += '                            <input data-tipo="timestamp" data-codice="' + field["Codice"] + '" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '" name="' + destinationTab + '_' + field["Codice"] + '">\n';
                            html += '                            <span class="k-invalid-msg" data-for="' + destinationTab + '_' + field["Codice"] + '"></span>\n';
                        } else if (field["IsInt"] === "t") {
                            html += '                            <input data-tipo="int" data-codice="' + field["Codice"] + '" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '" type="number">\n';
                        } else if (field["IsReal"] === "t") {
                            html += '                            <input data-tipo="real" data-codice="' + field["Codice"] + '" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '" type="number">\n';
                        } else if (field["IsCombo"] === "t") {
                            html += '                            <select data-tipo="combo" data-codice="' + field["Codice"] + '" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '"></select>\n';
                        } else if (field["IsMultiCombo"] === "t") {
                            html += '                            <select data-tipo="multicombo" data-codice="' + field["Codice"] + '" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '"></select>\n';
                        } else {
                            height = field["Height"] / 22;
                            if (height > 1) {
                                html += '                            <textarea data-tipo="text" data-codice="' + field["Codice"] + '" data-role="textinfo" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '" style="height: ' + height * 31 + 'px" type="text" class="k-textbox" onmousedown="_isMouseDown = true;" onmousemove="ChangeInformationFieldsStyleFromElement(false)" onmouseup="ChangeInformationFieldsStyleFromElement(true)" readonly></textarea>\n';
                            } else {
                                html += '                            <input data-tipo="text" data-codice="' + field["Codice"] + '" data-role="textinfo" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '" type="text" class="k-textbox" readonly/>\n';
                            }
                        }
                        html += '                        </div>\n';
                    }
                    return html;
                }

                var html = "";
                var currentSheet = -1;
                fieldsList.forEach(function (field) {
                    if (currentSheet !== field["CodiceTitolo"]) {
                        html += CloseSheet(currentSheet);
                        currentSheet = field["CodiceTitolo"];
                        html += StartSheet(field["CodiceTitolo"], field["Titolo"]);
                    }
                    html += AddField(destinationTab, field);
                });
                html += CloseSheet(currentSheet);
                return html;
            }

            function InitializeFieldKendoComponents(destinationTabSel) {
                function SortKendoMultiSelectValue() {
                    this.value(this.value().sort());
                }

                /**
                 * @return {string}
                 */
                function AddComboValueHtml(event) {
                    var value = event.instance.input[0].value;
                    var html = "";
                    if (value) {
                        html += '                            <button class="buttonBordered" onclick="AddNewComboValue(\'' + event.instance.element[0].id + '\', \'' + value + '\')">Add new value<br><b>' + value + '</b></button>\n';
                    }
                    return html;
                }

                /**
                 * @return {string}
                 */
                function GetComboTemplate(inputField) {
                    // noinspection JSDeprecatedSymbols
                    return '#:Value#<span class="k-icon k-i-edit buttonDropdownItemEdit" data-codice="#:Codice#" data-value="#:Value#" data-ref="' + inputField.id + '" onclick="ChangeComboValueDialogOpen(event)"></span><span class="k-icon k-i-delete buttonDropdownItemErase" data-codice="#:Codice#" data-value="#:Value#" data-ref="' + inputField.id + '" onclick="RemoveComboValue(event)"></span>';
                }

                destinationTabSel.find("input, select").each(function (i, inputField) {
                    var inputFieldSel = $(inputField);
                    switch (inputField.dataset["tipo"]) {
                        case "timestamp":
                            inputFieldSel.kendoDateTimePicker({
                                timeFormat: "HH:mm",
                                format: "dd/MM/yy HH:mm",
                                parseFormats: ["dd/MM/yyyy HH:mm:ss", "dd/MM/yy HH:mm:ss", "dd/MM/yyyy HH:mm", "dd/MM/yy HH:mm", "dd/MM/yyyy", "dd/MM/yy", "HH:mm"]
                            });
                            inputFieldSel.data("kendoDateTimePicker").readonly();
                            inputFieldSel.parents("div.informationFieldContainer").kendoValidator({
                                rules: {
                                    datepicker: function (input) {
                                        return !(input[0].dataset["role"] === "datetimepicker") || input[0].value === "" || input.data("kendoDateTimePicker").value();
                                    }
                                },
                                messages: {
                                    datepicker: "Please enter a valid date!"
                                }
                            });
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
                            inputFieldSel.kendoComboBox({
                                dataTextField: "Value",
                                dataValueField: "Codice",
                                filter: "contains",
                                template: GetComboTemplate(inputField),
                                footerTemplate: AddComboValueHtml
                            });
                            inputFieldSel.data("kendoComboBox").readonly();
                            break;
                        case "multicombo":
                            inputFieldSel.kendoMultiSelect({
                                dataTextField: "Value",
                                dataValueField: "Codice",
                                filter: "contains",
                                template: GetComboTemplate(inputField),
                                footerTemplate: AddComboValueHtml,
                                change: SortKendoMultiSelectValue,
                                autoClose: false
                            });
                            inputFieldSel.data("kendoMultiSelect").readonly();
                            break;
                    }
                });
            }

            var destinationTabSel = $("#" + destinationTab);
            destinationTabSel.append(GenerateControlsHtml(fieldsList, destinationTab));
            InitializeFieldKendoComponents(destinationTabSel);
        }

        function CreateSubVersionInformationField(schedeSubVersion, schedeInterventiSubVersion, maxSubVersion) {
            /**
             * @return {string}
             */
            function GenerateExpanderHtml(maxSubVersion) {
                /**
                 * @return {string}
                 */
                function GenerateSubVersionExpanderHtml(subVersion) {
                    var html = '   <li id="informationSubVersionPanel' + subVersion + '" data-subversion="' + subVersion + '" class="hidden"> SubVersion ' + subVersion + '\n';
                    html += '       <div id="informationSubVersionContent' + subVersion + '" data-ref="OggettiSubVersion" data-subversion="' + subVersion + '" class="subVersionPanelItem">\n';
                    html += '       </div>\n';
                    html += '   </li>\n';
                    return html;
                }

                /**
                 * @return {string}
                 */
                function GenerateInterventionExpanderHtml(subVersion) {
                    var html = '   <li id="infoInterventiSubVersionPanel' + subVersion + '" data-subversion="' + subVersion + '" class="hidden"> Intervention ' + subVersion + '\n';
                    html += '       <div id="infoInterventiSubVersionContent' + subVersion + '" data-ref="InterventiSubVersion" data-subversion="' + subVersion + '" class="subVersionPanelItem">\n';
                    html += '       </div>\n';
                    html += '   </li>\n';
                    return html;
                }

                var html = '<ul id="informationSubVersionExpanderControl">\n';
                html += GenerateSubVersionExpanderHtml(0);
                for (var i = 1; i < maxSubVersion + 5; i++) {
                    html += GenerateInterventionExpanderHtml(i);
                    html += GenerateSubVersionExpanderHtml(i);
                }
                html += '</ul>\n';
                return html;
            }

            var informationSubVersionTab = $('#informationSubVersionTab');
            informationSubVersionTab.append(GenerateExpanderHtml(maxSubVersion));
            $("#informationSubVersionExpanderControl").kendoPanelBar({});
            informationSubVersionTab.find("div.subVersionPanelItem").each(function (i, expander) {
                switch (expander.dataset["ref"]) {
                    case "OggettiSubVersion":
                        CreateInformationFieldSingleTab(schedeSubVersion, expander.id);
                        break;
                    case "InterventiSubVersion":
                        CreateInformationFieldSingleTab(schedeInterventiSubVersion, expander.id);
                        break;
                }
            });
        }

        function AddGisInformationFields() {
            return $.ajax({
                url: './php/getGisInformationFields.php',
                dataType: "json",
                success: function (resultData) {
                    var html = "";
                    for (var id in resultData) {
                        var [database, table] = id.split("||");
                        html += '                    <div id="' + database + "_" + table + '" data-db="' + database + '" data-table="' + table + '" class="boxedContainer hidden">\n';
                        html += '                        <h3>' + table + '</h3>\n';

                        resultData[id].forEach(function (field) {
                            id = id.replace("||", "_");
                            html += '                        <div class="informationFieldContainer">\n';
                            html += '                            <div class="labelContainer"><label for="' + id + '_' + field["column_name"] + '">' + field["column_name"] + '</label></div>\n';
                            switch (field["data_type"]) {
                                case "integer" :
                                    html += '                            <input data-tipo="int" data-destination="' + id + '" id="' + id + '_' + field["column_name"] + '" type="number">\n';
                                    break;
                                case "numeric" :
                                    html += '                            <input data-tipo="real" data-destination="' + id + '" id="' + id + '_' + field["column_name"] + '" type="number">\n';
                                    break;
                                case "character varying":
                                    html += '                            <textarea data-tipo="text" data-role="textinfo" data-destination="' + id + '" id="' + id + '_' + field["column_name"] + '" style="height: 31px" type="text" class="k-textbox" onmousedown="_isMouseDown = true;" onmousemove="ChangeInformationFieldsStyleFromElement(false)" onmouseup="ChangeInformationFieldsStyleFromElement(true)" readonly></textarea>\n';
                                    break;
                            }
                            html += '                        </div>\n';
                        });

                        html += "                    </div>\n";
                    }

                    $("#informationVersionTab").append(html);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    AlertMessage("Unexpected error while creating GIS information fields!", textStatus + "; " + errorThrown);
                }
            });
        }

        function AddDynamicInformationField() {
            $.ajax({
                url: './php/getInformationFields.php',
                dataType: "json",
                success: function (resultData) {
                    CreateInformationFieldSingleTab(resultData["SchedeOggetto"], "informationObjectTab");
                    CreateInformationFieldSingleTab(resultData["SchedeVersione"], "informationVersionTab");
                    CreateSubVersionInformationField(resultData["SchedeSubVersion"], resultData["SchedeInterventiSubVersion"], parseInt(resultData["MaxSubVersion"]));

                    ChangeInformationFieldsStyle(true);
                    FillAllComboValues();

                    ProgressBar(false);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    ProgressBar(false);
                    AlertMessage("Unexpected error while creating dynamic object information fields!", textStatus + "; " + errorThrown);
                }
            });
        }

        ProgressBar(true);

        DeleteDynamicInformationFields();

        AddGisInformationFields()
            .then(AddDynamicInformationField);
    }

    ResetInformation();

    UpdateCategoryList();

    CreateDynamicInformationFields();
}

function ResetInformation() {
    function ResetInputField(inputFieldContainer) {
        function ResetKendoInputField(inputFieldKendo) {
            inputFieldKendo.value(null);
            inputFieldKendo.readonly();
        }

        inputFieldContainer.find("input, textarea, select").each(function (i, inputField) {
            switch (inputField.dataset["role"]) {
                case "dropdownlist" :
                    ResetKendoInputField($(inputField).data("kendoDropDownList"));
                    break;
                case "multiselect" :
                    ResetKendoInputField($(inputField).data("kendoMultiSelect"));
                    break;
                case "combobox" :
                    ResetKendoInputField($(inputField).data("kendoComboBox"));
                    break;
                case "numerictextbox":
                    ResetKendoInputField($(inputField).data("kendoNumericTextBox"));
                    break;
                case "datetimepicker":
                    ResetKendoInputField($(inputField).data("kendoDateTimePicker"));
                    break;
                case "checkboxinfo" :
                    $(inputField).prop("checked", false);
                    $("label[for='" + inputField.id + "']").unbind("click", KendoCheckBoxReadOnly_PreventClick).bind("click", KendoCheckBoxReadOnly_PreventClick);
                    break;
                case "textinfo" :
                    inputField.value = null;
                    inputField.setAttribute("readonly", true);
                    break;
            }
        });
    }

    function DisableSaveButtons(buttonContainer) {
        buttonContainer.find("button").each(function (i, button) {
            if (button.dataset["codice"] > 0) {
                button.setAttribute("disabled", true);
                $(button).unbind("click", SaveSheetInformation)
            }
        });
        $("#saveInfoCategory").unbind("click", ChangeCategory);
    }

    function HideAllInformationSheet(informationWindowTabControl) {
        informationWindowTabControl.find("div.boxedContainer").each(function (i, elem) {
            if (elem.dataset["codice"] > 0 || elem.dataset["table"]) {
                $(elem).addClass("hidden");
            }
        });
        $("#informationSubVersionExpanderControl").children("li").each(function (i, expander) {
            $(expander).addClass("hidden");
        })
    }

    var informationWindowTabControl = $("#informationWindowTabControl");
    ResetInputField(informationWindowTabControl);
    DisableSaveButtons(informationWindowTabControl);
    HideAllInformationSheet(informationWindowTabControl);
}

function UpdateInformation(codiceVersione, readonly) {
    function UpdateBaseInformation(codiceVersione) {
        function ShowInformationSheets(codiceCategoria) {
            function SetVisibleInformationSheet(sheetList, destinationTab) {
                $("#" + destinationTab).find("div.boxedContainer").each(function (i, sheet) {
                    if (sheet.dataset["codice"] > 0 && sheetList.some(item => item["CodiceScheda"] === sheet.dataset["codice"])) {
                        $(sheet).removeClass("hidden");
                    }
                });
            }

            if (codiceCategoria > 0) {
                $.ajax({
                    url: './php/getVisibleInformationSheet.php',
                    dataType: "json",
                    data: {
                        codiceCategoria: codiceCategoria
                    },
                    success: function (resultData) {
                        SetVisibleInformationSheet(resultData["SchedeVisibiliOggetto"], "informationObjectTab");
                        SetVisibleInformationSheet(resultData["SchedeVisibiliVersione"], "informationVersionTab");
                        $('#informationSubVersionTab').find("div.subVersionPanelItem").each(function (i, expander) {
                            switch (expander.dataset["ref"]) {
                                case "OggettiSubVersion":
                                    SetVisibleInformationSheet(resultData["SchedeVisibiliSubVersion"], expander.id);
                                    break;
                                case "InterventiSubVersion":
                                    SetVisibleInformationSheet(resultData["SchedeVisibiliInterventiSubVersion"], expander.id);
                                    break;
                            }
                        });
                        ChangeInformationFieldsStyle(true);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        AlertMessage("Unexpected error while loading visible information sheet!", textStatus + "; " + errorThrown);
                    }
                });
            }
        }

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

                $("#infoCategory").data("kendoDropDownList").value(resultData["Categoria"]);
                ShowInformationSheets(resultData["Categoria"]);

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
                $("#infoRadius").val(resultData["Radius"] == null ? "Unknown" : parseFloat(resultData["Radius"]).toFixed(3) + " m");
                $("#infoLocalCenterX").val(resultData["xc"] == null ? "Unknown" : parseFloat(resultData["xc"]).toFixed(3) + " m");
                $("#infoLocalCenterY").val(resultData["yc"] == null ? "Unknown" : parseFloat(resultData["yc"]).toFixed(3) + " m");
                $("#infoLocalCenterZ").val(resultData["zc"] == null ? "Unknown" : parseFloat(resultData["zc"]).toFixed(3) + " m");
                $("#infoSRS").val(resultData["SRS"]);
                $("#infoWorldCenterX").val(resultData["xc"] == null ? "Unknown" : (parseFloat(resultData["xc"]) - parseFloat(resultData["TranslationX"])).toFixed(3) + " m");
                $("#infoWorldCenterY").val(resultData["yc"] == null ? "Unknown" : (parseFloat(resultData["yc"]) - parseFloat(resultData["TranslationY"])).toFixed(3) + " m");
                $("#infoWorldCenterZ").val(resultData["zc"] == null ? "Unknown" : (parseFloat(resultData["zc"]) - parseFloat(resultData["TranslationZ"])).toFixed(3) + " m");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                AlertMessage("Unexpected error while loading base information!", textStatus + "; " + errorThrown);
            }
        });
    }

    function UpdateDynamicInformation(codiceVersione) {
        function SetFieldValue(valueList, destinationTab) {
            $.each(valueList, function (key, value) {
                var inputField = $("#" + destinationTab + "_" + value["CodiceCampo"]);
                switch (inputField[0].dataset["tipo"]) {
                    case "text":
                        inputField.val(value["TextValue"]);
                        break;
                    case "bool":
                        inputField.prop("checked", value["BoolValue"] === "t");
                        break;
                    case "timestamp":
                        inputField.data("kendoDateTimePicker").value(GetDateTime(value["TimestampValue"]));
                        break;
                    case "int":
                        inputField.data("kendoNumericTextBox").value(value["IntValue"]);
                        break;
                    case "real":
                        inputField.data("kendoNumericTextBox").value(value["RealValue"]);
                        break;
                    case "combo":
                        inputField.data("kendoComboBox").value(value["ComboValue"]);
                        break;
                    case "multicombo":
                        inputField.data("kendoMultiSelect").value(value["MultiComboValue"].split("_"));
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
                SetFieldValue(resultData["InformazioniVersione"], "informationVersionTab");
                $('#informationSubVersionTab').find("div.subVersionPanelItem").each(function (i, expander) {
                    var codiceSubVersion = resultData["CodiceSubVersion" + expander.dataset["subversion"]];
                    if (codiceSubVersion > 0) {
                        $(expander).parent().removeClass("hidden");
                        switch (expander.dataset["ref"]) {
                            case "OggettiSubVersion":
                                expander.dataset["codice"] = codiceSubVersion;
                                SetFieldValue(resultData["InformazioniSubVersion" + expander.dataset["subversion"]], expander.id);
                                break;
                            case "InterventiSubVersion":
                                expander.dataset["codice"] = resultData["CodiceInterventoSubVersion" + expander.dataset["subversion"]];
                                SetFieldValue(resultData["InfoInterventiSubVersion" + expander.dataset["subversion"]], expander.id);
                                break;
                        }
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                AlertMessage("Unexpected error while loading dynamic information!", textStatus + "; " + errorThrown);
            }
        });
    }

    function UpdateGisInformation() {
        function SetFieldValue(valueList, destinationTab) {
            if (valueList) {
                $("#" + destinationTab).removeClass("hidden");
                $.each(valueList, function (key, value) {
                    var inputField = $("#" + destinationTab + "_" + key);
                    if (inputField[0]) {
                        switch (inputField[0].dataset["tipo"]) {
                            case "text":
                                inputField.val(value);
                                break;
                            case "int":
                                inputField.data("kendoNumericTextBox").value(value);
                                break;
                            case "real":
                                inputField.data("kendoNumericTextBox").value(value);
                                break;
                        }
                    }
                });
            }
        }

        $.ajax({
            url: './php/getGisInformation.php',
            dataType: "json",
            data: {
                codiceVersione: codiceVersione
            },
            success: function (resultData) {
                for (var destinationTab in resultData) {
                    SetFieldValue(resultData[destinationTab][0], destinationTab.replace("||", "_"));
                }
                ChangeInformationFieldsStyle(true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                AlertMessage("Unexpected error while loading dynamic information!", textStatus + "; " + errorThrown);
            }
        });
    }

    function SetWriteMode(writeMode) {
        function SetWriteInputFields(inputFieldContainer) {
            inputFieldContainer.find("input, textarea, select").each(function (i, inputField) {
                switch (inputField.dataset["role"]) {
                    case "dropdownlist" :
                        $(inputField).data("kendoDropDownList").readonly(false);
                        break;
                    case "multiselect" :
                        $(inputField).data("kendoMultiSelect").readonly(false);
                        break;
                    case "combobox" :
                        $(inputField).data("kendoComboBox").readonly(false);
                        break;
                    case "numerictextbox":
                        $(inputField).data("kendoNumericTextBox").readonly(false);
                        break;
                    case "datetimepicker":
                        $(inputField).data("kendoDateTimePicker").readonly(false);
                        break;
                    case "checkboxinfo" :
                        $("label[for='" + inputField.id + "']").unbind("click", KendoCheckBoxReadOnly_PreventClick);
                        break;
                    case "textinfo" :
                        inputField.removeAttribute("readonly");
                        break;
                }
            });
        }

        function EnableSaveButtons(buttonContainer) {
            buttonContainer.find("button").each(function (i, saveButton) {
                saveButton.removeAttribute("disabled");
                if (saveButton.dataset["codice"] > 0) {
                    $(saveButton).bind("click", SaveSheetInformation);
                }
            });
            $("#saveInfoCategory").bind("click", ChangeCategory);
        }

        $("#informationReadOnlySwitch").data("kendoSwitch").check(writeMode);
        if (writeMode) {
            var informationWindowTabControl = $("#informationWindowTabControl");
            SetWriteInputFields(informationWindowTabControl);
            EnableSaveButtons(informationWindowTabControl);
        }
    }

    ResetInformation();
    UpdateBaseInformation(codiceVersione);
    UpdateGisInformation();
    UpdateDynamicInformation(codiceVersione);
    SetWriteMode(!readonly);
}

function SaveSheetInformation() {
    function SaveInformation(inputField) {
        var value;
        var url = "./php/setInformation";
        switch (inputField.dataset["tipo"]) {
            case "text":
                url += 'Text.php';
                value = inputField.value;
                break;
            case "bool":
                url += 'Other.php';
                value = $(inputField).prop("checked");
                break;
            case "timestamp":
                url += 'Timestamp.php';
                value = $(inputField).data("kendoDateTimePicker").value();
                if (value != null) {
                    // noinspection JSCheckFunctionSignatures
                    value = value.toLocaleString('it-it');
                }
                break;
            case "int":
            case "real":
                url += 'Other.php';
                value = $(inputField).data("kendoNumericTextBox").value();
                break;
            case "combo":
                url += 'Combo.php';
                value = $(inputField).data("kendoComboBox").value();
                break;
            case "multicombo":
                url += 'MultiCombo.php';
                value = $(inputField).data("kendoMultiSelect").value().join("_");
                break;
            default:
                return;
        }

        var destinationControl = $("#" + inputField.dataset["destination"]);
        var codice;
        switch (inputField.dataset["destination"]) {
            case "informationObjectTab" :
                codice = $("#infoCodiceOggetto").val();
                break;
            case "informationVersionTab":
                codice = $("#infoCodiceVersione").val();
                break;
            default:
                var destination = inputField.dataset["destination"];
                if (destination.startsWith("informationSubVersionContent") || destination.startsWith("infoInterventiSubVersionContent")) {
                    codice = destinationControl[0].dataset["codice"];
                } else {
                    return;
                }
        }

        var dbReference = destinationControl[0].dataset["ref"];
        //TODO: quando si dismette il vecchio sistema rinominare funzione nel DB e togliere l'IF seguente
        if (dbReference === "OggettiVersion") {
            dbReference = "OggettiVersioni";
        }

        $.ajax({
            url: url,
            dataType: "json",
            data: {
                dbReference: dbReference,
                codiceRiferimento: codice,
                codiceCampo: inputField.dataset["codice"],
                valore: value
            },
            error: function (jqXHR, textStatus, errorThrown) {
                AlertMessage("Unexpected error while saving objectInformation!", textStatus + "; " + errorThrown);
            }
        });
    }

    if ($("#informationReadOnlySwitch").data("kendoSwitch").check()) {
        var sheet = $(this).parents(".boxedContainer");
        // noinspection JSCheckFunctionSignatures
        sheet.find("input, textarea, select").each(function (i, inputField) {
            SaveInformation(inputField);
        });
        kendo.alert("Save completed!")
    } else {
        kendo.alert("Can't save information in read only mode!");
    }
}

function ChangeCategory() {
    if ($("#informationReadOnlySwitch").data("kendoSwitch").check()) {
        var categoryCombo = $("#infoCategory").data("kendoDropDownList");
        $.ajax({
            url: './php/setCategory.php',
            dataType: "json",
            data: {
                codiceOggetto: $("#infoCodiceOggetto").val(),
                codiceCategoria: categoryCombo.select() !== -1 ? categoryCombo.value() : "null"
            },
            success: function () {
                kendo.alert("Category changed");
                UpdateInformation($("#infoCodiceVersione").val(), false);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                AlertMessage("Unexpected error while change object category!", textStatus + "; " + errorThrown);
            }
        });
    } else {
        kendo.alert("Can't change category in read only mode!");
    }
}

function FillAllComboValues() {
    function FillComboValuesSingleTab(comboValues, destinationTab) {
        $("#" + destinationTab).find("select").each(function (i, inputField) {
            switch (inputField.dataset["tipo"]) {
                case "combo":
                    $(inputField).data("kendoComboBox").setDataSource(comboValues[inputField.dataset["codice"]]);
                    break;
                case "multicombo":
                    $(inputField).data("kendoMultiSelect").setDataSource(comboValues[inputField.dataset["codice"]]);
                    break;
            }
        });
    }

    $.ajax({
        url: './php/getAllComboValue.php',
        dataType: "json",
        data: {},
        success: function (resultData) {
            FillComboValuesSingleTab(resultData["ComboOggetto"], "informationObjectTab");
            FillComboValuesSingleTab(resultData["ComboVersione"], "informationVersionTab");
            $('#informationSubVersionTab').find("div.subVersionPanelItem").each(function (i, expander) {
                switch (expander.dataset["ref"]) {
                    case "OggettiSubVersion":
                        FillComboValuesSingleTab(resultData["ComboSubVersion"], expander.id);
                        break;
                    case "InterventiSubVersion":
                        FillComboValuesSingleTab(resultData["ComboInterventiSubVersion"], expander.id);
                        break;
                }
            });
        },
        error: function (jqXHR, textStatus, errorThrown) {
            AlertMessage("Unexpected error during the update of the combobox fields!", textStatus + "; " + errorThrown);
        }
    });
}

function FillComboValues(inputFieldKendo, dbReference, codiceCampo) {
    $.ajax({
        url: './php/getFieldComboValue.php',
        dataType: "json",
        data: {
            dbReference: dbReference,
            codiceCampo: codiceCampo
        },
        success: function (resultData) {
            inputFieldKendo.setDataSource(resultData);
            RefreshKendoComboValue(inputFieldKendo);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            AlertMessage("Unexpected error during the update of the combobox fields!", textStatus + "; " + errorThrown);
        }
    });
}

function UpdateComboValue(inputSel, dbReference, codiceCampo) {
    function UpdateSubVersionComboValue(dbReference, codiceCampo, destination) {
        var inputSel, inputFieldKendo;
        $("#informationSubVersionTab").find("input, select").each(function (i, inputField) {
            if (inputField.dataset["codice"] === codiceCampo && inputField.dataset["destination"].startsWith(destination)) {
                inputSel = $(inputField);
                inputFieldKendo = inputField.dataset["tipo"] === "combo" ? inputSel.data("kendoComboBox") : inputSel.data("kendoMultiSelect");
                FillComboValues(inputFieldKendo, dbReference, codiceCampo);
            }
        });
    }

    switch (dbReference) {
        case "OggettiSubVersion":
            UpdateSubVersionComboValue(dbReference, codiceCampo, "informationSubVersionContent");
            break;
        case "InterventiSubVersion":
            UpdateSubVersionComboValue(dbReference, codiceCampo, "infoInterventiSubVersionContent");
            break;
        default:
            var inputFieldKendo = inputSel[0].dataset["tipo"] === "combo" ? inputSel.data("kendoComboBox") : inputSel.data("kendoMultiSelect");
            FillComboValues(inputFieldKendo, dbReference, codiceCampo);
            break;
    }
}

function GetComboDbReferences(inputSel) {
    var dbReference = $("#" + inputSel[0].dataset["destination"])[0].dataset["ref"];
    var codiceCampo = inputSel[0].dataset["codice"];
    return {codiceCampo, dbReference};
}

function AddNewComboValue(inputId, addValue) {
    var inputSel = $("#" + inputId);
    var {codiceCampo, dbReference} = GetComboDbReferences(inputSel);
    $.ajax({
        url: './php/addInformationComboValue.php',
        dataType: "json",
        data: {
            dbReference: dbReference,
            codiceCampo: codiceCampo,
            addValue: addValue
        },
        success: function () {
            UpdateComboValue(inputSel, dbReference, codiceCampo);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            AlertMessage("Unexpected error during the update of the combobox fields!", textStatus + "; " + errorThrown);
        }
    });
}

function ChangeComboValueDialogOpen(event) {
    function InitializeRenameComboDialog(renameComboDialog) {
        renameComboDialog.kendoDialog({
            width: "320px",
            title: "Rename combo value",
            closable: true,
            modal: true,
            actions: [
                {text: 'CANCEL', action: this.close()},
                {text: 'RENAME', primary: true, action: ChangeComboValueDialog_OnSubmit}
            ]
        });

        renameComboDialog.parents(".k-widget").addClass("windowTitle windowIcon renameComboDialogTitle renameComboDialogIcon");
        $("#newValue").on("keyup", function (event) {
            if (event.key === "Enter") {
                ChangeComboValueDialog_OnSubmit();
                renameComboDialog.data("kendoDialog").close();
            }
        });
    }

    function ChangeComboValueDialog_OnSubmit() {
        var newValueInput = $("#newValue");
        var inputSel = $("#" + newValueInput[0].dataset["ref"]);
        var {codiceCampo, dbReference} = GetComboDbReferences(inputSel);
        $.ajax({
            url: './php/changeInformationComboValue.php',
            dataType: "json",
            data: {
                dbReference: dbReference,
                codiceCombo: newValueInput[0].dataset["codice"],
                newValue: newValueInput.val()
            },
            success: function () {
                UpdateComboValue(inputSel, dbReference, codiceCampo);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                AlertMessage("Unexpected error during the update of the combobox fields!", textStatus + "; " + errorThrown);
            }
        });
    }

    event.preventDefault();

    var renameComboDialog = $('#changeComboValueDialog');
    var renameComboDialogKendo = renameComboDialog.data("kendoDialog");
    if (renameComboDialogKendo) {
        renameComboDialogKendo.open();
    } else {
        // noinspection JSPotentiallyInvalidConstructorUsage
        InitializeRenameComboDialog(renameComboDialog);
    }

    var senderElement = event.srcElement;
    // noinspection JSJQueryEfficiency
    var newValueInput = $("#newValue");
    newValueInput.val(senderElement.dataset["value"]);
    newValueInput[0].dataset["codice"] = senderElement.dataset["codice"];
    newValueInput[0].dataset["ref"] = senderElement.dataset["ref"];
}

function RemoveComboValue(event) {
    event.preventDefault();

    var senderElement = event.srcElement;
    kendo.confirm("Are you sure to delete <i>" + senderElement.dataset["value"] + "</i> value?<br><br>This value will be removed from all the objects and the operation can't be undone!")
        .done(function () {
            var inputSel = $("#" + senderElement.dataset["ref"]);
            var {codiceCampo, dbReference} = GetComboDbReferences(inputSel);
            $.ajax({
                url: './php/removeInformationComboValue.php',
                dataType: "json",
                data: {
                    dbReference: dbReference,
                    codiceCombo: senderElement.dataset["codice"]
                },
                success: function () {
                    UpdateComboValue(inputSel, dbReference, codiceCampo);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    AlertMessage("Unexpected error during the update of the combobox fields!", textStatus + "; " + errorThrown);
                }
            });
        });
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
                    filtering: function (e) {
                        e.filter.value = e.filter.value.replace(/%/g, "");
                    },
                    suggest: true,
                    placeholder: "Select a " + label + "'s value to apply the filter ...",
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

        function UpdateSearchFormCombobox(senderLabel) {
            $.ajax({
                url: './php/getListLayersAndName.php',
                dataType: "json",
                data: {
                    senderId: senderLabel,
                    layer0: $("#selectLayer0").data("kendoComboBox").value(),
                    layer1: $("#selectLayer1").data("kendoComboBox").value(),
                    layer2: $("#selectLayer2").data("kendoComboBox").value(),
                    layer3: $("#selectLayer3").data("kendoComboBox").value(),
                    nome: $("#selectName").data("kendoComboBox").value(),
                    versione: $("#selectVersione").data("kendoComboBox").value()
                },
                success: function (resultData) {
                    for (var field in resultData) {
                        $("#select" + field).data("kendoComboBox").setDataSource(resultData[field]);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    AlertMessage("Unexpected error during the update of the search fields!", textStatus + "; " + errorThrown);
                }
            });
        }

        CreateSearchFormCombobox();

        UpdateSearchFormCombobox();
    }

    function SetObjectsGrid() {
        function SetColumnsHeader() {
            // noinspection JSDeprecatedSymbols
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
                    field: "Type", title: "Model type", width: 50, template: function (dataItem) {
                        switch (dataItem["Type"]) {
                            case "0":
                                return "Mesh";
                            case "1":
                                return "Point Cloud";
                            case "2":
                                return "Hotspot";
                            case "3":
                                return "Mesh (MultiTexture)";
                            default:
                                return "";
                        }
                    }
                },
                {
                    field: "readonly",
                    title: "Write",
                    width: 30,
                    template: "#= readonly === 'f' ? '<span class=\"k-icon k-i-check\" onclick=\"ChangeWriteModeObjectGrid(event,$(this),false)\" title=\"Click to set read-only\"></span>' : '<span class=\"k-icon\" onclick=\"ChangeWriteModeObjectGrid(event,$(this),true)\" title=\"Click to set write mode\"></span>' #",
                    attributes: {
                        "class": "writeReadFlagCell",
                        style: "text-align: center;"
                    }
                },
                {
                    field: "readonly",
                    title: "Your List",
                    width: 30,
                    template: "#= readonly == null ? '<span class=\"k-icon k-i-plus\" onclick=\"AddToYourListObjectGrid(event,$(this))\" title=\"Click to add to your list\"></span>' : '<span class=\"k-icon k-i-minus\" onclick=\"RemoveFromYourListObjectGrid(event,$(this))\" title=\"Click to remove from your list\"></span>' #",
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
            /**
             * @return {string}
             */
            function GetTypeStringCode(type) {
                switch (type) {
                    case "0":
                        return "a";
                    case "1":
                        return "p";
                    case "2":
                        return "h";
                    case "3":
                        return "m";
                    default:
                        return "";
                }
            }

            var selectedObject = this.dataItem(this.select());
            if (selectedObject) {
                Select3dObject(Get3dObjectFromName(GetTypeStringCode(selectedObject["Type"]) + selectedObject["CodiceVersione"]), false);
                UpdateInformation(selectedObject["CodiceVersione"], selectedObject["readonly"] !== "f");
            }
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

    function SetModelWindow() {
        function ResizeModelCanvas() {
            $("#modelCanvas").css("height", "calc(100% - " + ($("#settings3dFrame").height() + 7) + "px)");
            ComputeCanvasDiagonal();
        }

        function InitializeModelWindow() {
            function ModelWindow_OnActivate() {
                ModelWindow_OnResize();
            }

            function ModelWindow_OnResize() {
                ResizeModelCanvas();
            }

            var modelWindow = $("#modelWindow");
            modelWindow.removeClass("fixedPosition");
            modelWindow.kendoWindow({
                title: "Models",
                minWidth: 390,
                minHeight: 200,
                visible: false,
                resizable: true,
                open: Windows_OnOpen,
                activate: ModelWindow_OnActivate,
                resize: ModelWindow_OnResize,
                close: Windows_OnClose
            }).data("kendoWindow");
            modelWindow.parents(".k-widget").addClass("windowTitle windowIcon modelWindowTitle modelWindowIcon");
        }

        function Add3dToolbar() {
            function Toggle3dSettings() {
                $("#settings3dFrame").toggleClass("hidden");
                ResizeModelCanvas();
            }

            var html;
            html = '<div class="windowsToolbarContainer">';
            html += '    <div class="buttonWindowsToolbarContainer">';
            html += '       <span id="zoomAll3dSceneButton" title="Zoom All">';
            html += '           <img src="../img/icons/windowsToolbar/zoomAll.png" alt="Zoom All">';
            html += '       </span>';
            html += '    </div>';
            html += '    <div class="buttonWindowsToolbarContainer">';
            html += '       <span id="sync3dSceneButton" title="Sync 3d scene with your list">';
            html += '           <img src="../img/icons/windowsToolbar/updateSync.png" alt="Sync 3d scene with your list">';
            html += '       </span>';
            html += '    </div>';
            html += '    <div class="buttonWindowsToolbarContainer">';
            html += '       <span id="clear3dSceneButton" title="Clear 3d scene">';
            html += '           <img src="../img/icons/windowsToolbar/clearView.png" alt="Clear 3d scene">';
            html += '       </span>';
            html += '    </div>';
            html += '    <div class="buttonWindowsToolbarContainer">';
            html += '       <span id="reload3dSceneButton" title="Reload 3d scene">';
            html += '           <img src="../img/icons/windowsToolbar/reloadAll.png" alt="Reload 3d scene">';
            html += '       </span>';
            html += '    </div>';
            html += '    <div class="buttonWindowsToolbarContainer">';
            html += '       <span id="addNewHotspotButton" class="greenButton" title="Add a new Hotspot">';
            html += '           <img src="../img/icons/windowsToolbar/addHotspot.png" alt="Add a new Hotspot">';
            html += '       </span>';
            html += '    </div>';
            html += '    <div class="buttonWindowsToolbarContainer">';
            html += '       <span id="settings3dButton" title="3D Settings">';
            html += '           <img src="../img/icons/windowsToolbar/3dSettings.png" alt="3D Settings">';
            html += '       </span>';
            html += '    </div>';
            html += '</div>';

            $(".modelWindowTitle").prepend(html);

            $("#settings3dButton").click(Toggle3dSettings);
        }

        function Initialize3d() {
            function Hide3dSettings() {
                $("#settings3dFrame").addClass("hidden");
                ResizeModelCanvas();
            }

            function Enable3dButtons() {
                function Sync3dScene() {
                    function UnloadObjectNotInList() {
                        $.ajax({
                            url: 'php/getCodiceVersioneFromImportList.php',
                            dataType: "json",
                            success: function (resultData) {
                                function DestroyChildrenNotInList(nodeId) {
                                    var blocchi = _myScene.findNode(nodeId);
                                    for (var i = blocchi.nodes.length - 1; i >= 0; i--) {
                                        if (!resultData.includes(blocchi.nodes[i].id.substring(1))) {
                                            blocchi.nodes[i].destroy();
                                        }
                                    }
                                }

                                DestroyChildrenNotInList("TexturedMesh");
                                DestroyChildrenNotInList("MultiTexturedMesh");
                                DestroyChildrenNotInList("HotSpot");
                                DestroyChildrenNotInList("PointCloud");
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                AlertMessage("Unexpected error while loading import list!", textStatus + "; " + errorThrown);
                            }
                        });
                    }

                    UnloadObjectNotInList();
                    Load3dScene();
                }

                function ToggleAddNewHotspot() {
                    $("#addHotspotNotification").toggleClass("hidden");
                    _addHotSpotMode = !_addHotSpotMode;
                }

                $("#zoomAll3dSceneButton").click(ResetEye);

                $("#sync3dSceneButton").click(Sync3dScene);

                $("#clear3dSceneButton").click(ResetView);

                $("#addNewHotspotButton").click(ToggleAddNewHotspot);

                $("#reload3dSceneButton").click(function () {
                    ResetView();
                    Load3dScene()
                        .then(setTimeout(ResetEye, 200));
                });
            }

            $(this.parentElement).fadeOut(1500);

            Hide3dSettings();
            Enable3dButtons();

            Load3dScene();
        }

        InitializeModelWindow();

        Add3dToolbar();

        $("#play3DButton").click(Initialize3d);
    }

    function SetGisWindow() {
        function InitializeGisWindow() {
            function GisWindow_OnResize() {
                var map = $("#mapContainer").data("map");
                if (map) {
                    map.updateSize();
                }
            }

            var gisWindow = $("#gisWindow");
            gisWindow.removeClass("fixedPosition");

            gisWindow.kendoWindow({
                title: "GIS",
                minWidth: 390,
                minHeight: 200,
                visible: false,
                resizable: true,
                open: Windows_OnOpen,
                resize: GisWindow_OnResize,
                close: Windows_OnClose
            }).data("kendoWindow");
            gisWindow.parents(".k-widget").addClass("windowTitle windowIcon gisWindowTitle gisWindowIcon");
        }

        function InitializeGis() {
            function EnableGisButtons() {
                function InitializeGisLayersSettings() {
                    function InitializeTransparencySlide() {
                        function ChangeLayerOpacity(event) {
                            var layer = GetLayerByName($("#mapContainer").data("map"), event.sender.element[0].name);
                            layer.setOpacity(event.value / 100);
                        }

                        $("#layersGisTreeView .transparencySliderContainer").children("input").kendoSlider({
                            min: 0,
                            max: 100,
                            value: 100,
                            smallStep: 1,
                            largeStep: 10,
                            showButtons: false,
                            tickPlacement: "none",
                            change: ChangeLayerOpacity,
                            slide: ChangeLayerOpacity
                        });
                    }

                    function ChangeLayerVisibility(event) {
                        function SetLayerVisibility(map, item) {
                            var layer = GetLayerByName(map, item.get('id'));
                            if (layer) {
                                layer.setVisible(item.checked);
                            }
                        }

                        var map = $("#mapContainer").data("map");
                        var layersGisTreeView = $("#layersGisTreeView").data("kendoTreeView");
                        var item = layersGisTreeView.dataItem(event.node);
                        if (item.hasChildren) {
                            item.items.forEach(function (innerItem) {
                                SetLayerVisibility(map, innerItem);
                            });
                        } else {
                            SetLayerVisibility(map, item);
                        }
                    }

                    // noinspection JSJQueryEfficiency
                    var layersGisTreeView = $("#layersGisTreeView");
                    if (!layersGisTreeView.data("kendoTreeView")) {
                        layersGisTreeView.kendoTreeView({
                            template: kendo.template(
                                "#: item.text #" +
                                "# if (!item.items) { #" +
                                "<div class='transparencySliderContainer'>" +
                                "<input id='layerSlider-#: item.id #' name='#: item.id #'/>" +
                                "</div>" +
                                "# } #"
                            ),
                            checkboxes: {checkChildren: true},
                            dataBound: InitializeTransparencySlide,
                            check: ChangeLayerVisibility
                        });
                    } else {
                        layersGisTreeView.unbind("dataBound");
                        layersGisTreeView.setDataSource([]);
                    }
                }

                function ToggleGisLayersSettings() {
                    $("#layersGisContainer").toggleClass("hidden");
                }

                $("#reloadGisButton").click(function () {
                    LoadGis();
                });

                InitializeGisLayersSettings();
                $("#layersGisButton").click(ToggleGisLayersSettings);
            }

            $(this.parentElement).fadeOut(1500);

            EnableGisButtons();

            LoadGis();
        }

        function AddGisToolbar() {
            var html;
            html = '<div class="windowsToolbarContainer">';
            html += '    <div class="buttonWindowsToolbarContainer">';
            html += '       <span id="reloadGisButton" title="Reload GIS">';
            html += '           <img src="../img/icons/windowsToolbar/reloadAll.png" alt="Reload GIS">';
            html += '       </span>';
            html += '    </div>';
            html += '    <div class="buttonWindowsToolbarContainer">';
            html += '       <span id="layersGisButton" title="GIS Layers">';
            html += '           <img src="../img/icons/windowsToolbar/gisLayers.png" alt="GIS Layers">';
            html += '       </span>';
            html += '    </div>';
            html += '</div>';

            $(".gisWindowTitle").prepend(html);
        }

        InitializeGisWindow();

        AddGisToolbar();

        $("#playGisButton").click(InitializeGis);
    }

    function SetInformationWindow() {
        function InitializeInformationWindow() {
            function InformationWindow_OnResize() {
                ChangeInformationFieldsStyle();
            }

            function InformationWindow_OnActivate() {
                ResizeInformationWindow();
                ChangeInformationFieldsStyle();
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
                activate: InformationWindow_OnActivate,
                close: Windows_OnClose,
                resize: InformationWindow_OnResize
            }).data("kendoWindow");

            informationWindow.parents(".k-widget").addClass("windowTitle windowIcon informationWindowTitle informationWindowIcon");
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

        function SetInformationTabControl() {
            function InformationWindowTabControl_OnShow() {
                ChangeInformationFieldsStyle(true);
            }

            $("#informationWindowTabControl").kendoTabStrip({
                animation: {
                    open: {effects: "fadeIn"}
                },
                show: InformationWindowTabControl_OnShow
            });
        }

        function SetInformationDefaultSheets() {
            function SetInformationCategorySheet() {
                var infoCategoryKendo = $("#infoCategory").kendoDropDownList({
                    dataTextField: "Nome",
                    dataValueField: "Codice",
                    filter: "contains"
                }).data("kendoDropDownList");
                KendoDropDownList_EnableClearButton(infoCategoryKendo);
            }

            SetInformationCategorySheet();
        }

        InitializeInformationWindow();

        AddReadWriteControl();
        SetInformationTabControl();
        SetInformationDefaultSheets();
    }

    function SetToolbarButtons() {
        function CleanYourList() {
            function SetAllObjectsReadonly() {
                var data = $("#objectsGrid").data("kendoGrid").dataSource.data();
                for (var i = 0; i < data.length; i++) {
                    data[i].set("readonly", null);
                }
                var codiceVersione = $("#infoCodiceVersione").val();
                if (codiceVersione) {
                    UpdateInformation(codiceVersione, true);
                }
            }

            $.ajax({
                url: './php/cleanYourList.php',
                dataType: "json",
                success: function (resultData) {
                    if (resultData === "success") {
                        SetAllObjectsReadonly();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    AlertMessage("Unexpected error during the update of the combobox fields!", textStatus + "; " + errorThrown);
                }
            });
        }

        function AddNewObject() {
            function InitializeAddNewObjectDialog(addNewObjectDialog) {
                function InitializeDialog() {
                    function AddNewObjectDialog_OnSubmit() {
                        $.ajax({
                            url: './php/addNewObject.php',
                            dataType: "json",
                            data: {
                                layer0: $("#newObjectLayer0").data("kendoComboBox").value(),
                                layer1: $("#newObjectLayer1").data("kendoComboBox").value(),
                                layer2: $("#newObjectLayer2").data("kendoComboBox").value(),
                                layer3: $("#newObjectLayer3").data("kendoComboBox").value(),
                                nome: $("#newObjectName").data("kendoComboBox").value(),
                            },
                            success: function (resultData) {
                                kendo.alert(resultData);
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                AlertMessage("Unexpected error during adding a new object!", textStatus + "; " + errorThrown);
                            }
                        });
                    }

                    addNewObjectDialog.kendoDialog({
                        width: "340px",
                        title: "Add a new object",
                        closable: true,
                        modal: true,
                        actions: [
                            {
                                text: 'CANCEL',
                                action: this.close()
                            },
                            {
                                text: 'ADD',
                                primary: true,
                                action: AddNewObjectDialog_OnSubmit
                            }
                        ]
                    });
                    addNewObjectDialog.parents(".k-widget").addClass("windowTitle windowIcon addNewObjectDialogTitle addNewObjectDialogIcon");

                    $("#newValue").on("keyup", function (event) {
                        if (event.key === "Enter") {
                            AddNewObjectDialog_OnSubmit();
                            addNewObjectDialog.data("kendoDialog").close();
                        }
                    });
                }

                function CreateCombobox(field, label) {
                    $("#newObject" + field).kendoComboBox({
                        filter: "contains",
                        filtering: function (e) {
                            e.filter.value = e.filter.value.replace(/%/g, "");
                        },
                        suggest: true,
                        placeholder: "Write or select " + label + "'s value ...",
                        dataTextField: field,
                        dataValueField: field
                    });
                }

                // noinspection JSPotentiallyInvalidConstructorUsage
                InitializeDialog();

                CreateCombobox("Layer0", _layer0Label);
                CreateCombobox("Layer1", _layer1Label);
                CreateCombobox("Layer2", _layer2Label);
                CreateCombobox("Layer3", _layer3Label);
                CreateCombobox("Name", _nameLabel);

                UpdateCombobox();
            }

            function UpdateCombobox() {
                $.ajax({
                    url: './php/getListLayersAndName.php',
                    dataType: "json",
                    success: function (resultData) {
                        for (var field in resultData) {
                            if (field !== "Versione") {
                                var kendoCombobox = $("#newObject" + field).data("kendoComboBox");
                                kendoCombobox.setDataSource(resultData[field]);
                                kendoCombobox.value(null);
                            }
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        AlertMessage("Unexpected error during the update of the search fields!", textStatus + "; " + errorThrown);
                    }
                });
            }

            var addNewObjectDialog = $("#addNewObjectDialog");
            var addNewObjectDialogKendo = addNewObjectDialog.data("kendoDialog");
            if (!addNewObjectDialogKendo) {
                InitializeAddNewObjectDialog(addNewObjectDialog);
                addNewObjectDialogKendo = addNewObjectDialog.data("kendoDialog");
            } else {
                UpdateCombobox();
            }

            addNewObjectDialogKendo.open();
        }

        $("#mode3DButton").click("click", function () {
            ToggleKendoWindow("modelWindow");
        });

        $("#modeGisButton").click("click", function () {
            ToggleKendoWindow("gisWindow");
        });

        $("#informationButton").click("click", function () {
            ToggleKendoWindow("informationWindow");
        });

        $("#cleanYourListButton").click(CleanYourList);

        $("#addNewObjectButton").click(AddNewObject)
    }

    SetSearchForm();
    SetObjectsGrid();
    SetModelWindow();
    SetGisWindow();
    SetInformationWindow();
    SetToolbarButtons();
}

//3DScene
function Load3dScene() {
    function CreateEmptyScene(nodes) {
        _myScene = SceneJS.scene("modelScene");
        if (!_myScene) {
            SceneJS.setDebugConfigs({
                shading: {
                    logScripts: false,
                    validate: true
                }
            });
            SceneJS.configure({
                pluginPath: "./libs/SceneJS/plugins"
            });

            // noinspection JSUnresolvedFunction,SpellCheckingInspection
            _myScene = SceneJS.createScene({
                type: "scene",
                id: "modelScene",
                canvasId: "modelCanvas",
                loggingElementId: "sjslog",
                nodes: nodes
            });
        }

        _resetEye = nodes[0].eye;
        _resetLook = nodes[0].look;
        var mv = _myScene.findNode("mainView");
        var up = mv.getUp();
        up.x = 0.0;
        up.y = 0.0;
        up.z = 1.0;
        mv.setUp(up);
    }

    function AddMesh(nodes, mainNodeId) {
        var texturedMeshNode = _myScene.findNode(mainNodeId);

        nodes.forEach(function (node) {
            if (_myScene.findNode(node.id) == null) {
                try {
                    texturedMeshNode.addNode(node);
                } catch (error) {
                    AlertMessage("Unexpected error while loading textured mesh!", "Error loading textured mesh: " + error);
                }
            }
        });
    }

    function AddPointCloud(nodes) {
        var pointCloudNode = _myScene.findNode("PointCloud");

        nodes.forEach(function (node) {
            if (_myScene.findNode(node.id) == null) {
                try {
                    pointCloudNode.addNode(node);
                } catch (error) {
                    AlertMessage("Unexpected error while loading point cloud!", "Error loading textured mesh: " + error);
                }
            }
        });
    }

    function AddHotSpots(nodes) {
        var hotSpotNode = _myScene.findNode("HotSpot");

        nodes.forEach(function (node) {
            if (_myScene.findNode(node.id) == null) {
                try {
                    hotSpotNode.addNode(node);
                } catch (error) {
                    AlertMessage("Unexpected error while loading hotspot!", "Error loading hotspot: " + error);
                }
            }
        });
    }

    /**
     * @return {string}
     */
    function ToTextureSrc(textureData) {
        return "data:" + textureData["mimeType"] + ";base64," + textureData["textureFile"];
    }

    function LoadTexturedMesh(lodModello, lodTexture) {
        function LoadTexture(modelNode, lod) {
            var textureCacheManager = new TextureCacheManager();
            textureCacheManager.FileReceived = function (textureData) {
                modelNode.node(0).node(0).node(0).node(0).setSrc(ToTextureSrc(textureData));
                modelNode.data["TextureLoD"] = lod;
            };
            textureCacheManager.GetFile(modelNode.id, lod);
        }

        var texturedMeshNode = _myScene.findNode("TexturedMesh");
        texturedMeshNode.eachNode(
            function () {
                if (lodModello < this.data["ActualLevel"]) {
                    while (!(this.data.hasOwnProperty('l' + lodModello))) {
                        if (--lodModello < 0) break;
                    }
                    if ((lodModello >= 0) && (lodModello < this.data["ActualLevel"])) {
                        var lastChildNode = this.node(0).node(0).node(0);
                        lastChildNode = lastChildNode.addNode(
                            {
                                type: "texture",
                                src: "img/transparentPixel.png",
                                applyTo: "color"
                            }
                        );
                        if (_textureEnable) {
                            LoadTexture(this, lodTexture);
                        }

                        for (var i = 0; i < this.data["l" + lodModello]; i++) {
                            lastChildNode.addNode(
                                {
                                    type: "prims/meshGeometry",
                                    fid: (this.id + "_" + i + "_" + lodModello)
                                }
                            )
                        }
                        this.data["ActualLevel"] = lodModello;
                    }
                }
            },
            {
                andSelf: false,     // Visit our myLookAt node as well
                depthFirst: false   // Descend depth-first into tree
            }
        );
    }

    function LoadMultiTextureMesh(lodModello, lodTexture) {
        function LoadTexture(modelNode, id, lod) {
            var textureCacheManager = new TextureCacheManager();
            textureCacheManager.FileReceived = function (textureData) {
                modelNode.node(0).setSrc(ToTextureSrc(textureData));
                modelNode.data["TextureLoD"] = lod;
            };
            textureCacheManager.GetFile(id, lod);
        }

        var multiTexturedMeshNode = _myScene.findNode("MultiTexturedMesh");
        multiTexturedMeshNode.eachNode(
            function () {
                var multiMeshNode = this.node(0).node(0).node(0);
                multiMeshNode.eachNode(
                    function () {
                        var loadingLod = lodModello;
                        if (loadingLod < this.data["ActualLevel"]) {
                            while (!(this.data.hasOwnProperty('l' + loadingLod))) {
                                if (--loadingLod < 0) break;
                            }
                            if ((loadingLod >= 0) && (loadingLod < this.data["ActualLevel"])) {
                                this.addNode(
                                    {
                                        type: "texture",
                                        src: "img/transparentPixel.png",
                                        applyTo: "color"
                                    }
                                );

                                var id = this.id.split("_");
                                var multiTextureShift = parseInt(id[1]) * 100;
                                var multiTextureLod = multiTextureShift + loadingLod;

                                for (var i = 0; i < this.data["l" + loadingLod]; i++) {
                                    // noinspection JSPotentiallyInvalidUsageOfThis
                                    this.node(0).addNode(
                                        {
                                            type: "prims/meshGeometry",
                                            fid: (id[0] + "_" + i + "_" + multiTextureLod)
                                        }
                                    )
                                }
                                this.data["ActualLevel"] = loadingLod;

                                if (_textureEnable) {
                                    LoadTexture(this, id[0], multiTextureShift + lodTexture);
                                }

                            }
                        }
                    },
                    {
                        andSelf: false,     // Visit our myLookAt node as well
                        depthFirst: false   // Descend depth-first into tree
                    }
                );
            },
            {
                andSelf: false,     // Visit our myLookAt node as well
                depthFirst: false   // Descend depth-first into tree
            }
        );
    }

    function LoadPointClouds(lodModello) {
        var pointCloudNode = _myScene.findNode("PointCloud");
        pointCloudNode.eachNode(
            function () {
                if (lodModello < this.data["ActualLevel"]) {
                    while (!(this.data.hasOwnProperty('l' + lodModello))) {
                        if (--lodModello < 0) break;
                    }
                    if ((lodModello >= 0) && (lodModello < this.data["ActualLevel"])) {
                        for (var i = 0; i < this.data["l" + lodModello]; i++) {
                            this.node(0).node(0).node(0).addNode(
                                {
                                    type: "prims/pointCloudGeometry",
                                    fid: (this.id + "_" + i + "_" + lodModello)
                                }
                            )
                        }
                        this.data["ActualLevel"] = lodModello;
                    }
                }
            },
            {
                andSelf: false,     // Visit our myLookAt node as well
                depthFirst: false   // Descend depth-first into tree
            }
        );
    }

    function Set3DEventHandler(modelCanvas) {
        function SetAuxScene() {
            //_auxScene = SceneJS.scene("the-scene");
            var mainView = _myScene.findNode("mainView");
            _startEye = mainView.getEye();
            _startLook = mainView.getLook();
            _startUpZ = mainView.getUp().z;
        }

        function SceneClickHandler(pageCoordinates, clickedElement) {
            function FindCanvasClickCoordinates(pageCoordinates, clickedElement) {
                while (clickedElement.offsetParent) {
                    pageCoordinates.x -= clickedElement.offsetLeft;
                    pageCoordinates.y -= clickedElement.offsetTop;
                    clickedElement = clickedElement.offsetParent;
                }
                return pageCoordinates;
            }

            function AddNewHotSpot() {
                function InitializeAddNewHotspotDialog(addNewHotspotDialog) {
                    function InitializeDialog() {
                        function AddNewHotspotDialog_OnSubmit() {
                            $.ajax({
                                url: './php/addNewHotspot.php',
                                dataType: "json",
                                data: {
                                    layer0: $("#newHotspotLayer0").data("kendoComboBox").value(),
                                    layer1: $("#newHotspotLayer1").data("kendoComboBox").value(),
                                    layer2: $("#newHotspotLayer2").data("kendoComboBox").value(),
                                    layer3: $("#newHotspotLayer3").data("kendoComboBox").value(),
                                    nome: $("#newHotspotName").data("kendoComboBox").value(),
                                    xc: _pickedObject.worldPos[0],
                                    yc: _pickedObject.worldPos[1],
                                    zc: _pickedObject.worldPos[2],
                                    radius: $("#newHotspotRadius").data("kendoNumericTextBox").value(),
                                    SRS: $("#newHotspotSRS").val(),
                                    translationX: $("#newHotspotWorldTranslationX").data("kendoNumericTextBox").value(),
                                    translationY: $("#newHotspotWorldTranslationY").data("kendoNumericTextBox").value(),
                                    translationZ: $("#newHotspotWorldTranslationZ").data("kendoNumericTextBox").value()
                                },
                                success: function (resultData2) {
                                    if (resultData2 === "success") {
                                        Load3dScene();
                                    } else {
                                        AlertMessage("Unexpected error during adding a new hotspot!", resultData2)
                                    }
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    AlertMessage("Unexpected error during adding a new hotspot!", textStatus + "; " + errorThrown);
                                }
                            });
                        }

                        addNewHotspotDialog.kendoDialog({
                            width: "340px",
                            title: "Add a new hotspot",
                            closable: true,
                            modal: true,
                            actions: [
                                {
                                    text: 'CANCEL',
                                    action: this.close()
                                },
                                {
                                    text: 'ADD',
                                    primary: true,
                                    action: AddNewHotspotDialog_OnSubmit
                                }
                            ]
                        });
                        addNewHotspotDialog.parents(".k-widget").addClass("windowTitle windowIcon addNewObjectDialogTitle addNewObjectDialogIcon");

                        $("#addNewHotspotForm input").on("keyup", function (event) {
                            if (event.key === "Enter") {
                                AddNewHotspotDialog_OnSubmit();
                                addNewHotspotDialog.data("kendoDialog").close();
                            }
                        });
                    }

                    function CreateCombobox(field, label) {
                        $("#newHotspot" + field).kendoComboBox({
                            filter: "contains",
                            filtering: function (e) {
                                e.filter.value = e.filter.value.replace(/%/g, "");
                            },
                            suggest: true,
                            placeholder: "Write or select " + label + "'s value ...",
                            dataTextField: field,
                            dataValueField: field
                        });
                    }

                    function CreateNumericTextBox(fieldId) {
                        $("#" + fieldId).kendoNumericTextBox({
                            decimals: 3,
                            step: 0.001,
                            format: "0.#########"
                        });
                    }

                    // noinspection JSPotentiallyInvalidConstructorUsage
                    InitializeDialog();

                    CreateCombobox("Layer0", _layer0Label);
                    CreateCombobox("Layer1", _layer1Label);
                    CreateCombobox("Layer2", _layer2Label);
                    CreateCombobox("Layer3", _layer3Label);
                    CreateCombobox("Name", _nameLabel);
                    UpdateCombobox(addNewHotspotDialog.data("kendoDialog"));

                    CreateNumericTextBox("newHotspotRadius");
                    CreateNumericTextBox("newHotspotWorldTranslationX");
                    CreateNumericTextBox("newHotspotWorldTranslationY");
                    CreateNumericTextBox("newHotspotWorldTranslationZ");
                }

                function UpdateCombobox(addNewHotspotDialogKendo) {
                    $.ajax({
                        url: './php/getListLayersAndName.php',
                        dataType: "json",
                        success: function (resultData) {
                            for (var field in resultData) {
                                if (field !== "Versione") {
                                    var kendoCombobox = $("#newHotspot" + field).data("kendoComboBox");
                                    kendoCombobox.setDataSource(resultData[field]);
                                    kendoCombobox.value(null);
                                }
                            }

                            $.ajax({
                                url: './php/getBaseInformation.php',
                                dataType: "json",
                                data: {
                                    codiceVersione: _pickedObject["name"].substring(1)
                                },
                                success: function (resultData) {
                                    $("#newHotspotLayer0").data("kendoComboBox").value(resultData["Layer0"]);
                                    $("#newHotspotLayer1").data("kendoComboBox").value(resultData["Layer1"]);
                                    $("#newHotspotLayer2").data("kendoComboBox").value(resultData["Layer2"]);
                                    $("#newHotspotLayer3").data("kendoComboBox").value(resultData["Layer3"]);
                                    $("#newHotspotSRS").val(resultData["SRS"]);
                                    $("#newHotspotWorldTranslationX").data("kendoNumericTextBox").value(resultData["TranslationX"]);
                                    $("#newHotspotWorldTranslationY").data("kendoNumericTextBox").value(resultData["TranslationY"]);
                                    $("#newHotspotWorldTranslationZ").data("kendoNumericTextBox").value(resultData["TranslationZ"]);
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    AlertMessage("Unexpected error while loading base information!", textStatus + "; " + errorThrown);
                                },
                                complete: function () {
                                    addNewHotspotDialogKendo.open();
                                }
                            });
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            AlertMessage("Unexpected error during the update of the search fields!", textStatus + "; " + errorThrown);
                        }
                    });
                }

                var addNewHotspotDialog = $("#addNewHotspotDialog");
                var addNewHotspotDialogKendo = addNewHotspotDialog.data("kendoDialog");
                if (!addNewHotspotDialogKendo) {
                    InitializeAddNewHotspotDialog(addNewHotspotDialog);
                } else {
                    UpdateCombobox(addNewHotspotDialogKendo);
                }

                // noinspection JSJQueryEfficiency
                $("#newHotspotRadius").data("kendoNumericTextBox").value("0.02");
            }

            var coords = FindCanvasClickCoordinates(pageCoordinates, clickedElement);

            /*if (_measureDistance) {
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
                        }*/
            if (_addHotSpotMode) {
                _pickedObject = _myScene.pick({canvasPos: [coords.x, coords.y], rayPick: true});
                if (_pickedObject) {
                    AddNewHotSpot();
                } else {
                    kendo.alert("You must click on a mesh to add an hotspot!");
                }
            } else {
                _pickedObject = _myScene.pick({canvasPos: [coords.x, coords.y]});
                if (_pickedObject) {
                    var pickedObject = Get3dObjectFromName(_pickedObject["name"]);
                    if (_selected3dObjectList.indexOf(pickedObject) === -1) {
                        Select3dObject(pickedObject);
                    } else {
                        Unselect3dObject(pickedObject);
                    }
                } else {
                    UnselectAll3dObjects();
                }
            }
        }

        function SetMouseEventHandler(modelCanvas) {
            function MouseDownHandler(event) {
                SetAuxScene();
                _mouseStartX = event.clientX;
                _mouseStartY = event.clientY;
                switch (event.button) {
                    case 0:
                        _leftMouseDown = true;
                        break;
                    case 1:
                        _centerMouseDown = true;
                        break;
                    case 2:
                        _rightMouseDown = true;
                        _contextMenuToDisable = true;
                        break;
                }
                _isDragging = true;
            }

            function MouseLeftClickHandler(event) {
                SceneClickHandler({x: event.pageX, y: event.pageY}, event.target);
            }

            function MouseMoveHandler(event) {
                if (_isDragging) {
                    _dragged = true;
                    if (_rightMouseDown && _leftMouseDown) {
                        Pan3dY((event.clientY - _mouseStartY) / 100);
                    } else if (_leftMouseDown) {
                        Pan3dXZ((event.clientX - _mouseStartX) / 2000, (event.clientY - _mouseStartY) / 2000)
                    } else {
                        var angleX = ToRad * (event.clientY - _mouseStartY) / 2;
                        var angleZ = ToRad * (event.clientX - _mouseStartX) / 2;
                        if (_rightMouseDown) {
                            Rotate3dXZ(angleX, angleZ);
                        } else if (_centerMouseDown) {
                            LookRotate3dXZ(angleX, angleZ);
                        }
                    }
                }
                /*else if (_measureStep == 1) {
                    var coords = ClickCoordsWithinElement(event);
                    ShowDistanceText(coords);
                }*/
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
            }

            function MouseWheelHandler(event) {
                event.preventDefault();
                SetAuxScene();
                Zoom3d(-event.deltaY / 100);
            }

            function AvoidContextMenu(event) {
                if (_contextMenuToDisable) {
                    event.preventDefault();
                    _contextMenuToDisable = false;
                }
            }

            modelCanvas.addEventListener('mousedown', MouseDownHandler, true);
            document.addEventListener('mousemove', MouseMoveHandler, true);
            document.addEventListener('mouseup', MouseUpHandler, true);
            modelCanvas.addEventListener("wheel", MouseWheelHandler, false);
            document.addEventListener('contextmenu', AvoidContextMenu, false);
        }

        function SetTouchEventHandler(modelCanvas) {
            /**
             * @return {number}
             */
            function ComputeTouchDiff() {
                return ComputeDiagonal(_touchEventCache[0].pageX - _touchEventCache[1].pageX, _touchEventCache[0].pageY - _touchEventCache[1].pageY);
            }

            function TouchStart(event) {
                event.preventDefault();

                SetAuxScene();

                _isTouching = true;
                _touchEventCache.push(event.changedTouches[0]);
                if (_touchEventCache.length === 2) {
                    _startTouchDiff = ComputeTouchDiff();
                }
            }

            function TouchClickHandler(event) {
                SceneClickHandler({x: _touchEventCache[0].pageX, y: _touchEventCache[0].pageY}, event.target);
            }

            function TouchMove(event) {
                function ReplaceTouchEvent(changedTouch) {
                    for (var i = 0; i < _touchEventCache.length; i++) {
                        if (_touchEventCache[i].identifier === changedTouch.identifier) {
                            _touchEventCache[i] = changedTouch;
                            break;
                        }
                    }
                }

                event.preventDefault();

                if (_isTouching) {
                    var changedTouch = event.changedTouches[0];
                    _dragged = true;

                    if (!_isTouchPinch && !_isTouchRotate && _touchEventCache.length === 1) {
                        Pan3dXZ((changedTouch.pageX - _touchEventCache[0].pageX) / 900, (changedTouch.pageY - _touchEventCache[0].pageY) / 900);
                    } else if (!_isTouchRotate && _touchEventCache.length === 2) {
                        _isTouchPinch = true;
                        ReplaceTouchEvent(changedTouch);

                        var currentTouchDiff = ComputeTouchDiff();
                        var zoom = (currentTouchDiff - _startTouchDiff) / (_startTouchDiff * 3 * (Math.abs(_canvasDiagonal - _startTouchDiff) / _canvasDiagonal));
                        if (zoom < 0) {
                            zoom = zoom * 10;
                        } else {
                            if (zoom >= 0.98) {
                                zoom = 0.98;
                            }
                        }
                        Zoom3d(zoom);
                    } else if (_touchEventCache.length === 3) {
                        _isTouchPinch = false;
                        _isTouchRotate = true;
                        if (_touchEventCache[0].identifier === changedTouch.identifier) {
                            Rotate3dXZ(ToRad * (changedTouch.pageY - _touchEventCache[0].pageY), ToRad * (changedTouch.pageX - _touchEventCache[0].pageX));
                        }
                    }
                }
            }

            function TouchEnd(event) {
                function RemoveTouchEnded(identifier) {
                    for (var i = 0; i < _touchEventCache.length; i++) {
                        if (_touchEventCache[i].identifier === identifier) {
                            _touchEventCache.splice(i, 1);
                            if (_touchEventCache.length === 0) {
                                _dragged = false;
                                _isTouching = false;
                                _isTouchPinch = false;
                                _isTouchRotate = false;
                            }
                            break;
                        }
                    }
                }

                event.preventDefault();

                if (_isTouching && !_dragged) {
                    TouchClickHandler(event);
                }

                RemoveTouchEnded(event.changedTouches[0].identifier);
            }

            function TouchCancel(event) {
                TouchEnd(event);
            }

            modelCanvas.addEventListener("touchstart", TouchStart, false);
            modelCanvas.addEventListener("touchmove", TouchMove, false);
            modelCanvas.addEventListener("touchend", TouchEnd, false);
            modelCanvas.addEventListener("touchcancel", TouchCancel, false);
        }

        SetMouseEventHandler(modelCanvas);
        SetTouchEventHandler(modelCanvas);
    }

    ProgressBar(true);

    var modelCanvas = $("#modelCanvas");
    return $.ajax({
        url: './php/modello.php',
        dataType: "json",
        data: {
            aspect: modelCanvas.width() / modelCanvas.height()
        },
        success: function (modello) {
            var lodModello = parseInt($('input[name="modelResolutionRadio"]:checked').val());
            var lodTexture = parseInt($('input[name="textureResolutionRadio"]:checked').val());

            CreateEmptyScene(modello["emptyScene"]);

            AddMesh(modello["TexturedMeshData"], "TexturedMesh");
            AddMesh(modello["MultiTexturedMeshData"], "MultiTexturedMesh");
            AddPointCloud(modello["PointCloudData"]);
            AddHotSpots(modello["HotspotData"]);

            LoadTexturedMesh(lodModello, lodTexture);
            LoadMultiTextureMesh(lodModello, lodTexture);
            LoadPointClouds(lodModello);

            Set3DEventHandler(modelCanvas[0]);

            SetDynamicInformationFields();
        },
        error: function (jqXHR, textStatus, errorThrown) {
            AlertMessage("Unexpected error while loading the models!", textStatus + "; " + errorThrown);
        },
        complete: function () {
            ProgressBar(false);
            console.log("Models loaded!");
        }
    });
}

function ResetView() {
    function DestroyAllChildren(nodeId) {
        var blocchi = _myScene.findNode(nodeId);
        for (var i = blocchi.nodes.length - 1; i >= 0; i--) {
            blocchi.nodes[i].destroy();
        }
    }

    DestroyAllChildren("TexturedMesh");
    DestroyAllChildren("MultiTexturedMesh");
    DestroyAllChildren("HotSpot");
    DestroyAllChildren("PointCloud");
}

/**
 * @return {object, null}
 */
function Get3dObjectFromName(name) {
    if (_myScene) {
        var pickedObject = _myScene.findNode(name);
        if (pickedObject && pickedObject.id.substring(0, 1) === "m" && pickedObject.id.includes("_")) {
            pickedObject = pickedObject.parent.parent.parent.parent;
        }
        return pickedObject;
    } else {
        return null;
    }
}

function Highlight3dObject(object, enable) {
    var textureNode = object.node(0).node(0).node(0);
    textureNode.setParams({colorTransEnabled: enable ? !textureNode.getParams().colorTransEnabled : false});
}

// Common 3d look function
function LookAt3dObject(object) {
    if (object.id.substring(0, 1) === "m") {
        object = object.node(0).node(0).node(0).node(0);
    }

    var mainView = _myScene.findNode("mainView");
    var look = mainView.getLook();

    look.x = object.data["xc"];
    look.y = object.data["yc"];
    look.z = object.data["zc"];

    mainView.setLook(look);
}

function Get3dViewData() {
    var mainView = _myScene.findNode("mainView");
    var eye = mainView.getEye();
    var look = mainView.getLook();
    return {mainView, eye, look};
}

function Get3dViewAngles() {
    var x = _startLook.x - _startEye.x;
    var y = _startLook.y - _startEye.y;
    var z = _startLook.z - _startEye.z;
    var r = Compute3dDiagonal(x, y, z);
    var theta = Math.acos(z / r);
    var phi = Math.atan2(y / r, x / r);
    return {r, theta, phi};
}

function ComputeRadiusProjection(r, theta, phi) {
    var sinTheta = Math.sin(theta);
    return {
        x: r * sinTheta * Math.cos(phi),
        y: r * sinTheta * Math.sin(phi),
        z: r * Math.cos(theta)
    };
}

function Get3dRadiusProjection() {
    var {r, theta, phi} = Get3dViewAngles();
    var rProjection = ComputeRadiusProjection(r, theta, phi);
    return {rProjection, r, theta, phi};
}

function ComputeRotationAngles(angleX, angleZ) {
    var {mainView, eye, look} = Get3dViewData();
    var {r, theta, phi} = Get3dViewAngles();
    theta = theta + angleX * _startUpZ;
    theta = theta % (2 * Math.PI);
    phi = phi - angleZ * _startUpZ;
    var up = mainView.getUp();
    up.z = Math.sin(theta) < 0 ? -_startUpZ : _startUpZ;
    var rProjection = ComputeRadiusProjection(r, theta, phi);
    return {mainView, eye, look, up, rProjection, r, theta, phi};
}

function SetNewEye(mainView, eye, look, rProjection) {
    eye.x = look.x - rProjection.x;
    eye.y = look.y - rProjection.y;
    eye.z = look.z - rProjection.z;
    mainView.setEye(eye);
}

function ResetEye() {
    var mainView = _myScene.findNode("mainView");
    var up = mainView.getUp();
    up.x = 0.0;
    up.y = 0.0;
    up.z = 1.0;
    mainView.setUp(up);
    mainView.setLook(_resetLook);
    mainView.setEye(_resetEye);
}

//GIS scene
function LoadGis() {
    function AddDefaultMaps(layers, gisSettings) {
        function ParseDefaultMapsSettings(gisSettings) {
            var openStreetMap = true;
            var openStreetMapVisible = true;

            gisSettings.forEach(function (setting) {
                switch (setting["Key"]) {
                    case "OpenStreetMap":
                        openStreetMap = setting["BoolValue"] === "t";
                        break;
                    case "OpenStreetMapVisible":
                        openStreetMapVisible = setting["BoolValue"] === "t";
                        break;
                }
            });
            return {openStreetMap, openStreetMapVisible};
        }

        var {openStreetMap, openStreetMapVisible} = ParseDefaultMapsSettings(gisSettings);

        var defaultMapsLayers = [];

        function AddOpenStreetMap(defaultMapsLayers, openStreetMapVisible) {
            defaultMapsLayers.push(new ol.layer.Tile({
                title: 'OpenStreetMap',
                name: 'OpenStreetMap',
                visible: openStreetMapVisible,
                source: new ol.source.OSM()
            }));
        }

        if (openStreetMap) {
            AddOpenStreetMap(defaultMapsLayers, openStreetMapVisible);
        }

        if (defaultMapsLayers.length > 0) {
            layers.push(new ol.layer.Group({
                title: 'Default maps',
                layers: defaultMapsLayers
            }));
        }
    }

    function AddDynamicLayers(layers) {
        return $.ajax({
            url: './php/getGisLayers.php',
            dataType: "json",
            success: function (resultData) {
                var group = null;
                var layerList = [];
                resultData.forEach(function (layerData) {
                    if (group !== layerData["Group"]) {
                        if (group != null) {
                            layers.push(new ol.layer.Group({
                                title: group,
                                layers: layerList
                            }))
                        }
                        group = layerData["Group"];
                        layerList = [];
                    }
                    if (layerData["Tipo"] === "ImageWMS") {
                        layerList.push(new ol.layer.Image({
                            title: layerData["Name"],
                            name: layerData["Title"],
                            visible: layerData["Visible"] === "t",
                            declaredSRS: layerData["DeclaredSRS"],
                            source: new ol.source.ImageWMS({
                                url: layerData["url"],
                                params: {
                                    FORMAT: layerData["Format"],
                                    STYLES: layerData["Style"],
                                    LAYERS: layerData["Layer"],
                                }
                            })
                        }));
                    }
                });
                if (group != null) {
                    layers.push(new ol.layer.Group({
                        title: group,
                        layers: layerList
                    }));
                }
            }
        });
    }

    /**
     * @return {string}
     */
    function InitializeMap(mapContainer, layers, gisSettings) {
        function ParseBaseGisSettings(gisSettings) {
            var centerLongitude = 0;
            var centerLatitude = 0;
            var zoom = 0;
            var coordinatesFractionDigits = 0;
            var projection = "EPSG:3857";

            gisSettings.forEach(function (setting) {
                switch (setting["Key"]) {
                    case "centerLongitude":
                        centerLongitude = parseFloat(setting["RealValue"]);
                        break;
                    case "centerLatitude":
                        centerLatitude = parseFloat(setting["RealValue"]);
                        break;
                    case "zoom":
                        zoom = parseInt(setting["IntValue"]);
                        break;
                    case "coordinatesFractionDigits":
                        coordinatesFractionDigits = parseInt(setting["IntValue"]);
                        break;
                    case "projection":
                        projection = setting["TextValue"];
                        break;
                }
            });
            return {centerLongitude, centerLatitude, zoom, coordinatesFractionDigits, projection};
        }

        var {centerLongitude, centerLatitude, zoom, coordinatesFractionDigits, projection} = ParseBaseGisSettings(gisSettings);

        /*var vector = new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: function(extent) {
                    return 'http://bim3dsurvey.it:8080/geoserver/wfs?service=WFS&' +
                        'version=1.1.0&request=GetFeature&typename=test:testshp&' +
                        'outputFormat=application/json&srsname=EPSG:3857&' +
                        'bbox=' + extent.join(',') + ',EPSG:3857';
                },
                strategy: ol.loadingstrategy.bbox
            }),
            style: new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 255, 1.0)',
                    width: 2
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(0, 0, 255, 0.3)'
                })
            })
        });
        layers.push(new ol.layer.Group({
            title: 'vector',
            layers: [vector]
        }));*/

        var map = new ol.Map({
            target: document.getElementById('mapContainer'),
            layers: layers,
            view: new ol.View({
                center: ol.proj.fromLonLat([centerLongitude, centerLatitude]),
                zoom: zoom
            }),
            controls: ol.control.defaults().extend([
                new ol.control.ScaleLine(),
                new ol.control.FullScreen(),
                new ol.control.OverviewMap(),
                new ol.control.MousePosition({
                    coordinateFormat: ol.coordinate.createStringXY(coordinatesFractionDigits),
                    projection: projection
                })
            ])
        });
        mapContainer.data("map", map);

        map.on('click', function (event) {
            function GetFeatures(layer) {
                if (layer instanceof ol.layer.Image && layer.getVisible() === true) {
                    var url = layer.getSource().getFeatureInfoUrl(
                        event.coordinate,
                        map.getView().getResolution(),
                        map.getView().getProjection(),
                        {
                            'INFO_FORMAT': 'application/json'
                        }
                    );

                    jQuery.support.cors = true;
                    $.ajax({
                        url: url,
                        type: "get",
                        dataType: "json",
                        success: function (resultData) {
                            if (resultData.features.length > 0) {
                                var featureProperties = resultData.features[0].properties;

                                if (featureProperties["layer0"]) {
                                    console.log(featureProperties);
                                }
                            }
                        },
                        error: function () {
                            return null;
                        }
                    });
                    jQuery.support.cors = false;
                }
            }

            var feature = map.forEachFeatureAtPixel(event.pixel, function (feature) {
                return feature;
            });

            if (feature) {

                //var coord = feature.getGeometry().getCoordinates();
                var props = feature.getProperties();
                console.log(props);
                return;
            }

            layers.forEach(function (layer) {
                if (layer instanceof ol.layer.Group) {
                    layer.getLayers().forEach(function (subLayer) {
                        GetFeatures(subLayer);
                    });
                } else {
                    GetFeatures(layer);
                }
            });
        });

        map.on('pointermove', function (e) {
            if (e.dragging) {
                return;
            }
            var pixel = map.getEventPixel(e.originalEvent);
            var hit = map.hasFeatureAtPixel(pixel);
            map.getTarget().style.cursor = hit ? 'pointer' : '';
        });

        return projection;
    }

    function SetLayersExtent(layers, projection) {
        function SetLayerExtent(layer, layersWMS, projection) {
            var layerWMS = layersWMS.find(o => o.Name === layer.get('name'));
            if (layerWMS) {
                var extent = layer.get('declaredSRS') === projection ? layerWMS.BoundingBox[0].extent : ol.proj.transformExtent(layerWMS.BoundingBox[0].extent, layer.get('declaredSRS'), projection);
                layer.setExtent(extent);
            }
        }

        jQuery.support.cors = true;
        $.ajax({
            url: 'http://bim3dsurvey.it:8080/geoserver/test/wms?request=GetCapabilities&service=WMS&version=1.1.1',
            success: function (response) {
                var capabilitiesParser = new ol.format.WMSCapabilities();
                var capabilities = capabilitiesParser.read(response);
                var layersWMS = capabilities.Capability.Layer.Layer;

                layers.forEach(function (layer) {
                    if (layer instanceof ol.layer.Group) {
                        layer.getLayers().forEach(function (subLayer) {
                            SetLayerExtent(subLayer, layersWMS, projection);
                        });
                    } else {
                        SetLayerExtent(layer, layersWMS, projection);
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                AlertMessage("Unexpected error while setting layers extend!", textStatus + "; " + errorThrown);
            }
        });
        jQuery.support.cors = false;
    }

    function AddLayersToGisTreeView(layers) {
        var layersGisTreeView = $("#layersGisTreeView").data("kendoTreeView");
        var layerData = [];
        layers.forEach(function (layer) {
            if (layer instanceof ol.layer.Group) {
                var innerLayerData = [];
                layer.getLayers().forEach(function (subLayer) {
                    innerLayerData.push({
                        text: subLayer.get('title'),
                        id: subLayer.get('name'),
                        checked: subLayer.get('visible')
                    });
                });
                layerData.push({
                    text: layer.get('title'),
                    id: layer.get('name'),
                    expanded: true,
                    items: innerLayerData
                });
            } else {
                layerData.push({text: layer.get('title'), id: layer.get('name')});
            }
        });
        layersGisTreeView.setDataSource(new kendo.data.HierarchicalDataSource({data: layerData}));
    }

    ProgressBar(true);

    var mapContainer = $("#mapContainer");
    var map = mapContainer.data("map");
    if (map) {
        mapContainer.empty();
        mapContainer.data("map", null);
    }

    $.ajax({
        url: './php/getGisSettings.php',
        dataType: "json",
        success: function (gisSettings) {
            var layers = [];

            AddDefaultMaps(layers, gisSettings);

            AddDynamicLayers(layers)
                .then(function () {
                    var projection = InitializeMap(mapContainer, layers, gisSettings);
                    SetLayersExtent(layers, projection);
                    AddLayersToGisTreeView(layers);
                });

            ProgressBar(false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            ProgressBar(false);
            AlertMessage("Unexpected error while reading Gis Settings!", textStatus + "; " + errorThrown);
        }
    });
}

// Camera functions
function Pan3dXZ(moveX, moveZ) {
    if (_myScene) {
        var {mainView, eye, look} = Get3dViewData();
        var {rProjection, r, theta, phi} = Get3dRadiusProjection();

        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);
        var cosTheta = Math.cos(theta);
        look.x = _startLook.x - _startUpZ * moveX * r * sinPhi - _startUpZ * moveZ * r * cosPhi * cosTheta;
        look.y = _startLook.y + _startUpZ * moveX * r * cosPhi - _startUpZ * moveZ * r * sinPhi * cosTheta;
        look.z = _startLook.z + _startUpZ * moveZ * r * Math.sin(theta);

        SetNewEye(mainView, eye, look, rProjection);
        mainView.setLook(look);
    }
}

function Pan3dY(moveY) {
    if (_myScene) {
        var {mainView, eye, look} = Get3dViewData();
        var {rProjection} = Get3dRadiusProjection();

        look.x = _startLook.x - moveY * rProjection.x;
        look.y = _startLook.y - moveY * rProjection.y;
        look.z = _startLook.z - moveY * rProjection.z;

        SetNewEye(mainView, eye, look, rProjection);
        mainView.setLook(look);
    }
}

function Rotate3dXZ(angleX, angleZ) {
    if (_myScene) {
        var {mainView, eye, look, up, rProjection} = ComputeRotationAngles(angleX, angleZ);

        SetNewEye(mainView, eye, look, rProjection);
        mainView.setUp(up);
    }
}

function LookRotate3dXZ(angleX, angleZ) {
    if (_myScene) {
        var {mainView, eye, look, up, rProjection} = ComputeRotationAngles(angleX, angleZ);

        look.x = eye.x + rProjection.x;
        look.y = eye.y + rProjection.y;
        look.z = eye.z + rProjection.z;

        mainView.setLook(look);
        mainView.setUp(up);
    }
}

function Zoom3d(value) {
    if (_myScene) {
        var {mainView, eye} = Get3dViewData();

        eye.x = _startEye.x + value * (_startLook.x - _startEye.x);
        eye.y = _startEye.y + value * (_startLook.y - _startEye.y);
        eye.z = _startEye.z + value * (_startLook.z - _startEye.z);

        mainView.setEye(eye);
    }
}

// 3D selection function
function Select3dObject(object, from3dScene = true) {
    function Add3dObjectToSelected(object) {
        Highlight3dObject(object, true);
        _selected3dObjectList.push(object);
    }

    function SelectObject(codiceVersione) {
        var objectsGrid = $('#objectsGrid').data('kendoGrid');
        var dataItem = GetDataItemFromVersione(codiceVersione);

        if (dataItem == null) {
            GetWriteMode(codiceVersione)
                .then(function (data) {
                    var readonly = data["rw"] !== "t";
                    ResetInformation();
                    UpdateInformation(codiceVersione, readonly);
                    /*UpdateImagePanel(codice);

                    UpdateFilePanel(codice);*/
                });
        } else if (dataItem !== objectsGrid.dataItem(objectsGrid.select())) {
            ObjectGridClearSelection();
            objectsGrid.select("tr[data-uid='" + dataItem["uid"] + "']");
        }
    }

    if (!from3dScene && object === _selected3dObjectList[_selected3dObjectList.length - 1]) {
        return;
    }

    if (_singleSelecting) {
        UnselectAll3dObjects(from3dScene);
    }

    if (object) {
        Add3dObjectToSelected(object);
        LookAt3dObject(object);
        //ChangeTextureLod(pickedObject);

        SelectObject(object.getName().substring(1));
    }
}

function Unselect3dObject(object) {
    Highlight3dObject(object, false);
    _selected3dObjectList.splice(_selected3dObjectList.indexOf(object), 1);

    ResetInformation();
    ObjectGridClearSelection();
}

function UnselectAll3dObjects(from3dScene = true) {
    for (var i in _selected3dObjectList) {
        Highlight3dObject(_selected3dObjectList[i], false);
    }
    _selected3dObjectList = [];

    ResetInformation();
    if (from3dScene) {
        ObjectGridClearSelection();
    }
}

//Utility
/**
 * @return {string}
 */
function GetLocaleDate(data) {
    return data != null ? GetDateTime(data).toLocaleDateString() : "";
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
function GetLocaleDateTime(data) {
    return data != null ? GetDateTime(data).toLocaleString() : "";
}

/**
 * @return {number}
 */
function ComputeDiagonal(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

/**
 * @return {number}
 */
function Compute3dDiagonal(x, y, z) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(z, 2));
}

function AlertMessage(alertMessage, logMessage) {
    console.log(logMessage);
    kendo.alert(alertMessage);
}

function ProgressBar(display) {
    var body = $(document.body);
    kendo.ui.progress(body, display);
}

function RefreshKendoComboValue(inputFieldKendo) {
    var tmpValue;
    switch (inputFieldKendo.ns) {
        case ".kendoComboBox":
            tmpValue = inputFieldKendo.select();
            inputFieldKendo.select(-1);
            inputFieldKendo.refresh();
            inputFieldKendo.select(tmpValue);
            break;
        case ".kendoMultiSelect":
            tmpValue = inputFieldKendo.value();
            inputFieldKendo.value(-1);
            inputFieldKendo.refresh();
            inputFieldKendo.value(tmpValue);
            break;
    }
}

function KendoCheckBoxReadOnly_PreventClick(event) {
    event.preventDefault();
}

function KendoDropDownList_EnableClearButton(controlKendo) {
    function ShowHideClearButton(event) {
        var sender = event.sender;
        var senderElement = $(sender.wrapper[0]);
        var clearButton = senderElement.find("span.k-clear-value");
        var isReadonly = senderElement.children("input").attr("readonly") === "readonly";

        if (sender.selectedIndex === -1 || isReadonly) {
            clearButton.addClass("k-hidden");
        } else {
            clearButton.removeClass("k-hidden");
        }
    }

    // noinspection JSDeprecatedSymbols
    var html = '<!--suppress HtmlUnknownAttribute --><span unselectable="on" class="k-icon k-clear-value k-i-close k-hidden" title="clear" role="button" tabindex="-1" onclick="KendoDropDownList_OnClearButtonClick(event)"></span>';
    $(controlKendo.wrapper[0]).children("span.k-dropdown-wrap").prepend(html);
    controlKendo.bind("cascade", ShowHideClearButton);
}

function KendoDropDownList_OnClearButtonClick(event) {
    event.preventDefault();
    event.stopPropagation();

    var senderDropDown = $(event.currentTarget).parents(".k-dropdown");
    var senderKendo = senderDropDown.children("input").data("kendoDropDownList");
    senderKendo.value(null);
}

function ToggleKendoWindow(windowId) {
    var kendoWindow = $("#" + windowId).data("kendoWindow");
    if (!kendoWindow.options.visible) {
        kendoWindow.open();
    } else {
        kendoWindow.close();
    }
}

/**
 * @return {null}
 */
function GetLayerByName(map, name) {
    var result = null;
    map.getLayers().forEach(function (layer) {
        if (layer instanceof ol.layer.Group) {
            layer.getLayers().forEach(function (subLayer) {
                if (subLayer.get('name') === name) {
                    result = subLayer;
                }
            });
        } else {
            if (layer.get('name') === name) {
                result = layer;
            }
        }
    });
    return result;
}