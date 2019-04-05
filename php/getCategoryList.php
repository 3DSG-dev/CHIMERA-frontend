<?php
    include("./defaultStart.php");

    $SQL = 'SELECT "Categorie"."Codice", "GruppiCategorie"."Nome" AS "GruppoCategoria", "Categorie"."Nome" FROM "Categorie" JOIN "GruppiCategorie" ON "Categorie"."CodiceGruppo" = "GruppiCategorie"."Codice" ORDER BY "GruppiCategorie"."Nome", "Categorie"."Nome"';

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }

    echo json_encode($rowArray);

    include("./defaultEnd.php");
?>