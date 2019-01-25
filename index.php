<?php
include("php/auth.php");
?>

<!DOCTYPE html>
<html>
<head>
    <title><?php echo $titolo; ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!--<meta http-equiv="content-type" content="text/html; charset=UTF-8">//-->
    <meta charset="iso-8859-15">
    <link rel="stylesheet" type="text/css" href="//code.jquery.com/mobile/1.4.2/jquery.mobile-1.4.2.min.css"/>

    <script> var dbName = '<?php echo $_SESSION["dbName"];?>';</script>
    <script type="text/javascript" src="//code.jquery.com/jquery-1.10.2.min.js"></script>
    <script type="text/javascript" src="fwlib/uploader/js/jquery.form.min.js"></script>
    <script type="text/javascript" src="//code.jquery.com/mobile/1.4.2/jquery.mobile-1.4.2.min.js"></script>
    <!--<script type="text/javascript" src="js/test.js"></script>/-->
    <script type="text/javascript" src="fwlib/jquery.indexeddb.js"></script>
    <!--<script type="text/javascript" src="fwlib/sceneJSPlugins/scenejs.js"></script>//-->
    <script type="text/javascript" src="http://scenejs.org/api/latest/scenejs.js"></script>
    <script type="text/javascript" src="js/plupload.full.min.js"></script>
    <!--<script src="https://js.leapmotion.com/leap-0.6.3.js"></script>//-->
    <!--<script src="https://js.leapmotion.com/leap-0.6.4.js"></script>//-->
    <script src="fwlib/leap-0.6.4.min.js"></script>
    <script type="text/javascript" src="js/BIMDuomoCacheManager.js"></script>
    <script type="text/javascript" src="js/PointCloudCacheManager.js"></script>
    <script type="text/javascript" src="js/TextureCacheManager.js"></script>
    <script type="text/javascript" src="js/ImageCacheManager.js"></script>
    <script type="text/javascript" src="js/loader.js" charset="iso-8859-15"></script>
    <!--<script src="http://hammerjs.github.io/dist/hammer.min.js"></script>//-->

    <!--<script src="https://rawgithub.com/jquery/jquery-ui/1.10.4/ui/jquery.ui.datepicker.js"></script>
    <script id="mobile-datepicker" src="https://rawgithub.com/arschmitz/jquery-mobile-datepicker-wrapper/v0.1.1/jquery.mobile.datepicker.js"></script>//-->
    <script src="fwlib/jquery.ui.datepicker.js"></script>
    <script id="mobile-datepicker" src="fwlib/jquery.mobile.datepicker.js"></script>
    <link rel="stylesheet" type="text/css" href="fwlib/jquery-ui-timepicker/jquery-ui-timepicker-addon.css"/>
    <script type="text/javascript" src="fwlib/jquery-ui-timepicker/jquery-ui-timepicker-addon.js"></script>

    <link rel="stylesheet" type="text/css" href="css/test.css"/>

</head>
<body>
<div data-role="page" id="mainPage">
    <div id="logo3DSurveySmall" class="loghi">
        <a  id="logo3DSurveyLink" href="http://www.sitech-3dsurvey.polimi.it" target="_blank">
            <img src="img/logo-3dsurvey-60.png">
        </a>
    </div>
    <div id="logo3DSurveyLarge" class="loghi">
        <a  id="logo3DSurveyLink" href="http://www.sitech-3dsurvey.polimi.it" target="_blank">
            <img src="img/logo-3dsurvey-full-60.png">
        </a>
    </div>
    <div id="logoPolimiSmall" class="loghi">
        <a  id="logoPolimiLink" href="http://www.polimi.it" target="_blank">
            <img src="img/logo-polimi-60.png">
        </a>
    </div>
    <div id="logoPolimiLarge" class="loghi">
        <a  id="logoPolimiLink" href="http://www.polimi.it" target="_blank">
            <img src="img/logo-polimi-testo-60.png">
        </a>
    </div>
    <div data-role="panel" id="caricamentoPanel" data-display="overlay" data-dismissible="false">
        <!--------->
        <div id="caricamentoPanelAux">
            <div id="caricamentoPanelAux2">
                <div id="ctr-select-lod">
                    <label for="select-lod">Model resolution:</label>
                    <select name="select-lod" id="select-lod" data-native-menu="false">
                        <option value="0" selected="selected">0 - Max resolution</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7 - Min resolution</option>
                    </select>
                </div>
                <div id="ctr-select-lodtexture">
                    <label for="select-lodtexture">Texture resolution:</label>
                    <select name="select-lodtexture" id="select-lodtexture" data-native-menu="false">
                        <option value="0" selected="selected">0 - Max resolution</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7 - Min resolution</option>
                    </select>
                </div>
                <hr>
                <button class="ui-btn ui-shadow ui-corner-all loadbuttons"
                        onclick="LoadScene('','','','','*previouslist*',$('#select-lod option:selected').val(),$('#select-lodtexture option:selected').val(),!$('#select-rw').prop('checked'));$('#caricamentoPanel').panel( 'close' );">
                    Load your list
                </button>
                <hr>
                <div id="ctr-select-layer0">
                    <label for="select-layer0"><?php echo $_SESSION['layer0']; ?>:</label>
                    <select name="select-layer0" id="select-layer0" data-native-menu="false">
                        <option value="" selected="selected">don't filter</option>
                    </select>
                </div>
                <div id="ctr-select-layer1">
                    <label for="select-layer1"><?php echo $_SESSION['layer1']; ?>:</label>
                    <select name="select-layer1" id="select-layer1" data-native-menu="false">
                        <option value="" selected="selected">don't filter</option>
                    </select>
                </div>
                <div id="ctr-select-layer2">
                    <label for="select-layer2"><?php echo $_SESSION['layer2']; ?>:</label>
                    <select name="select-layer2" id="select-layer2" data-native-menu="false">
                        <option value="" selected="selected">don't filter</option>
                    </select>
                </div>
                <div id="ctr-select-layer3">
                    <label for="select-layer3"><?php echo $_SESSION['layer3']; ?>:</label>
                    <select name="select-layer3" id="select-layer3" data-native-menu="false">
                        <option value="" selected="selected">don't filter</option>
                    </select>
                </div>
                <div id="ctr-select-nome">
                    <label for="select-nome"><?php echo $_SESSION['objectName']; ?>:</label>
                    <select name="select-nome" id="select-nome" data-native-menu="false">
                        <!--<option selected="selected" value="*previouslist*" selected="selected">load only previous list</option>//-->
                        <option value="" >all items</option>
                    </select>
                </div>
                <div id="ctr-select-rw" style="margin-top: 12px; margin-right: -10px;">
                    <label for="select-rw">Read-only</label>
                    <input type="checkbox" name="select-rw" id="select-rw" checked="true" value="">
                </div>
                <button class="ui-btn ui-shadow ui-corner-all loadbuttons"
                        onclick="LoadScene($('#select-layer0 option:selected').val(),$('#select-layer1 option:selected').val(),$('#select-layer2 option:selected').val(),$('#select-layer3 option:selected').val(),$('#select-nome option:selected').val(),$('#select-lod option:selected').val(),$('#select-lodtexture option:selected').val(),!$('#select-rw').prop('checked'));$('#caricamentoPanel').panel( 'close' );">
                    Add to your list and load it
                </button>
                <hr>
                <button class="ui-btn ui-shadow ui-corner-all loadbuttons" onclick="resettaListaImportazione();">
                    Reset your list
                </button>
                <button class="ui-btn ui-shadow ui-corner-all loadbuttons" onclick="resettaVista();">
                    Reset the view
                </button>
            </div>
        </div>
    </div><!-- /panel -->

    <div data-role="panel" id="infoOggettoPanel" data-display="overlay" data-dismissible="false" style="width: 300px;">
        <div id="infoOggettoPanelAux">
            <div data-role="collapsible" data-inset="false" id="infoOggettoPanelCollapsible" data-collapsed="true">
                <h4>Object Information</h4>
                <div class="infoOggettoPanelAux2">
                    <div data-role="collapsible" data-inset="false">
                        <h5>Main Info</h5>
                        <div class="infoOggettoPanelAux_MainInfo infoOggettoPanelInfo">
                            <label for="textLayer0"
                                   class="infoLabel"><?php echo $_SESSION['layer0']; ?></label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textLayer0" id="textLayer0"
                                   value="">
                            <label for="textLayer1"
                                   class="infoLabel"><?php echo $_SESSION['layer1']; ?></label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textLayer1" id="textLayer1"
                                   value="">
                            <label for="textLayer2"
                                   class="infoLabel"><?php echo $_SESSION['layer2']; ?></label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textLayer2"
                                   id="textLayer2" value="">
                            <label for="textLayer3"
                                   class="infoLabel"><?php echo $_SESSION['layer3']; ?></label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textLayer3" id="textLayer3"
                                   value="">
                            <label for="textName"
                                   class="infoLabel"><?php echo $_SESSION['objectName']; ?></label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textName" id="textName"
                                   value="">

                            <label for="textCreated" class="infoLabel">Created</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textCreated"
                                   id="textCreated" value="">
                            <label for="textRemoved" class="infoLabel">Removed</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textRemoved"
                                   id="textRemoved" value="">
                            <label for="textCantiereCreazione" class="infoLabel">Added during building site
                                n&ordm;</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textCantiereCreazione"
                                   id="textCantiereCreazione" value="">
                            <label for="textCantiereCreazioneInizio" class="infoLabel"> .started</label>
                            <input type="text" class="infoInputText" disabled="disabled"
                                   name="textCantiereCreazioneInizio" id="textCantiereCreazioneInizio" value="">
                            <label for="textCantiereCreazioneFine" class="infoLabel"> .closed</label>
                            <input type="text" class="infoInputText" disabled="disabled"
                                   name="textCantiereCreazioneFine" id="textCantiereCreazioneFine" value="">
                            <label for="textCantiereEliminazione" class="infoLabel">Removed during building site
                                n&ordm;</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textCantiereEliminazione"
                                   id="textCantiereEliminazione" value="">
                            <label for="textCantiereEliminazioneInizio" class="infoLabel"> .started</label>
                            <input type="text" class="infoInputText" disabled="disabled"
                                   name="textCantiereEliminazioneInizio" id="textCantiereEliminazioneInizio" value="">
                            <label for="textCantiereEliminazioneFine" class="infoLabel"> .closed</label>
                            <input type="text" class="infoInputText" disabled="disabled"
                                   name="textCantiereEliminazioneFine" id="textCantiereEliminazioneFine" value="">
                        </div>
                    </div>
                </div>
            </div>

            <div data-role="collapsible" data-inset="false" id="infoVersionPanelCollapsible" data-collapsed="true">
                <h4>Version Information</h4>
                <div class="infoVersionPanelAux2">
                    <div data-role="collapsible" data-inset="false">
                        <h5>Internal Info</h5>
                        <div class="infoVersionPanelAux_InternalInfo infoVersionPanelInfo">
                            <label for="textCodice" class="infoLabel">Object index n&ordm;</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textCodice"
                                   id="textCodice" value="">
                            <label for="textCodiceVersione" class="infoLabel">Version index n&ordm;</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textCodiceVersione"
                                   id="textCodiceVersione" value="">
                            <label for="textVersione" class="infoLabel">Version</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textVersione"
                                   id="textVersione" value="">
                            <label for="textOriginale" class="infoLabel">Derived by</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textOriginale"
                                   id="textOriginale" value="">
                            <label for="textCodiceModello" class="infoLabel">Model n&ordm;</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textCodiceModello"
                                   id="textCodiceModello" value="">
                            <label for="textLive" class="infoLabel">State</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textLive" id="textLive"
                                   value="">

                            <label for="textLastUpdateBy" class="infoLabel">Update by</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textLastUpdateBy"
                                   id="textLastUpdateBy" value="">
                            <label for="textLastUpdate" class="infoLabel">Update on</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textLastUpdate"
                                   id="textLastUpdate" value="">
                            <label for="textLock" class="infoLabel">Lock by</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textLock" id="textLock"
                                   value="">
                        </div>
                    </div>
                    <div data-role="collapsible" data-inset="false">
                        <h5>Model Info</h5>
                        <div class="infoOggettoPanelAux_ModelInfo infoOggettoPanelInfo">
                            <label for="textCodiceModello2" class="infoLabel">Model n&ordm;</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textCodiceModello2"
                                   id="textCodiceModello2" value="">
                            <label for="textSuperficie" class="infoLabel">Area</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textSuperficie"
                                   id="textSuperficie" value="">
                            <label for="textVolume" class="infoLabel">Volume</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textVolume"
                                   id="textVolume" value="">
                            <label for="textUpdateBy" class="infoLabel">Update by</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textUpdateBy"
                                   id="textUpdateBy" value="">
                            <label for="textUpdateOn" class="infoLabel">Update on</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textUpdateOn"
                                   id="textUpdateOn" value="">
                            <label for="textCenterX" class="infoLabel">Center x</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textCenterX"
                                   id="textCenterX" value="">
                            <label for="textCenterY" class="infoLabel">Center y</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textCenterY"
                                   id="textCenterY" value="">
                            <label for="textCenterZ" class="infoLabel">Center z</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textCenterZ"
                                   id="textCenterZ" value="">
                            <label for="textDiagonal" class="infoLabel">Diagonal</label>
                            <input type="text" class="infoInputText" disabled="disabled" name="textDiagonal"
                                   id="textDiagonal" value="">
                        </div>
                    </div>
                </div>
            </div>

            <div data-role="collapsible" data-inset="false" id="infoSubVersionPanelCollapsible" data-collapsed="true">
                <h4>SubVersion Information</h4>
                <div class="infoSubVersionPanelAux2">
                </div>
            </div>

            <div data-role="collapsible" data-inset="false" id="infoCategoryCollapsible" data-collapsed="false">
                <h4>Category</h4>
                <a title="Salva" href="CategoryCombo" class="salvaImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-check ui-btn-icon-notext hide">navigation</a>
                <label for="CategoryCombo" class="infoLabel">Category</label>
                <select data-native-menu="false" class="infoInputText" disabled="disabled" name="CategoryCombo" id="CategoryCombo">
                    <option value='0'>-</option>";
                </select>
            </div>

        </div>
    </div>

    <div data-role="panel" id="immaginiOggettoPanel" data-display="overlay" data-dismissible="false"
         data-position="right">
        <div id="immaginiOggettoPanelAux">
            <div id="immaginiOggettoPanelAux2">
            </div>
            <div id="immaginiOggettoPanelAux3">
                <div style="position: relative">
                    <label class="aggiungiImmagineLabel">Screenshot Image</label>
                    <a id="screenshotImage" title="Acquire" href="" class="aggiungiScreenshotButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext ">navigation</a>
                    <div class="thumbContainer" id="myThumbContainer">
                        <img id="myCapturedImage" class="popphoto" src="" alt="Immagine" style="width:200px">
                        <a id="myCapturedImageHRef" title="Save image..." download="ascreenshot.jpg" href="" class="salvaOrtofotoButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-arrow-d ui-btn-icon-notext ">navigation</a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div data-role="panel" id="fileOggettoPanel" data-display="overlay" data-dismissible="false"
         data-position="right">
        <div id="fileOggettoPanelAux">
            <div id="fileOggettoPanelAux2">
            </div>
        </div>
    </div>

    <div data-role="header">
        <div id="mainMenuContainer">

            <a href="php/logout.php"
               title="Disconnetti <?php if (isset($_SESSION['validUser'])) echo $_SESSION['validUserName'] ?>"
               data-ajax="false"
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-lock ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "hide";
               } ?>">logout</a>
            <a href="#caricamentoPanel" title="Carica..."
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-action ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "hide";
               } ?>">navigation</a>
            <a href="#infoOggettoPanel" title="Informazioni sull'oggetto selezionato"
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-info ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "hide";
               } ?>">info</a>
            <a href="#immaginiOggettoPanel" title="Immagini relative all'oggetto selezionato"
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-camera ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "hide";
               } ?>">info</a>
            <a href="#fileOggettoPanel" title="Files relativi all'oggetto selezionato"
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-mail ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "hide";
               } ?>">info</a>
            <a id="editToolbar" title="Visualizza la toolbar di editing"
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-carat-d ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "hide";
               } ?>">edit</a>
            <div id="actualUser"
                 style="height: 0px; Visibility: collapse"><?php if (isset($_SESSION['validUser'])) echo $_SESSION['validUserName'] ?></div>
        </div>
        <div id="hideObjectToolbar" class="hideToolbar">
            <a id="resetEye" title="Resetta lo sguardo" href=""
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-home ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "hide";
               } ?>">Resetta lo sguardo</a>
            <a id="renameObject" title="Rinomina l'oggetto" href=""
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-edit ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "hide";
               } ?>">Rinomina l'oggetto</a>
            <a id="deleteObject" title="Cancella l'oggetto" href=""
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "hide";
               } ?>">Cancella l'oggetto</a>
            <a id="selectAnchor" title="Selezione singola / Selezione multipla" href=""
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-navigation ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "hide";
               } ?>">navigation</a>
            <a id="enableDistance" title="Abilita la misurazione della distanza (solo sulle Mesh)" href=""
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-bars ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "hide";
               } ?>">bars</a>
            <a id="selectAll" title="Inverti selezione" href=""
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-back ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "back";
               } ?>">back</a>
            <a id="hideSelectedObject" title="Nascondi gli oggetti selezionati"
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-eye ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "eye";
               } ?>">eye</a>
            <a id="hideUnselectedObject" title="Inverti selezione e nascondi"
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-forward ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "forward";
               } ?>">forward</a>
            <a id="showHidden" title="Visualizza oggetti nascosti"
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-recycle ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "recycle";
               } ?>">recycle</a>
            <a id="enableTexture" title="Texture On / Texture Off" href=""
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-cloud ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "hide";
               } ?>">Texture On / Texture Off</a>
            <a id="showNavigation" title="Visualizza i controlli di navigazione"
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-location ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "location";
               } ?>">location</a>
            <a id="addHotSpot" title="Aggiunge un HotSpot (solo tramite le Mesh)"
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-star ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "hide";
               } ?>">edit</a>
            <a id="addInteventoSubVersion" title="Aggiunge un-intervento sulla subversion"
               class="ui-btn-double-size ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-plus ui-btn-icon-notext <?php if (!isset($_SESSION['validUser'])) {
                   echo "hide";
               } ?>">plus</a>
        </div>

    </div><!-- /header -->

    <div>
        <canvas id="pointerCanvas"></canvas>
    </div>
    <div role="main" class="ui-content" id="pippo">
        <div id="distanceText"></div>
        <div id="addHotSpotText"></div>
        <canvas id="theCanvas">
        </canvas>
        <div data-role="popup" id="aggiungiImmaginePopup" data-theme="a" class="ui-corner-all" data-dismissible="false">
            <div id="aggiungiImmaginePopupInside">
                <div id="upload-wrapper">
                    <div align="center">
                        <h3>Upload Image</h3>
                        <form action="fwlib/uploader/processupload.php" method="post" enctype="multipart/form-data"
                              id="MyUploadForm">
                            <input name="FileInput" id="FileInput" type="file"/>
                            <input type="submit" id="submit-btn" value="Upload"/>
                            <input type="button" id="cancelUploadBtn" value="Chiudi"/>
                            <input type="hidden" id="codiceOggetto" name="codiceOggetto" value=""/>
                            <input type="hidden" id="codiceIntervento" name="codiceIntervento" value=""/>
                            <input type="hidden" id="mittente" name="mittente" value=""/>
                            <input type="hidden" id="URL" name="URL" value=""/>
                            <input type="hidden" id="dataIns" name="dataIns" value=""/>
                            <img src="fwlib/uploader/images/ajax-loader.gif" id="loading-img" style="display:none;"
                                 alt="Please Wait"/>
                        </form>
                        <div id="progressbox">
                            <div id="progressbar"></div>
                            <div id="statustxt">0%</div>
                        </div>
                        <div id="output"></div>
                    </div>
                </div>
            </div>
        </div>
        <div data-role="popup" id="aggiungiFilePopup" data-theme="a" class="ui-corner-all" data-dismissible="false">
            <div id="aggiungiFilePopupInside">
                <div id="upload-wrapper">
                    <div align="center">
                        <h3>Upload File</h3>
                        <form action="fwlib/uploader/processFileUpload.php" method="post" enctype="multipart/form-data"
                              id="FileUploadForm">
                            <input name="FileInputFile" id="FileInputFile" type="file"/>
                            <input type="submit" id="submitFile-btn" value="Upload"/>
                            <input type="button" id="cancelUploadFileBtn" value="Chiudi"/>
                            <input type="hidden" id="codiceFileOggetto" name="codiceFileOggetto" value=""/>
                            <input type="hidden" id="codiceFileIntervento" name="codiceFileIntervento" value=""/>
                            <input type="hidden" id="mittenteFile" name="mittenteFile" value=""/>
                            <input type="hidden" id="URLFile" name="URLFile" value=""/>
                            <input type="hidden" id="dataInsFile" name="dataInsFile" value=""/>
                            <img src="fwlib/uploader/images/ajax-loader.gif" id="loadingFile-img" style="display:none;"
                                 alt="Please Wait"/>
                        </form>
                        <div id="progressboxFile">
                            <div id="progressbarFile"></div>
                            <div id="statustxtFile">0%</div>
                        </div>
                        <div id="outputFile"></div>
                    </div>
                </div>
            </div>
        </div>
        <div data-role="popup" id="aggiungiOrthoPopup" data-theme="a" class="ui-corner-all" data-dismissible="false">
            <ul id="filelist"></ul>
            <br />

            <div id="container">
                <a id="browse" href="javascript:;">[Browse...]</a>
                <a id="start-upload" href="javascript:;">[Start Upload]</a>
                <a id="close-ortho-upload" href="javascript:;">[Close]</a>
            </div>
            <br />
            <pre id="console"></pre>
            <script type="text/javascript">

                var uploader = new plupload.Uploader({
                    browse_button: 'browse', // this can be an id of a DOM element or the DOM element itself
                    url: 'php/upload.php',
                    max_file_size : '20000mb',
                    chunk_size: '65536kb',
                    max_retries: 3,
                    multipart_params: {
                        "orthoName" : "value1"
                    },
                    unique_names: true
                });

                uploader.init();

                uploader.bind('FilesAdded', function(up, files) {
                    var html = '';
                    plupload.each(files, function(file) {
                        html += '<li id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></li>';
                    });
                    document.getElementById('filelist').innerHTML += html;
                });

                uploader.bind('UploadProgress', function(up, file) {
                    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
                });

                uploader.bind('Error', function(up, err) {
                    document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
                });

                document.getElementById('start-upload').onclick = function() {
//////////////
                    var xhrs = []
                    var computedName = "";
                    var nonHomogeneus = false;
                    $.each(_selectedObjectList, function (index, value) {
                        try {
                            var codice = value.id.substring(1);
                            var xhr = $.ajax({
                                type: 'POST',
                                url: 'php/getInfoOggettiBase.php',
                                data: {
                                    codice: codice
                                },
                                dataType: "json",
                                success: function (resultData) {
                                    if (computedName == "") {
                                        computedName = (resultData[0].Layer0) + "_" + (resultData[0].Layer1) + "_" + (resultData[0].Layer2) + "_" + (resultData[0].Layer3);
                                    }
                                    else {
                                        if (computedName != (resultData[0].Layer0) + "_" + (resultData[0].Layer1) + "_" + (resultData[0].Layer2) + "_" + (resultData[0].Layer3)){
                                            nonHomogeneus = true;
                                        }
                                    }
                                    computedName += "_" + (resultData[0].Name)
                                },
                                error: function (jqXHR, textStatus, errorThrown) {
                                    alert("Si è verificato un errore.");
                                }
                            });
                            xhrs.push(xhr);
                        }
                        catch (err) {
                            alert("Error: ".err);
                        }
                    });
                    $.when.apply($, xhrs).done(function(){
                        if (nonHomogeneus) {
                            computedName = "";
                        }
                        uploader.settings.multipart_params["orthoName"] = computedName;
                        uploader.start();
                    })
//////////////

                    //uploader.settings.multipart_params["orthoName"] = computeOrthoName();
                    //uploader.start();
                };
                document.getElementById('close-ortho-upload').onclick = function() {
                    uploader.stop();
                    $('#aggiungiOrthoPopup').popup("close");
                };
            </script>

        </div>
        <div data-role="popup" id="immaginiInfoPopup" data-theme="a" class="ui-corner-all" data-dismissible="false">
            <div id="immaginiInfoPanelAux">
                <label for="textImmagineName" class="infoLabel">Filename</label>
                <input type="text" class="infoInputText" disabled="disabled" name="textImmagineName"
                       id="textImmagineName" value="">
                <label for="textImmagineDataScatto" class="infoLabel">Taken on</label>
                <input type="text" class="infoInputText" disabled="disabled" name="textImmagineDataScatto"
                       id="textImmagineDataScatto" value="">
                <a title="Salva" href="textImmagineDescrizione"
                   class="salvaImmagineButton ui-btn ui-btn-inline ui-shadow ui-corner-all ui-icon-check ui-btn-icon-notext hide\">navigation</a>
                <label for="textImmagineDescrizione" class="infoLabel">Description</label>
                <textarea class="infoInputText" name="textImmagineDescrizione" id="textImmagineDescrizione"
                          data-clear-btn="true" value=""></textarea>
                <button class="ui-btn ui-shadow ui-corner-all immaginiInfoPopupButtons"
                        onclick="$('#immaginiInfoPopup').popup( 'close' );">Close
                </button>
            </div>
        </div>
        <div data-role="popup" id="aggiungiHotSpotPopup" data-theme="a" class="ui-corner-all" data-dismissible="false">
            <div id="aggiungiHotSpotPopupInside">
                <div id="upload-wrapper">
                    <div align="center">
                        <h3>Insert a new HotSpot</h3>
                        <form action="" id="HotSpotForm">
                            <div id="inputHotSpotPopup">
                                <label for="textHotSpotLayer0" class="infoLabel"><?php echo $_SESSION['layer0']; ?>:</label>
                                <input type="text" class="infoInputText" name="textHotSpotLayer0"
                                       id="textHotSpotLayer0" value="">
                                <label for="textHotSpotLayer1" class="infoLabel"><?php echo $_SESSION['layer1']; ?>:</label>
                                <input type="text" class="infoInputText" name="textHotSpotLayer1"
                                       id="textHotSpotLayer1" value="">
                                <label for="textHotSpotLayer2" class="infoLabel"><?php echo $_SESSION['layer2']; ?>:</label>
                                <input type="text" class="infoInputText" name="textHotSpotLayer2"
                                       id="textHotSpotLayer2" value="">
                                <label for="textHotSpotLayer3" class="infoLabel"><?php echo $_SESSION['layer3']; ?>:</label>
                                <input type="text" class="infoInputText" name="textHotSpotLayer3"
                                       id="textHotSpotLayer3" value="">
                                <label for="textHotSpotName" class="infoLabel"><?php echo $_SESSION['objectName']; ?>:</label>
                                <input type="text" class="infoInputText" name="textHotSpotName"
                                       id="textHotSpotName" value="">
                                <label for="numberHotSpotRadius" class="infoLabel">Radius</label>
                                <input type="number" step="0.000001" class="infoInputText infoInputNumber" data-clear-btn="true" name="numberHotSpotRadius" id="numberHotSpotRadius" >
                                <label for="HotSpotCategoryCombo" class="infoLabel">Category</label>
                                <select data-native-menu="false" class="infoInputText" name="HotSpotCategoryCombo" id="HotSpotCategoryCombo">
                                    <option value='0'>-</option>";
                                </select>
                                <!--                                <label for="colorHotSpotColor" class="infoLabel">HotSpot Color</label>
                                                                <input type="color" class="infoInputText" name="colorHotSpotColor" id="colorHotSpotColor">//-->
                            </div>
                            <input type="button" id="addHotSpotBtn" value="Insert"/>
                            <input type="button" id="cancelHotSpotBtn" value="Cancel"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div data-role="popup" id="renameObjectPopup" data-theme="a" class="ui-corner-all" data-dismissible="false">
            <div id="renameObjectPopupInside">
                <div id="upload-wrapper">
                    <div align="center">
                        <h3>Insert the new name</h3>
                        <form action="" id="renameObjectForm">
                            <div id="inputrenameObjectPopup">
                                <label for="textrenameObjectLayer0" class="infoLabel"><?php echo $_SESSION['layer0']; ?>:</label>
                                <input type="text" class="infoInputText" name="textrenameObjectLayer0"
                                       id="textrenameObjectLayer0" value="">
                                <label for="textrenameObjectLayer1" class="infoLabel"><?php echo $_SESSION['layer1']; ?>:</label>
                                <input type="text" class="infoInputText" name="textrenameObjectLayer1"
                                       id="textrenameObjectLayer1" value="">
                                <label for="textrenameObjectLayer2" class="infoLabel"><?php echo $_SESSION['layer2']; ?>:</label>
                                <input type="text" class="infoInputText" name="textrenameObjectLayer2"
                                       id="textrenameObjectLayer2" value="">
                                <label for="textrenameObjectLayer3" class="infoLabel"><?php echo $_SESSION['layer3']; ?>:</label>
                                <input type="text" class="infoInputText" name="textrenameObjectLayer3"
                                       id="textrenameObjectLayer3" value="">
                                <label for="textrenameObjectName" class="infoLabel"><?php echo $_SESSION['objectName']; ?>:</label>
                                <input type="text" class="infoInputText" name="textrenameObjectName"
                                       id="textrenameObjectName" value="">
                            </div>
                            <input type="button" id="renameObjectOKBtn" value="Rename"/>
                            <input type="button" id="cancelrenameObjectBtn" value="Cancel"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div data-role="popup" id="addComboValuePopup" data-theme="a" class="ui-corner-all" data-dismissible="false">
            <div id="addComboValuePopupInside">
                <div id="upload-wrapper">
                    <div align="center">
                        <h3>Add a new combo value</h3>
                        <form action="" id="addComboValueForm">
                            <div id="inputComboValuePopup">
                                <label for="textAddInfoComboValue" class="infoLabel">Value to add:</label>
                                <input type="text" class="infoInputText" name="textAddInfoComboValue" id="textAddInfoComboValue" value="">
                            </div>
                            <input type="button" id="addComboValueBtn" value="Insert"/>
                            <input type="button" id="cancelComboValueBtn" value="Cancel"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div><!-- /content -->

    <div id="footerBar" data-role="footer" style="height: 0px">
        <div id="ZRControl">
            <div id="footerGrid" class="ui-grid-b" style="height: 0px">
                <div class="ui-block-a">
                    <div class="ui-bar ui-bar-a"><input type="range" name="slider-z" id="slider-z" min="-100" max="100"
                                                        value="0" data-show-value="false" data-popup-enabled="false">
                    </div>
                </div>
                <div class="ui-block-b">
                    <div class="ui-bar ui-bar-a"><input type="range" name="slider-r1" id="slider-r1" min="-180"
                                                        max="180" value="0" data-show-value="false"
                                                        data-popup-enabled="false"></div>
                </div>
                <div class="ui-block-c">
                    <div class="ui-bar ui-bar-a"><input type="range" name="slider-r3" id="slider-r3" min="-180"
                                                        max="180" value="0" data-show-value="false"
                                                        data-popup-enabled="false"></div>
                </div>
                <div class="ui-block-a">
                    <div class="ui-bar ui-bar-a"><input type="range" name="slider-p3" id="slider-p3" min="-180"
                                                        max="180" value="0" data-show-value="false"
                                                        data-popup-enabled="false"></div>
                </div>
                <div class="ui-block-b">
                    <div class="ui-bar ui-bar-a"><input type="range" name="slider-p2" id="slider-p2" min="-180"
                                                        max="180" value="0" data-show-value="false"
                                                        data-popup-enabled="false"></div>
                </div>
                <div class="ui-block-c">
                    <div class="ui-bar ui-bar-a"><input type="range" name="slider-p1" id="slider-p1" min="-180"
                                                        max="180" value="0" data-show-value="false"
                                                        data-popup-enabled="false"></div>
                </div>
            </div><!-- /grid-b -->
        </div>
    </div><!-- /footer -->

    <div data-role="popup" id="popupLogin" data-theme="a" class="ui-corner-all" data-dismissible="false">
        <form id="loginForm" method="post" action="./" data-ajax="false">
            <div style="padding:10px 20px;">
                <h3>Benvenuto</h3>
                <label for="un" class="ui-hidden-accessible">Utente:</label>
                <input type="text" name="user" id="un" value="" placeholder="username" data-theme="a">
                <label for="pw" class="ui-hidden-accessible">Password:</label>
                <input type="password" name="pwd" id="pw" value="" placeholder="password" data-theme="a">
                <button type="submit" class="ui-btn ui-corner-all ui-shadow ui-btn-b ui-btn-icon-left ui-icon-check">
                    Entra
                </button>
            </div>
        </form>
    </div>

    <div data-role="popup" id="creditInfoPopup" data-theme="a" class="ui-corner-all" data-dismissible="false">
        <h1><?php echo $titolo; ?></h1>
        <table id="tableCredit">
            <tr>
                <!--                <td class="colonnaCredits" id="colonnaCreditsLeft">
                                    <h3 class="creditSubtitle">Progetto "Bergamo Citt&agrave; Alta in 3D"</h3>
                                    <h5>
                                        Finanziamento:
                                        <ul class="listaCredits">
                                            <li>MIUR & <a href="http://www.comune.bergamo.it" target="_blank">Comune di Bergamo</a></li>
                                        </ul>
                                        Partner:<br>
                                        <ul class="listaCredits">
                                            <li>
                                                <a href="http://185.56.11.186/itgsquarenghi/" target="_blank">Istituto Quarenghi</a>, Bergamo
                                                <ul>
                                                    <li>responsabile del progetto: Cesare Emer Botti</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a href="https://www.fbk.eu/it/" target="_blank">Fondazione Bruno Kessler</a>, Trento
                                                <ul>
                                                    <li>responsabile del progetto: Fabio Remondino</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a href="http://www.comune.bergamo.it" target="_blank">Comune di Bergamo</a>, <a href="http://www.comune.bergamo.it/servizi/Menu/dinamica.aspx?idSezione=3780&idArea=1182&idCat=1195&ID=1859&TipoElemento=pagina" target="_blank">Servizio Sistema Informativo<br>Territoriale e Statistica</a>
                                                <ul>
                                                    <li>responsabile del progetto: Andrea Maffeis</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a href="http://www.avt.at" target="_blank">AVT Vermessung</a>
                                                <ul>
                                                    <li>responsabile del progetto: Klaus Legat</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a href="http://www.sinecospa.com" target="_blank">SINECO</a>
                                                <ul>
                                                    <li>responsabile del progetto: Michele Mori</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <a href="http://www.polimi.it" target="_blank">Politecnico di Milano</a>
                                                <ul>
                                                    <li>responsabile del progetto: Francesco Fassi</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </h5>
                                </td>//-->
                <td class="colonnaCredits" id="colonnaCreditsRight">
                    <h3 class="creditSubtitle">BIM3DSG, Online 3D Information System</h3>
                    <h5>
                        Sviluppato da:
                        <ul class="listaCredits">
                            <li><a href="http://www.sitech-3dsurvey.polimi.it" target="_blank">3DSurveyGroup</a>, <a href="http://www.polimi.it" target="_blank">Politecnico di Milano</a>, <a href="http://www.abc.polimi.it" target="_blank">Dipartimento ABC</a></li>
                        </ul>
                        Responsabili scientifici:
                        <ul class="listaCredits">
                            <li><a href="mailto:francesco.fassi@polimi.it">Francesco Fassi</a>, Politecnico di Milano</li>
                            <li><a href="mailto:cristiana.achille@polimi.it">Cristiana Achille</a>, Politecnico di Milano</li>
                        </ul>
                        Progettisti e sviluppatori:
                        <ul class="listaCredits">
                            <li><a href="mailto:fabrizio.rechichi@polimi.it">Fabrizio Rechichi</a>, Politecnico di Milano</li>
                            <li><a href="mailto:info@newthread.it">Stefano Parri</a>, <a href="http://www.newthread.it" target="_blank">New Thread Srl</a></li>
                        </ul>
                    </h5>
                    <div style="margin-top: -10px; margin-right: -15px; margin-left: -2px">
                        <a href="http://www.polimi.it" target="_blank"><img src="img/logo-polimi-testo-60.png" class="creditsImage" style="margin-left: 3px"></a>
                        <a href="http://www.sitech-3dsurvey.polimi.it" target="_blank"><img src="img/logo-3dsurvey-60.png" class="creditsImage"></a><br>
                        <a href="https://www.itinnovations.it" target="_blank"><img src="img/logo-itinnovations-60.png" class="creditsImage"></a>
                        <a href="http://www.newthread.it" target="_blank"><img src="img/logo-newthread-2014.png" height="60" class="creditsImage"></a>
                    </div>
                </td>
            </tr>
        </table>
        <button class="ui-btn ui-shadow ui-corner-all creditInfoPopupButtons"
                onclick="$('#creditInfoPopup').popup( 'close' ); login();">Accedi al sito
        </button>

    </div>

</div><!-- /page -->

</div>
</body>
</html>
