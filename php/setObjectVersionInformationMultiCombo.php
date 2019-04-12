<?php
    include("./defaultStart.php");

    $codiceOggetto = isset($_GET['codiceOggetto']) ? $_GET['codiceOggetto'] : null;
    $codiceCampo = isset($_GET['codiceCampo']) ? $_GET['codiceCampo'] : null;
    $valore = isset($_GET['valore']) ? $_GET['valore'] : null;

    if (!IsNullOrEmptyString($codiceOggetto) && !IsNullOrEmptyString($codiceCampo)) {
        if (IsNullOrEmptyString($valore)) {
            $SQL = "SELECT setoggettiversioniinfoschedamulticombovalue($codiceOggetto, $codiceCampo, null)";
        }
        else {
            $valore = pg_escape_literal($valore);
            $SQL = "SELECT setoggettiversioniinfoschedamulticombovalue($codiceOggetto, $codiceCampo, $valore)";
        }
    }
    else {
        die("Invalid parameters");
    }

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");

    echo json_encode("ok");

    include("./defaultEnd.php");
?>