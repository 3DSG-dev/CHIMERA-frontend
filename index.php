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

        <!--<link href="libs/KendoUI/styles/kendo.common.min.css" rel="stylesheet" /> <!-- Common Kendo UI CSS for web widgets and widgets for data visualization. -->
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
            <div class="page-section search-form-section">

                <div class="page-row page-title-row">
                    <div class="page-column page-title-column">
                        <h1 class="page-title">TEXTUAL MODE</h1>
                    </div>
                </div>

                <div class="page-row search-form-row">
                    <div class="page-column search-title-column">
                        <h2 class="search-title">View Saqqara site items as a list</h2>
                        <!--<h2 class="search-title">Work with Saqqara site items</h2>-->
                        <p class="search-subtitle">View all the items you want to work on by filtering them with the <b>Search fields</b> tab or by clicking the <b>Use your list</b> tab.</p>
                        <p class="notes">NOTES: - Your list can only be modified via 3D mode. - Search fields works even if you leave some fields empty.</p>
                    </div>
                    <div class="page-column search-form-column">
                        <div class="search-form-tabstrip">
                            <ul>
                                <li class="k-state-active">Search fields</li>
                                <li>Use your list</li>
                            </ul>
                            <div class="searchform-tabitem">
                                <div class="inputSelectObject">
                                    <label class="inputLayerLabel">Layer0</label>
                                    <input id="inputLayer0" type="text" class="k-textbox inputLayer"/>
                                </div>
                                <div class="inputSelectObject">
                                    <label class="inputLayerLabel">Layer1</label>
                                    <input id="inputLayer1" type="text" class="k-textbox inputLayer">
                                </div>
                                <div class="inputSelectObject">
                                    <label class="inputLayerLabel">Layer2</label>
                                    <input id="inputLayer2" type="text" class="k-textbox inputLayer">
                                </div>
                                <div class="inputSelectObject">
                                    <label class="inputLayerLabel">Layer3</label>
                                    <input id="inputLayer3" type="text" class="k-textbox inputLayer">
                                </div>
                                <div class="inputSelectObject">
                                    <label class="inputLayerLabel">Name</label>
                                    <input id="inputName" type="text" class="k-textbox inputLayer">
                                </div>
                                <div class="inputSelectObject">
                                    <label class="inputLayerLabel">Version</label>
                                    <input id="inputVersion" type="text" class="k-textbox inputLayer">
                                </div>
                                <div style="clear:both;"></div>
                                <div class="btnSelectObjectWrap">
                                    <button class="k-button k-primary btnSelectObject">Search</button>&nbsp;
                                </div>
                            </div>
                            <div class="searchform-tabitem">
                                <div class="btnSelectObjectWrap">
                                    <button class="k-button k-primary btnSelectObject">Use you list</button>&nbsp;
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

                            <style>

                                .search-form-tabstrip h2 {
                                    font-weight: lighter;
                                    font-size: 5em;
                                    line-height: 1;
                                    padding: 0 0 0 30px;
                                    margin: 0;
                                }

                                .search-form-tabstrip h2 span {
                                    background: none;
                                    padding-left: 5px;
                                    font-size: .3em;
                                    vertical-align: top;
                                }

                                .search-form-tabstrip p {
                                    margin: 0;
                                    padding: 0;
                                }
                            </style>

                            <script>
                                $(document).ready(function() {
                                    $(".search-form-tabstrip").kendoTabStrip({
                                        animation:  {
                                            open: {
                                                effects: "fadeIn"
                                            }
                                        }
                                    });
                                });
                            </script>

                    <!----
                                        <div class="page-column form-column">
                                            <div class="inputSelectObject">
                                                <label for="inputLayer0">Layer 0</label>
                                                <input id="inputLayer0" type="text" class="k-textbox inputLayer"/>
                                            </div>
                                            <div class="inputSelectObject">
                                                <label for="inputLayer1">Layer 1</label>
                                                <input id="inputLayer1" type="text" class="k-textbox inputLayer">
                                            </div>
                                            <div class="inputSelectObject" style="margin-right:0;">
                                                <label for="inputLayer2">Layer 2</label>
                                                <input id="inputLayer2" type="text" class="k-textbox inputLayer">
                                            </div>
                                            <div style="clear:both;"></div>
                                            <div class="inputSelectObject">
                                                <label for="inputLayer3">Layer 3</label>
                                                <input id="inputLayer3" type="text" class="k-textbox inputLayer">
                                            </div>
                                            <div class="inputSelectObject">
                                                <label for="inputName">Name</label>
                                                <input id="inputName" type="text" class="k-textbox inputLayer">
                                            </div>
                                            <div class="inputSelectObject">
                                                <label for="inputVersion">Version</label>
                                                <input id="inputVersion" type="text" class="k-textbox inputLayer">
                                            </div>
                                            <div style="clear:both;"></div>
                                            <div class="btnSelectObjectWrap">
                                                <button class="k-button k-primary btnSelectObject">Ricerca</button>&nbsp;
                                                <p style="margin-top:6px;">oppure</p>
                                            </div>

                                            <div class="btnSelectObjectWrap">
                                                <button class="k-button k-primary btnSelectObject">Usa la tua lista</button>&nbsp;
                                            </div>
                                        </div>
                                        --->


            <div class="page-section gridResultSection">
                <div class="page-row gridResultRow">
                    <div class="page-column gridResultColumn">
                        <div id="gridResult"></div>

                        <script src="https://demos.telerik.com/kendo-ui/content/shared/js/products.js"></script>
                        <script>
                            $(document).ready(function() {
                                $("#gridResult").kendoGrid({
                                    dataSource: {
                                        data: products,
                                        schema: {
                                            model: {
                                                fields: {
                                                    ProductName: { type: "string" },
                                                    UnitPrice: { type: "number" },
                                                    UnitsInStock: { type: "number" },
                                                    Discontinued: { type: "boolean" }
                                                }
                                            }
                                        },
                                        pageSize: 20
                                    },
                                    height: 550,
                                    scrollable: true,
                                    sortable: true,
                                    filterable: true,
                                    pageable: {
                                        input: true,
                                        numeric: false
                                    },
                                    columns: [
                                        "ProductName",
                                        { field: "UnitPrice", title: "Unit Price", format: "{0:c}", width: "130px" },
                                        { field: "UnitsInStock", title: "Units In Stock", width: "130px" },
                                        { field: "Discontinued", width: "130px" }
                                    ]
                                });
                            });
                        </script>
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
                     <span id="reset-list-btn" class="side-tool-btn" title="Reset list">
                        <img src="img/refresh-list-icon.png" class="side-tool-btn-image">
                     </span>
                </div>
                <div class="side-tool-item">
                     <span id="tred-mode-btn" class="side-tool-btn" title="3D mode">
                        <img src="img/3dmode-icon.png" class="side-tool-btn-image">
                     </span>
                </div>
            </div>
        </div>

    </body>
</html>