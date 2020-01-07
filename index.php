<?php
    include("./php/auth.php");
?>

<!DOCTYPE html>
<!--suppress HtmlRequiredLangAttribute -->
<html>
<head>
    <title><?php echo $_SESSION['title']; ?></title>

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta charset="iso-8859-15">

    <script src="./libs/jquery-3.3.1.min.js"></script>

    <!-- Common Kendo UI CSS for web widgets and widgets for data visualization. -->
    <link href="./libs/KendoUI/styles/kendo.common.min.css" rel="stylesheet"/>
    <!-- (Optional) RTL CSS for Kendo UI widgets for the web. Include only in right-to-left applications. -->
    <link href="./libs/KendoUI/styles/kendo.rtl.min.css" rel="stylesheet" type="text/css"/>
    <!-- Default Kendo UI theme CSS for web widgets and widgets for data visualization. -->
    <link href="./libs/KendoUI/styles/kendo.default.min.css" rel="stylesheet" type="text/css"/>
    <!-- (Optional) Kendo UI Hybrid CSS. Include only if you will use the mobile devices features. -->
    <link href="./libs/KendoUI/styles/kendo.default.mobile.min.css" rel="stylesheet" type="text/css"/>
    <script src="./libs/KendoUI/kendo.all.min.js"></script>
    <link rel="stylesheet" type="text/css" href="./css/KendoUI.css"/>

    <!--suppress SpellCheckingInspection -->
    <script src="./libs/dexie.js"></script>

    <!--<script type="text/javascript" src="http://scenejs.org/api/latest/scenejs.js"></script>-->
    <!--suppress SpellCheckingInspection -->
    <script type="text/javascript" src="./libs/SceneJS/scenejs-4.2.2.js"></script>

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

    <script type="text/javascript" src="./js/MeshCacheManager.js"></script>
    <script type="text/javascript" src="./js/PointCloudCacheManager.js"></script>
    <script type="text/javascript" src="./js/TextureCacheManager.js"></script>
    <script type="text/javascript" src="./js/BIM3DSG.js" charset="iso-8859-15"></script>

    <link rel="stylesheet" type="text/css" href="./css/BIM3DSG.css"/>
</head>
<body>
<div id="pageContainer">
    <div id="headerContainer">
        <div id="logo3DSurveySmall" class="logoContainer">
            <a href="http://www.sitech-3dsurvey.polimi.it" target="_blank">
                <img src="./img/loghi/logo_3dsurvey_tiny.png" alt="Logo 3D Survey Group">
            </a>
        </div>
        <div id="logo3DSurveyLarge" class="logoContainer">
            <a href="http://www.sitech-3dsurvey.polimi.it" target="_blank">
                <img src="./img/loghi/logo_3dsurvey_full.png" alt="Logo 3D Survey Group">
            </a>
        </div>
        <div id="logoPolimiSmall" class="logoContainer">
            <a href="http://www.polimi.it" target="_blank">
                <img src="./img/loghi/logo_polimi_tiny.png" alt="Logo Politecnico di Milano">
            </a>
        </div>
        <div id="logoPolimiLarge" class="logoContainer">
            <a href="http://www.polimi.it" target="_blank">
                <img src="./img/loghi/logo_polimi_full.png" alt="Logo Politecnico di Milano">
            </a>
        </div>

        <?php
            if (isset($_SESSION['validUser'])) {
                echo '
                            <div id="logoutLinkContainer">
                                <a href="php/logout.php" title="Logout ' . $_SESSION['validUserName'] . '"><img src="img/icons/lock.png" alt="logout"></a>
                            </div>
                            <div id="userContainer">
                                <div id="userPicture" class="userInfo"></div>
                                <div id="userName" class="userInfo">' . $_SESSION['fullName'] . '</div>
                            </div>
                        ';
            }
        ?>
    </div>

    <div id="pageContent">
        <div id="selectObjectContainer" class="pageSection">
            <div id="selectObjectRow" class="pageRow">
                <div id="selectObjectColumn" class="pageColumn">
                    <h2>Select object to edit</h2>
                    <div class="selectObjectSearchFieldsContainer">
                        <div class="selectObjectComboContainer">
                            <label for="selectLayer0"><?php echo $_SESSION["layer0Label"]; ?> filter</label>
                            <input id="selectLayer0" type="text"/>
                        </div>
                        <div class="selectObjectComboContainer">
                            <label for="selectLayer1"><?php echo $_SESSION["layer1Label"]; ?> filter</label>
                            <input id="selectLayer1" type="text">
                        </div>
                        <div class="selectObjectComboContainer">
                            <label for="selectLayer2"><?php echo $_SESSION["layer2Label"]; ?> filter</label>
                            <input id="selectLayer2" type="text">
                        </div>
                        <div class="selectObjectComboContainer">
                            <label for="selectLayer3"><?php echo $_SESSION["layer3Label"]; ?> filter</label>
                            <input id="selectLayer3" type="text">
                        </div>
                        <div class="selectObjectComboContainer">
                            <label for="selectName"><?php echo $_SESSION["nomeLabel"]; ?> filter</label>
                            <input id="selectName" type="text">
                        </div>
                        <div class="selectObjectComboContainer">
                            <label for="selectVersione"><?php echo $_SESSION["versionLabel"]; ?> filter</label>
                            <input id="selectVersione" type="text">
                        </div>
                    </div>
                    <div class="selectObjectButtonsContainer">
                        <div id="searchObjectBtnContainer" class="buttonContainer">
                            <div class="searchCheckBox">
                                <input id="includeLayerObjects" data-role="checkboxinfo" type="checkbox"
                                       checked="checked" class="k-checkbox"/>
                                <label for="includeLayerObjects" class="k-checkbox-label">Include layer objects ( -
                                    )</label>
                            </div>
                            <div class="searchButton">
                                <button onclick="SearchObjects()" class="buttonBordered">SEARCH</button>
                            </div>
                            <div class="searchButton">
                                <button onclick="SearchAndAddToTourList()" class="buttonBordered">ADD TO YOUR LIST
                                </button>
                            </div>
                        </div>
                        <div id="loadUserListBtnContainer" class="buttonContainer">
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
                <span id="mode3DButton" class="sideToolbarButton orangeButton" title="Go to 3D mode">
                    <img src="img/icons/toolbar/3dMode.png" alt="3D Mode">
                </span>
            </div>
            <div class="sideToolbarSeparator"></div>
            <div class="sideToolbarItem">
                <span id="informationButton" class="sideToolbarButton" title="Information">
                    <img src="img/icons/toolbar/information.png" alt="Information">
                </span>
            </div>
            <div class="sideToolbarSeparator"></div>
            <div class="sideToolbarItem">
                <span id="cleanYourListButton" class="sideToolbarButton" title="Clean your list">
                    <img src="img/icons/toolbar/deleteList.png" alt="Clean your list">
                </span>
            </div>
            <div class="sideToolbarItem">
                <span id="addNewObjectButton" class="sideToolbarButton greenButton" title="Add a new object">
                    <img src="img/icons/toolbar/addObject.png" alt="Add a new object">
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

<div class="hidden">
    <div id="informationWindow" class="fixedPosition">
        <div id="informationWindowTabControl">
            <ul>
                <li class="k-state-active">Object information</li>
                <li>Version information</li>
                <li>Subversion information</li>
            </ul>
            <div id="informationObjectTab" data-ref="Oggetti" class="informationWindowTabItem">
                <div class="boxedContainer">
                    <h3>Main information</h3>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label
                                    for="infoLayer0"><?php echo $_SESSION["layer0Label"]; ?></label></div>
                        <input id="infoLayer0" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label
                                    for="infoLayer1"><?php echo $_SESSION["layer1Label"]; ?></label></div>
                        <input id="infoLayer1" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label
                                    for="infoLayer2"><?php echo $_SESSION["layer2Label"]; ?></label></div>
                        <input id="infoLayer2" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label
                                    for="infoLayer3"><?php echo $_SESSION["layer3Label"]; ?></label></div>
                        <input id="infoLayer3" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoName"><?php echo $_SESSION["nomeLabel"]; ?></label>
                        </div>
                        <input id="infoName" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoCreated">Created</label></div>
                        <input id="infoCreated" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoRemoved">Removed</label></div>
                        <input id="infoRemoved" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoCantiereCreazione">Added during campaign
                                n&ordm;</label></div>
                        <input id="infoCantiereCreazione" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoCantiereCreazioneInizio"> .started</label></div>
                        <input id="infoCantiereCreazioneInizio" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoCantiereCreazioneFine"> .closed</label></div>
                        <input id="infoCantiereCreazioneFine" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoCantiereEliminazione">Removed during campaign n&ordm;</label>
                        </div>
                        <input id="infoCantiereEliminazione" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoCantiereEliminazioneInizio"> .started</label></div>
                        <input id="infoCantiereEliminazioneInizio" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoCantiereEliminazioneFine"> .closed</label></div>
                        <input id="infoCantiereEliminazioneFine" type="text" class="k-textbox" readonly/>
                    </div>
                </div>
                <div id="infoCategoryContainer" class="boxedContainer">
                    <h3>Category</h3>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoCategory">Category</label></div>
                        <input id="infoCategory" type="text">
                    </div>
                    <div class="buttonContainer">
                        <button id="saveInfoCategory" class="buttonBordered">SAVE</button>
                    </div>
                </div>
            </div>
            <div id="informationVersionTab" data-ref="OggettiVersion" class="informationWindowTabItem">
                <div class="boxedContainer">
                    <h3>Internal information</h3>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoCodiceOggetto">Codice Oggetto</label></div>
                        <input id="infoCodiceOggetto" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoCodiceVersione">Codice Versione</label></div>
                        <input id="infoCodiceVersione" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoVersione">Versione</label></div>
                        <input id="infoVersione" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoOriginale">Originale</label></div>
                        <input id="infoOriginale" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoCodiceModello">Codice Modello</label></div>
                        <input id="infoCodiceModello" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoLive">State</label></div>
                        <input id="infoLive" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoLastUpdateBy">Update by</label></div>
                        <input id="infoLastUpdateBy" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoLastUpdate">Update on</label></div>
                        <input id="infoLastUpdate" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoLock">Lock by</label></div>
                        <input id="infoLock" type="text" class="k-textbox" readonly/>
                    </div>
                </div>
                <div class="boxedContainer">
                    <h3>Model information</h3>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoCodiceModello2">Codice Modello</label></div>
                        <input id="infoCodiceModello2" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoSuperficie">Area</label></div>
                        <input id="infoSuperficie" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoVolume">Volume</label></div>
                        <input id="infoVolume" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoUpdateBy">Update by</label></div>
                        <input id="infoUpdateBy" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoUpdateOn">Update on</label></div>
                        <input id="infoUpdateOn" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoRadius">Diagonal</label></div>
                        <input id="infoRadius" type="text" class="k-textbox" readonly/>
                    </div>
                    <h4>Local coordinates</h4>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoLocalCenterX">Center x</label></div>
                        <input id="infoLocalCenterX" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoLocalCenterY">Center y</label></div>
                        <input id="infoLocalCenterY" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoLocalCenterZ">Center z</label></div>
                        <input id="infoLocalCenterZ" type="text" class="k-textbox" readonly/>
                    </div>
                    <h4>World coordinates</h4>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoSRS">SRS</label></div>
                        <input id="infoSRS" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoWorldCenterX">Center x</label></div>
                        <input id="infoWorldCenterX" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoWorldCenterY">Center y</label></div>
                        <input id="infoWorldCenterY" type="text" class="k-textbox" readonly/>
                    </div>
                    <div class="informationFieldContainer">
                        <div class="labelContainer"><label for="infoWorldCenterZ">Center z</label></div>
                        <input id="infoWorldCenterZ" type="text" class="k-textbox" readonly/>
                    </div>
                </div>
            </div>
            <div id="informationSubVersionTab" class="informationWindowTabItem"></div>
        </div>
    </div>

    <div id="modelWindow" class="fixedPosition">
        <div class="centeredAbsolute">
            <span id="play3DButton" title="Go to 3D mode">
                <img src="img/icons/3dWindow/3dPlay.png" alt="3D Mode">
            </span>
        </div>
        <div id="settings3dFrame">
            <div class="settings3dContainer">
                <h4>Model resolution</h4>
                <div>
                    <label class="dotRadioLabel dotRadioLabel0">
                        <input type="radio" name="modelResolutionRadio" value="7"/>
                        <span class="dotInput dotInput0"></span>
                    </label>
                    <label class="dotRadioLabel dotRadioLabel1">
                        <input type="radio" name="modelResolutionRadio" value="6"/>
                        <span class="dotInput dotInput1"></span>
                    </label>
                    <label class="dotRadioLabel dotRadioLabel2">
                        <input type="radio" name="modelResolutionRadio" value="5"/>
                        <span class="dotInput dotInput2"></span>
                    </label>
                    <label class="dotRadioLabel dotRadioLabel3">
                        <input type="radio" name="modelResolutionRadio" value="4"/>
                        <span class="dotInput dotInput3"></span>
                    </label>
                    <label class="dotRadioLabel dotRadioLabel4">
                        <input type="radio" name="modelResolutionRadio" value="3"/>
                        <span class="dotInput dotInput4"></span>
                    </label>
                    <label class="dotRadioLabel dotRadioLabel5">
                        <input type="radio" name="modelResolutionRadio" value="2"/>
                        <span class="dotInput dotInput5"></span>
                    </label>
                    <label class="dotRadioLabel dotRadioLabel6">
                        <input type="radio" name="modelResolutionRadio" value="1"/>
                        <span class="dotInput dotInput6"></span>
                    </label>
                    <label class="dotRadioLabel dotRadioLabel7">
                        <input type="radio" name="modelResolutionRadio" value="0" checked/>
                        <span class="dotInput dotInput7"></span>
                    </label>
                </div>
            </div>
            <div class="settings3dContainer">
                <h4>Texture resolution</h4>
                <div>
                    <label class="dotRadioLabel dotRadioLabel0">
                        <input type="radio" name="textureResolutionRadio" value="7"/>
                        <span class="dotInput dotInput0"></span>
                    </label>
                    <label class="dotRadioLabel dotRadioLabel1">
                        <input type="radio" name="textureResolutionRadio" value="6"/>
                        <span class="dotInput dotInput1"></span>
                    </label>
                    <label class="dotRadioLabel dotRadioLabel2">
                        <input type="radio" name="textureResolutionRadio" value="5"/>
                        <span class="dotInput dotInput2"></span>
                    </label>
                    <label class="dotRadioLabel dotRadioLabel3">
                        <input type="radio" name="textureResolutionRadio" value="4"/>
                        <span class="dotInput dotInput3"></span>
                    </label>
                    <label class="dotRadioLabel dotRadioLabel4">
                        <input type="radio" name="textureResolutionRadio" value="3"/>
                        <span class="dotInput dotInput4"></span>
                    </label>
                    <label class="dotRadioLabel dotRadioLabel5">
                        <input type="radio" name="textureResolutionRadio" value="2"/>
                        <span class="dotInput dotInput5"></span>
                    </label>
                    <label class="dotRadioLabel dotRadioLabel6">
                        <input type="radio" name="textureResolutionRadio" value="1"/>
                        <span class="dotInput dotInput6"></span>
                    </label>
                    <label class="dotRadioLabel dotRadioLabel7">
                        <input type="radio" name="textureResolutionRadio" value="0" checked/>
                        <span class="dotInput dotInput7"></span>
                    </label>
                </div>
            </div>
        </div>
        <div id="notification3dContainer">
            <span id="addHotspotNotification" class="hidden">Click on a mesh to add an hotspot</span>
        </div>

        <canvas id="modelCanvas"></canvas>
    </div>

    <div id="changeComboValueDialog">
        <form id="changeComboValueForm" method="post" action="javascript:void(0);">
            <div class="dialogFormField">
                <label for="newValue">Insert the new value:</label>
                <input id="newValue" type="text" class="k-textbox" name="newValue" value="" placeholder="newValue">
            </div>
        </form>
    </div>

    <div id="addNewObjectDialog">
        <div class="k-text-warning">
            <i>WARNING: in this way you can add only objects without models! For models use the importer.</i>
        </div>
        <form id="addNewObjectForm" method="post" action="javascript:void(0);">
            <div class="dialogFormField">
                <label for="newObjectLayer0"><?php echo $_SESSION["layer0Label"]; ?></label>
                <input id="newObjectLayer0" type="text"/>
            </div>
            <div class="dialogFormField">
                <label for="newObjectLayer1"><?php echo $_SESSION["layer1Label"]; ?></label>
                <input id="newObjectLayer1" type="text">
            </div>
            <div class="dialogFormField">
                <label for="newObjectLayer2"><?php echo $_SESSION["layer2Label"]; ?></label>
                <input id="newObjectLayer2" type="text">
            </div>
            <div class="dialogFormField">
                <label for="newObjectLayer3"><?php echo $_SESSION["layer3Label"]; ?></label>
                <input id="newObjectLayer3" type="text">
            </div>
            <div class="dialogFormField">
                <label for="newObjectName"><?php echo $_SESSION["nomeLabel"]; ?></label>
                <input id="newObjectName" type="text">
            </div>
        </form>
    </div>

    <div id="addNewHotspotDialog">
        <form id="addNewHotspotForm" method="post" action="javascript:void(0);">
            <div class="dialogFormField">
                <label for="newHotspotLayer0"><?php echo $_SESSION["layer0Label"]; ?></label>
                <input id="newHotspotLayer0" type="text"/>
            </div>
            <div class="dialogFormField">
                <label for="newHotspotLayer1"><?php echo $_SESSION["layer1Label"]; ?></label>
                <input id="newHotspotLayer1" type="text">
            </div>
            <div class="dialogFormField">
                <label for="newHotspotLayer2"><?php echo $_SESSION["layer2Label"]; ?></label>
                <input id="newHotspotLayer2" type="text">
            </div>
            <div class="dialogFormField">
                <label for="newHotspotLayer3"><?php echo $_SESSION["layer3Label"]; ?></label>
                <input id="newHotspotLayer3" type="text">
            </div>
            <div class="dialogFormField">
                <label for="newHotspotName"><?php echo $_SESSION["nomeLabel"]; ?></label>
                <input id="newHotspotName" type="text">
            </div>
            <div class="dialogFormField">
                <label for="newHotspotRadius">Radius</label>
                <input id="newHotspotRadius" type="number">
            </div>
            <div class="dialogFormField">
                <label for="newHotspotSRS">SRS</label>
                <input id="newHotspotSRS" type="text" class="k-textbox">
            </div>
            <div class="dialogFormField">
                <label for="newHotspotWorldTranslationX">World translation X</label>
                <input id="newHotspotWorldTranslationX" type="number">
            </div>
            <div class="dialogFormField">
                <label for="newHotspotWorldTranslationY">World translation Y</label>
                <input id="newHotspotWorldTranslationY" type="number">
            </div>
            <div class="dialogFormField">
                <label for="newHotspotWorldTranslationZ">World translation Z</label>
                <input id="newHotspotWorldTranslationZ" type="number">
            </div>
        </form>
    </div>
</div>
</body>
</html>