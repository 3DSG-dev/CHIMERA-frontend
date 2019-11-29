<?php
    include("./defaultStart.php");

    $dbReference = isset($_GET['dbReference']) ? $_GET['dbReference'] : null;
    $codiceCampo = isset($_GET['codiceCampo']) ? $_GET['codiceCampo'] : null;
    $addValue = isset($_GET['addValue']) ? $_GET['addValue'] : null;
    $addValue = pg_escape_literal($addValue);

    /** @noinspection SqlResolve */
    $SQL = 'INSERT INTO "' . $dbReference . '_InfoComboBox" ("CodiceCampo", "Value") VALUES ' . "($codiceCampo, $addValue)";

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");

    echo json_encode("ok");

    include("./defaultEnd.php");
?>