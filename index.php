<?php
    include("php/auth.php");
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $_SESSION['titolo']; ?></title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta charset="iso-8859-15">

        <!-- KENDO UI -->

        <!--<link href="libs/KendoUI/styles/kendo.common.min.css" rel="stylesheet" /> <!-- Common Kendo UI CSS for web widgets and widgets for data visualization. -->
        <link href="libs/KendoUI/styles/kendo.rtl.min.css" rel="stylesheet" type="text/css" /><!-- (Optional) RTL CSS for Kendo UI widgets for the web. Include only in right-to-left applications. -->
        <link href="libs/KendoUI/styles/kendo.default.min.css" rel="stylesheet" type="text/css" /><!-- Default Kendo UI theme CSS for web widgets and widgets for data visualization. -->
        <link href="libs/KendoUI/styles/kendo.default.mobile.min.css" rel="stylesheet" type="text/css" /><!-- (Optional) Kendo UI Hybrid CSS. Include only if you will use the mobile devices features. -->
        <script src="libs/KendoUI/jquery.min.js"></script> <!-- jQuery JavaScript -->
        <script src="libs/KendoUI/kendo.all.min.js"></script><!-- Kendo UI combined JavaScript -->
        <link rel="stylesheet" type="text/css" href="css/KendoUI.css"/> <!-- css del tema KENDO UI creato con il builder, stilizza tutti i widget con i colori impostati nel builder - da pulire perch� il file contiene le stilizzazioni di tutti  iwidget di KENDOO, ho tolto gi� quelli inutili ma c'� ancora della robaccia. -->
        <!-- Fine KENDO UI -->

        <script type="text/javascript" src="js/BIM3DSG.js" charset="iso-8859-15"></script>

        <link rel="stylesheet" type="text/css" href="css/main.css"/>
    </head>
    <body>
    <div id="pageContainer">
        <div id="headerContainer">
            <div id="headerLoghi">
                <div id="loghi3Dsurvey">
                    <div id="logo3DSurveySmall" class="loghi">
                        <a class="logo-3dsurvey-link" href="http://www.sitech-3dsurvey.polimi.it" target="_blank">
                            <img src="img/logo-3dsurvey-60.png">
                        </a>
                    </div>
                    <div id="logo3DSurveyLarge" class="loghi">
                        <a class="logo-3dsurvey-link" href="http://www.sitech-3dsurvey.polimi.it" target="_blank">
                            <img src="img/logo-3dsurvey-full-60.png">
                        </a>
                    </div>
                </div>
                <div id="loghiPolimi">
                    <div id="logoPolimiSmall" class="loghi">
                        <a class="logo-polimi-link" href="http://www.polimi.it" target="_blank">
                            <img src="img/logo-polimi-60.png">
                        </a>
                    </div>

                    <div id="logoPolimiLarge" class="loghi">
                        <a class="logo-polimi-link" href="http://www.polimi.it" target="_blank">
                            <img src="img/logo-polimi-testo-60.png">
                        </a>
                    </div>
                </div>

                <?php
                if (isset($_SESSION['validUser'])) {
                    echo '

                   <div id="logoutContainer">
                        <div class="logout-picture image">
                            <a href="php/logout.php" title="Disconnetti ' . $_SESSION['validUserName'] . '" data-ajax="false"><img src="img/lock-icon-grey.png"></a>
                        </div>
                    </div>
                    <div id="userContainer">
                        <div class="user-picture image" style=\'background-image: url("img/user-icon.png")\'></div>
                        <div id="actualUser" class="user-label">' . $_SESSION['FullName'] . '</div>
                    </div>
                    ';
                }
                ?>

            </div>
        </div>

        <?php if (!isset($_SESSION['validUser']))
            {
                echo '
                    <div id="loginDialog"></div>
                ';
            }
        ?>

        <div id="mainareaContainer">
            <div class="page-section search-form-section">

                <div class="page-row search-form-row">
                    <div class="page-column search-title-column">
                        <h2 class="search-title">Select object to edit</h2>
                        <p class="search-subtitle">Select all the items you want to work on by filtering them with the <b>Search fields</b> or by clicking the button <b>Use your list</b>.</p>

                    </div>
                    <div class="page-column search-form-column">

                        <div class="search-form-searchfields">
                            <div id="ctrSelectLayer0" class="input-searchfield">
                                <label class="inputLayerLabel">Layer0</label>
                                <input id="selectLayer0" type="text" class="inputLayer"/>
                            </div>
                            <div id="ctrSelectLayer1" class="input-searchfield">
                                <label class="inputLayerLabel">Layer1</label>
                                <input id="selectLayer1" type="text" class="inputLayer">
                            </div>
                            <div id="ctrSelectLayer2" class="input-searchfield">
                                <label class="inputLayerLabel">Layer2</label>
                                <input id="selectLayer2" type="text" class="inputLayer">
                            </div>
                            <div id="ctrSelectLayer3" class="input-searchfield">
                                <label class="inputLayerLabel">Layer3</label>
                                <input id="selectLayer3" type="text" class="inputLayer">
                            </div>
                            <div id="ctrSelectNome" class="input-searchfield">
                                <label class="inputLayerLabel">Name</label>
                                <input id="selectNome" type="text" class="inputLayer">
                            </div>
                            <div id="ctrSelectVersion" class="input-searchfield">
                                <label class="inputLayerLabel">Version</label>
                                <input id="selectVersion" type="text" class="inputLayer">
                            </div>
                            <div style="clear:both;"></div>
                            <div class="btn-wrap">
                                <button class="k-button k-primary btn-md btn-thin">Search</button>&nbsp;
                            </div>
                        </div>

                        <div class="search-form-uselist">
                            <div class="btn-wrap">
                                or <button class="k-button k-primary btn-md">Use your list</button>&nbsp;
                            </div>
                        </div>
                        <div style="clear:both;"></div>
                    </div>
                </div>
            </div>

            <div class="page-section grid-result-section">
                <div class="page-row grid-result-row">
                    <div class="page-column grid-result-column">
                        <div id="gridResult"></div>

                    </div>
                </div>
            </div>
        </div>

        <div id="infoWindow">

            <div id="ctr-select-rw" class="readwrite-checkbox">
                <span class="label_rw">Read</span>
                <label for="select-rw" class="switch">
                    <input type="checkbox" name="select-rw" id="select-rw" checked="false" value="">
                    <span class="slider round"></span>
                </label>
                <span class="label_rw">Write</span>
            </div>

            <div id="infoWindowTabstrip">
                <ul>
                    <li class="k-state-active">Object information</li>
                    <li>Version information</li>
                    <li>Subversion information</li>
                </ul>

                <div id="objectInfoTab" class="infownd-tabitem">
                </div>
                <div id="versionInfoTab" class="infownd-tabitem">
                </div>
                <div id="subversionInfoTab" class="infownd-tabitem">
                </div>
            </div>
        </div>

        <div id="sideToolbarContainer">
            <div id="sideToolbarList" class="k-widget k-listview k-selectable">

                <div class="side-tool-item">
                     <span id="tred-mode-btn" class="side-tool-btn btn-tredmode" title="Go to 3D mode">
                        <img src="img/3dmode-icon.png" class="side-tool-btn-image">
                     </span>
                </div>
                <div class="side-tool-item">
                     <span id="delete-list-btn" class="side-tool-btn" title="Delete list">
                        <img src="img/delete-list-icon.png" class="side-tool-btn-image">
                     </span>
                </div>
                <div class="side-tool-item" >
                    <span id="openInformationWindowBtn" class="side-tool-btn" title="Information board">
                        <img src="img/info-icon.png" class="side-tool-btn-image">
                    </span>
                </div>
            </div>
        </div>


    </body>
</html>