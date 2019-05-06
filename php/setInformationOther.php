<?php
    include("./defaultStart.php");

    $dbReference = isset($_GET['dbReference']) ? $_GET['dbReference'] : null;
    $codiceRiferimento = isset($_GET['codiceRiferimento']) ? $_GET['codiceRiferimento'] : null;
    $codiceCampo = isset($_GET['codiceCampo']) ? $_GET['codiceCampo'] : null;
    $valore = isset($_GET['valore']) ? $_GET['valore'] : null;

    if (!IsNullOrEmptyString($codiceRiferimento) && !IsNullOrEmptyString($codiceCampo)) {
        if (IsNullOrEmptyString($valore)) {
            $SQL = "SELECT set" . $dbReference . "infoschedavalue($codiceRiferimento, $codiceCampo, null)";
        }
        else {
            $valore = pg_escape_string($valore);
            $SQL = "SELECT set" . $dbReference . "infoschedavalue($codiceRiferimento, $codiceCampo, $valore)";
        }
    }
    else {
        die("Invalid parameters");
    }

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");

    echo json_encode("ok");

    include("./defaultEnd.php");
?>