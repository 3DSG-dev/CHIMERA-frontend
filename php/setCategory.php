<?php
    include("./defaultStart.php");

    $codiceOggetto = isset($_GET['codiceOggetto']) ? $_GET['codiceOggetto'] : null;
    $codiceCategoria = isset($_GET['codiceCategoria']) ? $_GET['codiceCategoria'] : "null";

    $SQL = "UPDATE \"Oggetti\" SET \"Categoria\"=$codiceCategoria WHERE \"Codice\"=$codiceOggetto";

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");

    echo json_encode("ok");

    include("./defaultEnd.php");
?>