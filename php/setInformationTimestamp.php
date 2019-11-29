<?php
    include("./setInformationParameters.php");

    if (!IsNullOrEmptyString($codiceRiferimento) && !IsNullOrEmptyString($codiceCampo)) {
        if (IsNullOrEmptyString($valore)) {
            $SQL = "SELECT set" . $dbReference . "infoSchedaValue($codiceRiferimento, $codiceCampo, null)";
        }
        else {
            $valore = pg_escape_literal($valore);
            $SQL = "SELECT set" . $dbReference . "infoSchedaValue($codiceRiferimento, $codiceCampo, to_timestamp($valore, 'DD/MM/YY, HH24:MI:SS'))";
        }
    }
    else {
        die("Invalid parameters");
    }

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");

    echo json_encode("ok");

    include("./defaultEnd.php");
?>