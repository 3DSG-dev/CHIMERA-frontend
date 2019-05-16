<?php
    include("./defaultStart.php");

    $dbReference = isset($_GET['dbReference']) ? $_GET['dbReference'] : null;
    $codiceCombo = isset($_GET['codiceCombo']) ? $_GET['codiceCombo'] : null;
    $newValue = isset($_GET['newValue']) ? $_GET['newValue'] : null;
    $newValue = pg_escape_literal($newValue);

    $SQL = 'UPDATE "' . $dbReference . '_InfoComboBox" SET "Value" = ' . $newValue . ' WHERE "Codice" = ' . $codiceCombo;

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");

    echo json_encode("ok");

    include("./defaultEnd.php");
?>