<?php
    include("php/auth.php");
?>

<!DOCTYPE html>
<html>
    <head>
        <title><?php echo $titolo; ?></title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta charset="iso-8859-15">

        <!-- KENDO UI -->
        <link href="libs/KendoUI/styles/kendo.rtl.min.css" rel="stylesheet" type="text/css" /><!-- (Optional) RTL CSS for Kendo UI widgets for the web. Include only in right-to-left applications. -->
        <link href="libs/KendoUI/styles/kendo.default.min.css" rel="stylesheet" type="text/css" /><!-- Default Kendo UI theme CSS for web widgets and widgets for data visualization. -->
        <link href="libs/KendoUI/styles/kendo.default.mobile.min.css" rel="stylesheet" type="text/css" /><!-- (Optional) Kendo UI Hybrid CSS. Include only if you will use the mobile devices features. -->
        <script src="libs/KendoUI/jquery.min.js"></script> <!-- jQuery JavaScript -->
        <script src="libs/KendoUI/kendo.all.min.js"></script><!-- Kendo UI combined JavaScript -->
        <link rel="stylesheet" type="text/css" href="css/KendoUI.css"/> <!-- css del tema KENDO UI creato con il builder, stilizza tutti i widget con i colori impostati nel builder - da pulire perchè il file contiene le stilizzazioni di tutti  iwidget di KENDOO, ho tolto già quelli inutili ma c'è ancora della robaccia. -->
        <!-- Fine KENDO UI -->

        <script type="text/javascript" src="js/BIM3DSG.js" charset="iso-8859-15"></script>

        <link rel="stylesheet" type="text/css" href="css/main.css"/>
    </head>
    <body>
    <div id="page-container">
        <div id="header-container">
            <div id="header-loghi">
                <div id="loghi-3dsurvey">
                    <div id="logo-3dsurvey-small" class="loghi">
                        <a class="logo-3dsurvey-link" href="http://www.sitech-3dsurvey.polimi.it" target="_blank">
                            <img src="img/logo-3dsurvey-60.png">
                        </a>
                    </div>
                    <div id="logo-3dsurvey-large" class="loghi">
                        <a class="logo-3dsurvey-link" href="http://www.sitech-3dsurvey.polimi.it" target="_blank">
                            <img src="img/logo-3dsurvey-full-60.png">
                        </a>
                    </div>
                </div>
                <div id="loghi-polimi">
                    <div id="logo-polimi-small" class="loghi">
                        <a class="logo-polimi-link" href="http://www.polimi.it" target="_blank">
                            <img src="img/logo-polimi-60.png">
                        </a>
                    </div>

                    <div id="logo-polimi-large" class="loghi">
                        <a class="logo-polimi-link" href="http://www.polimi.it" target="_blank">
                            <img src="img/logo-polimi-testo-60.png">
                        </a>
                    </div>
                </div>

                <?php
                if (isset($_SESSION['validUser'])) {
                    echo '
                            <div id="logout-container">
                                <div class="logout-picture image">
                                    <a href="php/logout.php" title="Disconnetti ' . $_SESSION['validUserName'] . '"><img src="img/lock-icon-grey.png"></a>
                                </div>
                            </div>
                            <div id="user-container">
                                <div class="user-picture image" style=\'background-image: url("img/user-icon.png")\'></div>
                                <div id="actual-user" class="user-label">' . $_SESSION['FullName'] . '</div>
                            </div>
                        ';
                }
                ?>

            </div>
        </div>

        <?php if (!isset($_SESSION['validUser']))
            {
                echo '
                    <div id="login-dialog"></div>
                ';
            }
        ?>

        <div id="mainarea-container">
            <div id="page-title-container">
                <div id="page-title">TESTUAL MODE</div>
                <div id="page-subtitle">Fill in the boxes and click on the search button.</div>
            </div>
            <div id="page-section">
                <div id="page-row">
                    <div id="page-column">

                    </div>
                </div>
            </div>
        </div>

        <div id="side-toolbar-container">
            <div id="side-toolbar-list"  class="k-widget k-listview k-selectable">
                <div class="side-tool-item" >
                    <span id="open-info-window-btn" class="side-tool-btn" title="Info board">
                        <img src="img/info-icon.png" class="side-tool-btn-image">
                    </span>
                </div>
                <div class="side-tool-item">
                     <span id="reset-view-btn" class="side-tool-btn" title="Reset view">
                        <img src="img/refresh-icon.png" class="side-tool-btn-image">
                     </span>
                </div>
            </div>
        </div>

    </body>
</html>