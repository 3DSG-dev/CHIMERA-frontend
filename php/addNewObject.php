<?php /** @noinspection PhpVoidFunctionResultUsedInspection */
    include("./defaultStart.php");

    function InvalidParameters() {
        echo json_encode("Invalid parameters!");
        die();
    }

    $layer0Value = !IsNullOrEmptyString($_GET['layer0']) ? pg_escape_literal($_GET['layer0']) : InvalidParameters();
    $layer1Value = !IsNullOrEmptyString($_GET['layer1']) ? pg_escape_literal($_GET['layer1']) : InvalidParameters();
    $layer2Value = !IsNullOrEmptyString($_GET['layer2']) ? pg_escape_literal($_GET['layer2']) : InvalidParameters();
    $layer3Value = !IsNullOrEmptyString($_GET['layer3']) ? pg_escape_literal($_GET['layer3']) : InvalidParameters();
    $nomeValue = !IsNullOrEmptyString($_GET['nome']) ? pg_escape_literal($_GET['nome']) : InvalidParameters();

    /** @noinspection SpellCheckingInspection */
    $SQL= "SELECT addnewobjectwithoutmodel($layer0Value, $layer1Value, $layer2Value, $layer3Value, $nomeValue, '{$_SESSION['validUserName']}')";

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    if ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        /** @noinspection SpellCheckingInspection */
        echo json_encode($row["addnewobjectwithoutmodel"]);
    }
    else {
        die("Object Already exists or invalid parameters!");
    }

    include("./defaultEnd.php");
?>