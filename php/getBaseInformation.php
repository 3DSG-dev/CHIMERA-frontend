<?php
    include("./defaultStart.php");

    header("Content-type: application/json");

    $codiceVersione = isset($_GET['codiceVersione']) ? $_GET['codiceVersione'] : null;

    $SQL = 'SELECT "OggettiVersion"."Codice" AS "CodiceVersione", "Oggetti".*, "OggettiVersion".*, "Modelli3D".*, "Modelli3D_LoD".*, c1."DataInizio" AS "CreazioneDataInizio", c1."DataFine" AS "CreazioneDataFine", c2."DataInizio" AS "EliminazioneDataInizio", c2."DataFine" AS "EliminazioneDataFine", "OggettiVersion"."LastUpdate" AS "UpdateDatetime", "OggettiVersion"."LastUpdateBy" AS "UpdateUser", u1."FullName" AS "UpdateFullName", "OggettiVersion"."Lock" AS "LockUser", u2."FullName" AS "LockFullName", "Modelli3D"."LastUpdateBy" AS "UpdateModelliUser", u3."FullName" AS "UpdateModelliFullName" FROM "Oggetti" JOIN "OggettiVersion" ON "Oggetti"."Codice" = "OggettiVersion"."CodiceOggetto" JOIN "Cantieri" AS c1 ON ("Oggetti"."Layer0" = c1."Layer0" AND "Oggetti"."CantiereCreazione" = c1."Numero") LEFT JOIN "Cantieri" AS c2 ON ("Oggetti"."Layer0" = c2."Layer0" AND "Oggetti"."CantiereEliminazione" = c2."Numero") LEFT JOIN "Utenti" AS u1 ON "OggettiVersion"."LastUpdateBy" = u1."User" LEFT JOIN "Utenti" AS u2 ON "OggettiVersion"."Lock" = u2."User" LEFT JOIN "Modelli3D" ON "OggettiVersion"."CodiceModello" = "Modelli3D"."Codice" LEFT JOIN "Modelli3D_LoD" ON "OggettiVersion"."CodiceModello" =  "Modelli3D_LoD"."CodiceModello" LEFT JOIN "Utenti" AS u3 ON "Modelli3D"."LastUpdateBy" = u3."User" WHERE "OggettiVersion"."Codice" = ' . $codiceVersione . ' ORDER BY "Modelli3D_LoD"."LoD" LIMIT 1';

    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    if ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        echo json_encode($row);
    }

    include("./defaultEnd.php");
?>