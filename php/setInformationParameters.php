<?php
    include("./defaultStart.php");

    $dbReference = isset($_GET['dbReference']) ? $_GET['dbReference'] : null;
    $codiceRiferimento = isset($_GET['codiceRiferimento']) ? $_GET['codiceRiferimento'] : null;
    $codiceCampo = isset($_GET['codiceCampo']) ? $_GET['codiceCampo'] : null;
    $valore = isset($_GET['valore']) ? $_GET['valore'] : null;
?>