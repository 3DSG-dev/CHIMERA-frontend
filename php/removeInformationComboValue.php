<?php
    include("./defaultStart.php");

    $dbReference = isset($_GET['dbReference']) ? $_GET['dbReference'] : null;
    $codiceCombo = isset($_GET['codiceCombo']) ? $_GET['codiceCombo'] : null;

    $SQL = 'DELETE FROM "' . $dbReference . '_InfoComboBox" WHERE "Codice" = ' . $codiceCombo;

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");

    echo json_encode("ok");

    include("./defaultEnd.php");
?>