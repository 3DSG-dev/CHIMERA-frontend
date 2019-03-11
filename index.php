<?php
    include("php/auth.php");
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $_SESSION['titolo']; ?></title>

        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta charset="iso-8859-15">

        <script src="libs/jquery-3.3.1.min.js"></script>

        <!-- Common Kendo UI CSS for web widgets and widgets for data visualization. -->
        <!--<link href="libs/KendoUI/styles/kendo.common.min.css" rel="stylesheet" />-->
        <!-- (Optional) RTL CSS for Kendo UI widgets for the web. Include only in right-to-left applications. -->
        <link href="libs/KendoUI/styles/kendo.rtl.min.css" rel="stylesheet" type="text/css" />
        <!-- Default Kendo UI theme CSS for web widgets and widgets for data visualization. -->
        <link href="libs/KendoUI/styles/kendo.default.min.css" rel="stylesheet" type="text/css" />
        <!-- (Optional) Kendo UI Hybrid CSS. Include only if you will use the mobile devices features. -->
        <link href="libs/KendoUI/styles/kendo.default.mobile.min.css" rel="stylesheet" type="text/css" />
        <script src="libs/KendoUI/kendo.all.min.js"></script>
        <link rel="stylesheet" type="text/css" href="css/KendoUI.css" />
        <link rel="stylesheet" type="text/css" href="css/KendoUIBootstrap.css" />

        <!--suppress JSUnusedLocalSymbols -->
        <script>
            var _layer0Label = "<?php  echo $_SESSION["layer0Label"]; ?>";
            var _layer1Label = "<?php echo $_SESSION["layer1Label"]; ?>";
            var _layer2Label = "<?php echo $_SESSION["layer2Label"]; ?>";
            var _layer3Label = "<?php echo $_SESSION["layer3Label"]; ?>";
            var _nameLabel = "<?php echo $_SESSION["nomeLabel"]; ?>";
            var _versionLabel = "<?php echo $_SESSION["versionLabel"]; ?>";
            var _validUser = "<?php echo isset($_SESSION['validUser']); ?>";
        </script>

        <script type="text/javascript" src="js/BIM3DSG.js" charset="iso-8859-15"></script>

        <link rel="stylesheet" type="text/css" href="css/BIM3DSG.css" />
    </head>
    <body>
        <div id="pageContainer">
            <div id="headerContainer">
                <div id="logo3DSurveySmall" class="loghi">
                    <a href="http://www.sitech-3dsurvey.polimi.it" target="_blank">
                        <img src="img/logo_3dsurvey_60.png" alt="Logo 3D Survey">
                    </a>
                </div>
                <div id="logo3DSurveyLarge" class="loghi">
                    <a href="http://www.sitech-3dsurvey.polimi.it" target="_blank">
                        <img src="img/logo_3dsurvey_full_60.png" alt="Logo 3D Survey">
                    </a>
                </div>
                <div id="logoPolimiSmall" class="loghi">
                    <a href="http://www.polimi.it" target="_blank">
                        <img src="img/logo_polimi_60.png" alt="Logo Polimi">
                    </a>
                </div>
                <div id="logoPolimiLarge" class="loghi">
                    <a href="http://www.polimi.it" target="_blank">
                        <img src="img/logo_polimi_full_60.png" alt="Logo Polimi">
                    </a>
                </div>

                <?php
                    if (isset($_SESSION['validUser'])) {
                        echo '
                            <div id="logoutButton" class="logoutIcon userInfo">
                                <a href="php/logout.php" title="Logout ' . $_SESSION['validUserName'] . '"><img src="img/lock_icon_grey.png" alt="logout"></a>
                            </div>
                            <div id="userContainer">
                                <div id="userPicture" class="userInfo" style=\'background-image: url("img/user_icon.png")\'></div>
                                <div id="userName" class="userInfo">' . $_SESSION['fullName'] . '</div>
                            </div>
                        ';
                    }
                ?>
            </div>

            <div id="pageContent">
                <div class="pageSection selectObjectSection">
                    <div class="pageRow selectObjectRow">
                        <div class="pageColumn selectObjectColumn">
                            <h2>Select object to edit</h2>

                            <div class="selectObjectSearchFieldsContainer">
                                <div class="selectObjectComboContainer col-md-4 col-sm-6 col-xs-12">
                                    <label for="selectLayer0"><?php echo $_SESSION["layer0Label"]; ?></label>
                                    <input id="selectLayer0" type="text" />
                                </div>
                                <div class="selectObjectComboContainer col-md-4 col-sm-6 col-xs-12">
                                    <label for="selectLayer1"><?php echo $_SESSION["layer1Label"]; ?></label>
                                    <input id="selectLayer1" type="text">
                                </div>
                                <div class="selectObjectComboContainer col-md-4 col-sm-6 col-xs-12">
                                    <label for="selectLayer2"><?php echo $_SESSION["layer2Label"]; ?></label>
                                    <input id="selectLayer2" type="text">
                                </div>
                                <div class="selectObjectComboContainer col-md-4 col-sm-6 col-xs-12">
                                    <label for="selectLayer3"><?php echo $_SESSION["layer3Label"]; ?></label>
                                    <input id="selectLayer3" type="text">
                                </div>
                                <div class="selectObjectComboContainer col-md-4 col-sm-6 col-xs-12">
                                    <label for="selectName"><?php echo $_SESSION["nomeLabel"]; ?></label>
                                    <input id="selectName" type="text">
                                </div>
                                <div class="selectObjectComboContainer col-md-4 col-sm-6 col-xs-12">
                                    <label for="selectVersione"><?php echo $_SESSION["versionLabel"]; ?></label>
                                    <input id="selectVersione" type="text">
                                </div>
                            </div>

                            <div class="selectObjectButtonsContainer">
                                <div class="buttonContainer selectObjectSearchButton">
                                    <button onclick="SearchObjects()" class="buttonBordered">SEARCH</button>
                                </div>

                                <div class="buttonContainer selectObjectUseyourlistButton">
                                    or
                                    <button onclick="LoadUserListObjectGrid()" class="buttonBordered">USE YOUR LIST</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="objectsGridContainer" class="pageSection">
                    <div id="objectsGrid"></div>
                </div>
            </div>

            <div id="sideToolbarContainer">
                <div id="sideToolbarList" class="k-widget k-listview k-selectable">
                    <div class="sideToolbarItem">
                        <span class="sideToolbarButton mode3dBtn" title="Go to 3D mode">
                            <img src="img/3d_mode_icon.png" alt="3D Mode">
                        </span>
                    </div>
                    <div class="sideToolbarSeparator"></div>
                    <div class="sideToolbarItem">
                        <span class="sideToolbarButton" title="Delete list">
                            <img src="img/delete_list_icon.png" alt="Delete list">
                        </span>
                    </div>
                    <div class="sideToolbarItem">
                        <span id="informationButton" class="sideToolbarButton" title="Information">
                            <img src="img/information_icon.png" alt="Information">
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <?php if (!isset($_SESSION['validUser'])) {
            echo '
                    <div id="loginDialog"></div>
                ';
        }
        ?>

        <div id="informationWindow" class="fixedPosition">
            <div id="informationWindowTabControl">
                <ul>
                    <li class="k-state-active">Object information</li>
                    <li>Version information</li>
                    <li>Subversion information</li>
                </ul>

                <div id="informationWindowTabObject" class="informationWindowTabItem">
                    <div class="cardContainer col-md-6-boxed col-xs-12">
                        <h3 class="sheetTitle">Main information</h3>
                        <div class="informationFieldContainer">
                            <label for="infoLayer0"><?php echo $_SESSION["layer0Label"]; ?></label>
                            <input id="infoLayer0" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoLayer1"><?php echo $_SESSION["layer1Label"]; ?></label>
                            <input id="infoLayer1" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoLayer2"><?php echo $_SESSION["layer2Label"]; ?></label>
                            <input id="infoLayer2" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoLayer3"><?php echo $_SESSION["layer3Label"]; ?></label>
                            <input id="infoLayer3" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoName"><?php echo $_SESSION["nomeLabel"]; ?></label>
                            <input id="infoName" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoCreated">Created</label>
                            <input id="infoCreated" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoRemoved">Removed</label>
                            <input id="infoRemoved" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoCantiereCreazione">Added during campaign n&ordm;</label>
                            <input id="infoCantiereCreazione" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoCantiereCreazioneInizio"> .started</label>
                            <input id="infoCantiereCreazioneInizio" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoCantiereCreazioneFine"> .closed</label>
                            <input id="infoCantiereCreazioneFine" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoCantiereEliminazione">Removed during campaign n&ordm;</label>
                            <input id="infoCantiereEliminazione" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoCantiereEliminazioneInizio"> .started</label>
                            <input id="infoCantiereEliminazioneInizio" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoCantiereEliminazioneFine"> .closed</label>
                            <input id="infoCantiereEliminazioneFine" type="text" class="k-textbox" readonly />
                        </div>
                    </div>

                    <div id="infoWndCategoryCard" class="cardContainer col-md-6-boxed col-xs-12">
                        <h3 class="sheetTitle">Category</h3>
                        <div class="informationFieldContainer">
                            <label for="infoCategory">Category</label>
                            <input id="infoCategory" type="text">
                        </div>
                        <div class="buttonContainer">
                            <button class="buttonBordered">SAVE</button>
                        </div>
                    </div>

                    <div id="infoWndProvaCard" class="cardContainer col-md-6-boxed col-xs-12">
                        <h3 class="sheetTitle">Prova informations</h3>
                        <div class="informationFieldContainer ">
                            <label for="selectNumber">Number</label>
                            <input id="selectNumber" type="number" value="" min="0" max="100" step="1" />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="selectNumberDecimal">Number Decimal</label>
                            <input id="selectNumberDecimal" type="number" value="" min="0" max="100" step="1" />
                        </div>
                        <div class="informationFieldContainer ">
                            <label for="selectDropDown">Dropdown list</label>
                            <input id="selectDropDown" />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="selectDate">Data</label>
                            <input id="selectDate">
                        </div>
                        <div class="informationFieldContainer">
                            <label for="selectCheckbox" class="k-checkbox-label">Checkbox</label>
                            <input id="selectCheckbox" type="checkbox" class="k-checkbox">
                        </div>
                        <div style="clear:both"></div>
                        <div class="buttonContainer">
                            <button class="buttonBordered">SAVE</button>
                        </div>
                    </div>

                </div>
                <div id="versionInfoTab" class="infownd-tabitem">
                    <div id="versionInformationSheet" class="cardContainer col-md-6-boxed col-xs-12">
                        <h3 class="sheetTitle">Internal information</h3>
                        <div class="informationFieldContainer">
                            <label for="infoCodiceOggetto">Codice Oggetto</label>
                            <input id="infoCodiceOggetto" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoCodiceVersione">Codice Versione</label>
                            <input id="infoCodiceVersione" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoVersione">Versione</label>
                            <input id="infoVersione" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoOriginale">Originale</label>
                            <input id="infoOriginale" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoCodiceModello">Codice Modello</label>
                            <input id="infoCodiceModello" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoLive">State</label>
                            <input id="infoLive" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoLastUpdateBy">Update by</label>
                            <input id="infoLastUpdateBy" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoLastUpdate">Update on</label>
                            <input id="infoLastUpdate" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoLock">Lock by</label>
                            <input id="infoLock" type="text" class="k-textbox" readonly />
                        </div>
                    </div>
                    <div id="modelInformationSheet" class="cardContainer col-md-6-boxed col-xs-12">
                        <h3 class="sheetTitle">Model information</h3>
                        <div class="informationFieldContainer">
                            <label for="infoCodiceModello2">Codice Modello</label>
                            <input id="infoCodiceModello2" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoSuperficie">Area</label>
                            <input id="infoSuperficie" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoVolume">Volume</label>
                            <input id="infoVolume" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoUpdateBy">Update by</label>
                            <input id="infoUpdateBy" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoUpdateOn">Update on</label>
                            <input id="infoUpdateOn" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoCenterX">Center x</label>
                            <input id="infoCenterX" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoCenterY">Center y</label>
                            <input id="infoCenterY" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoCenterZ">Center z</label>
                            <input id="infoCenterZ" type="text" class="k-textbox" readonly />
                        </div>
                        <div class="informationFieldContainer">
                            <label for="infoRadius">Diagonal</label>
                            <input id="infoRadius" type="text" class="k-textbox" readonly />
                        </div>
                    </div>
                    <div id="subversionInfoTab" class="infownd-tabitem">
                    </div>
                </div>
            </div>
    </body>
</html>