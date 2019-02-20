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
        <!--<link href="libs/KendoUI/styles/kendo.common.min.css" rel="stylesheet" /> -->
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
                                <div style="clear:both;"></div>
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

                <div class="pageSection gridObjectListResultSection">
                    <div class="pageRow gridObjectListResultRow">
                        <div class="pageColumn gridObjectListResultColumn">
                            <div id="objectsGrid" style="height: calc(100vh - 382px);"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div id="sideToolbarContainer">
                <div id="sideToolbarList" class="k-widget k-listview k-selectable">
                    <div class="sideToolbarItem">
                        <span class="sideToolbarBtn mode3dBtn" title="Go to 3D mode">
                            <img src="img/3d_mode_icon.png" alt="3D Mode">
                        </span>
                    </div>
                    <div class="sideToolbarSeparator"></div>
                    <div class="sideToolbarItem">
                        <span class="sideToolbarBtn" title="Delete list">
                            <img src="img/delete_list_icon.png" alt="Delete list">
                        </span>
                    </div>
                    <div class="sideToolbarItem">
                        <span class="sideToolbarBtn" title="Information board">
                            <img src="img/info_icon.png" alt="Information board">
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