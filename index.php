<?php
    include("php/auth.php");
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $_SESSION['titolo']; ?></title>

        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta charset="iso-8859-15">

        <!-- Common Kendo UI CSS for web widgets and widgets for data visualization. -->
        <!--<link href="libs/KendoUI/styles/kendo.common.min.css" rel="stylesheet" /> -->
        <!-- (Optional) RTL CSS for Kendo UI widgets for the web. Include only in right-to-left applications. -->
        <link href="libs/KendoUI/styles/kendo.rtl.min.css" rel="stylesheet" type="text/css" />
        <!-- Default Kendo UI theme CSS for web widgets and widgets for data visualization. -->
        <link href="libs/KendoUI/styles/kendo.default.min.css" rel="stylesheet" type="text/css" />
        <!-- (Optional) Kendo UI Hybrid CSS. Include only if you will use the mobile devices features. -->
        <link href="libs/KendoUI/styles/kendo.default.mobile.min.css" rel="stylesheet" type="text/css" />
        <script src="libs/KendoUI/jquery.min.js"></script>
        <script src="libs/KendoUI/kendo.all.min.js"></script>
        <link rel="stylesheet" type="text/css" href="css/KendoUI.css" />

        <script type="text/javascript" src="js/BIM3DSG.js" charset="iso-8859-15"></script>

        <link rel="stylesheet" type="text/css" href="css/main.css" />
        <link rel="stylesheet" type="text/css" href="css/BIM3DSG.css" />
    </head>
    <body>
        <div id="pageContainer">
            <div id="headerContainer">
                <div id="logo3DSurveySmall" class="loghi">
                    <a href="http://www.sitech-3dsurvey.polimi.it" target="_blank">
                        <img src="img/logo_3dsurvey_60.png">
                    </a>
                </div>
                <div id="logo3DSurveyLarge" class="loghi">
                    <a href="http://www.sitech-3dsurvey.polimi.it" target="_blank">
                        <img src="img/logo_3dsurvey_full_60.png">
                    </a>
                </div>
                <div id="logoPolimiSmall" class="loghi">
                    <a href="http://www.polimi.it" target="_blank">
                        <img src="img/logo_polimi_60.png">
                    </a>
                </div>
                <div id="logoPolimiLarge" class="loghi">
                    <a href="http://www.polimi.it" target="_blank">
                        <img src="img/logo_polimi_full_60.png">
                    </a>
                </div>

                <?php
                    if (isset($_SESSION['validUser'])) {
                        echo '
                            <div id="logoutButton" class="logoutIcon userInfo">
                                <a href="php/logout.php" title="Logout ' . $_SESSION['validUserName'] . '"><img src="img/lock_icon_grey.png"></a>
                            </div>
                            <div id="userContainer">
                                <div id="userPicture" class="userInfo" style=\'background-image: url("img/user_icon.png")\'></div>
                                <div id="userName" class="userInfo">' . $_SESSION['FullName'] . '</div>
                            </div>
                        ';
                    }
                ?>
            </div>

            <div id="pageContent">
                <div class="page-section search-form-section">

                    <div class="page-row search-form-row">
                        <div class="page-column search-title-column">
                            <h2 class="search-title">Select object to edit</h2>
                            <p class="search-subtitle">Select all the items you want to work on by filtering them with the
                                <b>Search fields</b> or by clicking the button <b>Use your list</b>.</p>

                        </div>
                        <div class="page-column search-form-column">

                            <div class="search-form-searchfields">
                                <div id="ctrSelectLayer0" class="input-searchfield">
                                    <label class="inputLayerLabel">Layer0</label>
                                    <input id="selectLayer0" type="text" class="inputLayer" />
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
                                    or
                                    <button class="k-button k-primary btn-md">Use your list</button>&nbsp;
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

            <div id="sideToolbarContainer">
                <div id="sideToolbarList" class="k-widget k-listview k-selectable">
                    <div class="sideToolbarItem">
                        <span class="sideToolbarBtn mode3dBtn" title="Go to 3D mode">
                            <img src="img/3d_mode_icon.png">
                        </span>
                    </div>
                    <div class="sideToolbarSeparator" />
                    <div class="sideToolbarItem">
                        <span class="sideToolbarBtn" title="Delete list">
                            <img src="img/delete_list_icon.png">
                        </span>
                    </div>
                    <div class="sideToolbarItem">
                        <span class="sideToolbarBtn" title="Information board">
                            <img src="img/info_icon.png">
                        </span>
                    </div>
                </div>
            </div>

            <?php if (!isset($_SESSION['validUser'])) {
                echo '
                    <div id="loginDialog"></div>
                ';
            }
            ?>
        </div>
    </body>
</html>