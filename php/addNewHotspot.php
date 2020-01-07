<?php /** @noinspection PhpVoidFunctionResultUsedInspection */
    include("./defaultStart.php");

    function InvalidParameters()
    {
        echo json_encode("Invalid parameters!");
        die();
    }

    $layer0Value = !IsNullOrEmptyString($_GET['layer0']) ? pg_escape_literal($_GET['layer0']) : InvalidParameters();
    $layer1Value = !IsNullOrEmptyString($_GET['layer1']) ? pg_escape_literal($_GET['layer1']) : InvalidParameters();
    $layer2Value = !IsNullOrEmptyString($_GET['layer2']) ? pg_escape_literal($_GET['layer2']) : InvalidParameters();
    $layer3Value = !IsNullOrEmptyString($_GET['layer3']) ? pg_escape_literal($_GET['layer3']) : InvalidParameters();
    $nomeValue = !IsNullOrEmptyString($_GET['nome']) ? pg_escape_literal($_GET['nome']) : InvalidParameters();
    $xc = !IsNullOrEmptyString($_GET['xc']) ? $_GET['xc'] : InvalidParameters();
    $yc = !IsNullOrEmptyString($_GET['yc']) ? $_GET['yc'] : InvalidParameters();
    $zc = !IsNullOrEmptyString($_GET['zc']) ? $_GET['zc'] : InvalidParameters();
    $radius = !IsNullOrEmptyString($_GET['radius']) ? $_GET['radius'] : InvalidParameters();
    $SRS = !IsNullOrEmptyString($_GET['SRS']) ? pg_escape_literal($_GET['SRS']) : "null";
    $translationX = !IsNullOrEmptyString($_GET['translationX']) ? $_GET['translationX'] : InvalidParameters();
    $translationY = !IsNullOrEmptyString($_GET['translationY']) ? $_GET['translationY'] : InvalidParameters();
    $translationZ = !IsNullOrEmptyString($_GET['translationZ']) ? $_GET['translationZ'] : InvalidParameters();

    /** @noinspection SpellCheckingInspection */
    $SQL = "SELECT preinitializenewhotspot($layer0Value, $layer1Value, $layer2Value, $layer3Value, $nomeValue, 0, $xc, $yc, $zc, $radius, $translationX, $translationY, $translationZ, $SRS, null, '{$_SESSION['validUserName']}')";

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    if ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        /** @noinspection SpellCheckingInspection */
        echo json_encode($row["preinitializenewhotspot"]);
    } else {
        die("Object Already exists or invalid parameters!");
    }

    include("./defaultEnd.php");
?>