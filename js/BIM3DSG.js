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
        spazioPerLoghi -= $("#userContainer").outerWidth() + $("#logoutLinkContainer").outerWidth();
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
        var availableSpace = $(window).height() - $("#headerContainer").outerHeight() - $("#selectObjectContainer").outerHeight();
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
        }
        else {
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
                }
                else {
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
        }
        else if ($("#infoCategoryContainer").hasClass("informationColumnRight")) {
            $(".informationWindowTabItem .boxedContainer").removeClass("informationColumnLeft informationColumnRight");
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
            SetObjectGridDataSource(resultData);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            kendo.alert("Unexpected error while loading import list!");
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
            SetObjectGridDataSource(resultData);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            kendo.alert("Unexpected error while searching objects!");
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
                kendo.alert(resultData["addimportcodice"]);
            }
            UpdateInformation(dataItem["CodiceVersione"], dataItem["readonly"])
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            kendo.alert("Unexpected error while adding object to your list!");
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
                            kendo.alert(resultData2["addimportcodice"]);
                        }
                        UpdateInformation(dataItem["CodiceVersione"], dataItem["readonly"])
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        dataItem.set("readonly", null);
                        console.log(textStatus, errorThrown);
                        kendo.alert("Unexpected error while adding object to your list!");
                    }
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            kendo.alert("Unexpected error while removing object to your list!");
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
            kendo.alert("Unexpected error while removing object to your list!");
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
                console.log(textStatus, errorThrown);
                kendo.alert("Unexpected error during the update of the category list!");
            }
        });
    }

    function CreateDynamicInformationFields() {
        function DeleteDynamicInformationFields() {
            $("#informationSubVersionTab").empty();
            $("#informationWindowTabControl").find("div.boxedContainer").each(function (i, sheet) {
                if (sheet.dataset["codice"] > 0) {
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
                    if (field["IsTitle"] === "t") {
                        html += '                        <h4>' + field["Campo"] + '</h4>\n';
                    }
                    else if (field["IsSeparator"] === "t") {
                        html += '                        <hr class="k-separator">\n';
                    }
                    else if (field["IsBool"] === "t") {
                        html += '                        <div class="informationFieldContainer">\n';
                        html += '                            <div class="labelContainer labelCheckboxContainer">' + field["Campo"] + '</div>\n';
                        html += '                            <div class="inputCheckboxContainer">\n';
                        html += '                               <input data-tipo="bool" data-codice="' + field["Codice"] + '" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '" data-role="checkboxinfo" type="checkbox" class="k-checkbox" />\n';
                        html += '                               <label class="k-checkbox-label" for="' + destinationTab + '_' + field["Codice"] + '"></label>\n';
                        html += '                            </div>\n';
                        html += '                        </div>\n';
                    }
                    else {
                        html += '                        <div class="informationFieldContainer">\n';
                        html += '                            <div class="labelContainer"><label for="' + destinationTab + '_' + field["Codice"] + '">' + field["Campo"] + '</label></div>\n';
                        if (field["IsTimestamp"] === "t") {
                            html += '                            <input data-tipo="timestamp" data-codice="' + field["Codice"] + '" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '" name="' + destinationTab + '_' + field["Codice"] + '">\n';
                            html += '                            <span class="k-invalid-msg" data-for="' + destinationTab + '_' + field["Codice"] + '"></span>\n';
                        }
                        else if (field["IsInt"] === "t") {
                            html += '                            <input data-tipo="int" data-codice="' + field["Codice"] + '" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '" type="number">\n';
                        }
                        else if (field["IsReal"] === "t") {
                            html += '                            <input data-tipo="real" data-codice="' + field["Codice"] + '" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '" type="number">\n';
                        }
                        else if (field["IsCombo"] === "t") {
                            html += '                            <select data-tipo="combo" data-codice="' + field["Codice"] + '" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '"></select>\n';
                        }
                        else if (field["IsMultiCombo"] === "t") {
                            html += '                            <select data-tipo="multicombo" data-codice="' + field["Codice"] + '" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '"></select>\n';
                        }
                        else {
                            field["Height"] = field["Height"] / 22;
                            if (field["Height"] > 1) {
                                html += '                            <textarea data-tipo="text" data-codice="' + field["Codice"] + '" data-role="textinfo" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '" style="height: ' + field["Height"] * 31 + 'px" type="text" class="k-textbox" readonly></textarea>\n';
                            }
                            else {
                                html += '                            <input data-tipo="text" data-codice="' + field["Codice"] + '" data-role="textinfo" data-destination="' + destinationTab + '" id="' + destinationTab + '_' + field["Codice"] + '" type="text" class="k-textbox" readonly/>\n';
                            }
                        }
                        html += '                        </div>\n';
                    }
                    return html;
                }

                var html = "";
                var currentSheet = -1;
                $.each(fieldsList, function (key, field) {
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
                                template: '#:Value#<span class="k-icon k-i-edit buttonDropdownItemEdit" data-codice="#:Codice#" data-value="#:Value#" data-ref="' + inputField.id + '" onclick="ChangeComboValueDialogOpen(event)"></span><span class="k-icon k-i-delete buttonDropdownItemErase" data-codice="#:Codice#" data-value="#:Value#" data-ref="' + inputField.id + '" onclick="RemoveComboValue(event)"></span>',
                                footerTemplate: AddComboValueHtml
                            });
                            inputFieldSel.data("kendoComboBox").readonly();
                            break;
                        case "multicombo":
                            inputFieldSel.kendoMultiSelect({
                                dataTextField: "Value",
                                dataValueField: "Codice",
                                filter: "contains",
                                template: '#:Value#<span class="k-icon k-i-edit buttonDropdownItemEdit" data-codice="#:Codice#" data-value="#:Value#" data-ref="' + inputField.id + '" onclick="ChangeComboValueDialogOpen(event)"></span><span class="k-icon k-i-delete buttonDropdownItemErase" data-codice="#:Codice#" data-value="#:Value#" data-ref="' + inputField.id + '" onclick="RemoveComboValue(event)"></span>',
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

        function CreateSubVersionInformationField(schedeSubVersion, maxSubVersion) {
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
                    var html = '   <li id="infoInterventionPanel-' + subVersion + '" data-subversion="' + subVersion + '" class="hidden"> Intervention ' + subVersion + '\n';
                    html += '       <div id="infoInterventiSubVersionContent"' + subVersion + ' data-ref="InterventiSubVersion" data-subversion="' + subVersion + '" class="subVersionPanelItem">\n';
                    html += '       </div> \n';
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
                        //TODO
                        break;
                }
            });
        }

        DeleteDynamicInformationFields();

        $.ajax({
            url: './php/getInformationFields.php',
            dataType: "json",
            success: function (resultData) {
                CreateInformationFieldSingleTab(resultData["SchedeOggetto"], "informationObjectTab");
                CreateInformationFieldSingleTab(resultData["SchedeVersione"], "informationVersionTab");
                CreateSubVersionInformationField(resultData["SchedeSubVersion"], parseInt(resultData["MaxSubVersion"]));

                ChangeInformationFieldsStyle(true);
                FillAllComboValues();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                kendo.alert("Unexpected error while creating dynamic object information fields!");
            }
        });

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
            if (elem.dataset["codice"] > 0) {
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
                                    //TODO
                                    break;
                            }
                        });
                        ChangeInformationFieldsStyle(true);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                        kendo.alert("Unexpected error while loading visible information sheet!");
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
                console.log(textStatus, errorThrown);
                kendo.alert("Unexpected error while loading base information!");
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
                    switch (expander.dataset["ref"]) {
                        case "OggettiSubVersion":
                            var codiceSubVersion = resultData["CodiceSubVersion" + expander.dataset["subversion"]];
                            if (codiceSubVersion > 0) {
                                expander.dataset["codice"] = codiceSubVersion;
                                $(expander).parent().removeClass("hidden");
                                SetFieldValue(resultData["InformazioniSubVersion" + expander.dataset["subversion"]], expander.id);
                            }
                            break;
                        case "InterventiSubVersion":
                            //TODO
                            break;
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                kendo.alert("Unexpected error while loading dynamic information!");
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
    UpdateDynamicInformation(codiceVersione);
    SetWriteMode(readonly === "f");
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
                if (inputField.dataset["destination"].startsWith("informationSubVersionContent")) {
                    codice = destinationControl[0].dataset["codice"];
                }
                else {
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
                console.log(textStatus, errorThrown);
                kendo.alert("Unexpected error while saving objectInformation!");
            }
        });
    }

    if ($("#informationReadOnlySwitch").data("kendoSwitch").check()) {
        var sheet = $(this).parents(".boxedContainer");
        sheet.find("input, textarea, select").each(function (i, inputField) {
            SaveInformation(inputField);
        });
        kendo.alert("Save completed!")
    }
    else {
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
                UpdateInformation($("#infoCodiceVersione").val(), "f");
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                kendo.alert("Unexpected error while change object category!");
            }
        });
    }
    else {
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
            FillComboValuesSingleTab(resultData["ComboSubVersion"], "informationSubVersionTab");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            kendo.alert("Unexpected error during the update of the combobox fields!");
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
            console.log(textStatus, errorThrown);
            kendo.alert("Unexpected error during the update of the combobox fields!");
        }
    });
}

function AddNewComboValue(inputId, addValue) {
    var inputSel = $("#" + inputId);
    var dbReference = $("#" + inputSel[0].dataset["destination"])[0].dataset["ref"];
    var codiceCampo = inputSel[0].dataset["codice"];
    $.ajax({
        url: './php/addInformationComboValue.php',
        dataType: "json",
        data: {
            dbReference: dbReference,
            codiceCampo: codiceCampo,
            addValue: addValue
        },
        success: function () {
            var inputFieldKendo = inputSel[0].dataset["tipo"] === "combo" ? inputSel.data("kendoComboBox") : inputSel.data("kendoMultiSelect");
            if (dbReference === "OggettiSubVersion") {
                $("#informationSubVersionTab").find("input, select").each(function (i, inputField) {
                    if (inputField.dataset["codice"] === codiceCampo) {
                        inputSel = $(inputField);
                        inputFieldKendo = inputField.dataset["tipo"] === "combo" ? inputSel.data("kendoComboBox") : inputSel.data("kendoMultiSelect");
                        FillComboValues(inputFieldKendo, dbReference, codiceCampo);
                    }
                });
            }
            else {
                FillComboValues(inputFieldKendo, dbReference, codiceCampo);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            kendo.alert("Unexpected error during the update of the combobox fields!");
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
        var dbReference = $("#" + inputSel[0].dataset["destination"])[0].dataset["ref"];
        var codiceCampo = inputSel[0].dataset["codice"];
        $.ajax({
            url: './php/changeInformationComboValue.php',
            dataType: "json",
            data: {
                dbReference: dbReference,
                codiceCombo: newValueInput[0].dataset["codice"],
                newValue: newValueInput.val()
            },
            success: function () {
                var inputFieldKendo = inputSel[0].dataset["tipo"] === "combo" ? inputSel.data("kendoComboBox") : inputSel.data("kendoMultiSelect");
                FillComboValues(inputFieldKendo, dbReference, codiceCampo);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
                kendo.alert("Unexpected error during the update of the combobox fields!");
            }
        });
    }

    event.preventDefault();

    var renameComboDialog = $('#changeComboValueDialog');
    var renameComboDialogKendo = renameComboDialog.data("kendoDialog");
    if (renameComboDialogKendo) {
        renameComboDialogKendo.open();
    }
    else {
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
            var dbReference = $("#" + inputSel[0].dataset["destination"])[0].dataset["ref"];
            var codiceCampo = inputSel[0].dataset["codice"];
            $.ajax({
                url: './php/removeInformationComboValue.php',
                dataType: "json",
                data: {
                    dbReference: dbReference,
                    codiceCombo: senderElement.dataset["codice"]
                },
                success: function () {
                    var inputFieldKendo = inputSel[0].dataset["tipo"] === "combo" ? inputSel.data("kendoComboBox") : inputSel.data("kendoMultiSelect");
                    if (dbReference === "OggettiSubVersion") {
                        $("#informationSubVersionTab").find("input, select").each(function (i, inputField) {
                            if (inputField.dataset["codice"] === codiceCampo) {
                                inputSel = $(inputField);
                                inputFieldKendo = inputField.dataset["tipo"] === "combo" ? inputSel.data("kendoComboBox") : inputSel.data("kendoMultiSelect");
                                FillComboValues(inputFieldKendo, dbReference, codiceCampo);
                            }
                        });
                    }
                    else {
                        FillComboValues(inputFieldKendo, dbReference, codiceCampo);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                    kendo.alert("Unexpected error during the update of the combobox fields!");
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
                    version: $("#selectVersione").data("kendoComboBox").value()
                },
                success: function (resultData) {
                    for (var field in resultData) {
                        $("#select" + field).data("kendoComboBox").setDataSource(resultData[field]);
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                    kendo.alert("Unexpected error during the update of the search fields!");
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
                var infoCategoryKendo = $("#infoCategory").kendoDropDownList({
                    dataTextField: "Nome",
                    dataValueField: "Codice",
                    filter: "contains"
                }).data("kendoDropDownList");
                KendoDropDownList_EnableClearButton(infoCategoryKendo);
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

//Utility
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
 * @return {string}
 */
function GetLocaleDate(data) {
    return data != null ? GetDateTime(data).toLocaleDateString() : "";
}

function KendoCheckBoxReadOnly_PreventClick(event) {
    event.preventDefault();
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

function KendoDropDownList_EnableClearButton(controlKendo) {
    function ShowHideClearButton(event) {
        var sender = event.sender;
        var senderElement = $(sender.wrapper[0]);
        var clearButton = senderElement.find("span.k-clear-value");
        var isReadonly = senderElement.children("input").attr("readonly") === "readonly";

        if (sender.selectedIndex === -1 || isReadonly) {
            clearButton.addClass("k-hidden");
        }
        else {
            clearButton.removeClass("k-hidden");
        }
    }

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