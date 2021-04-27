<?php
    include("./defaultStart.php");

    header("Content-type: application/json");
    echo "{";

    $codiceVersione = isset($_GET['codiceVersione']) ? $_GET['codiceVersione'] : null;

    $SQL = 'SELECT "Oggetti_Schede".* FROM "Oggetti_Schede" JOIN "Oggetti_RelazioniSchede" ON "Oggetti_Schede"."CodiceScheda" = "Oggetti_RelazioniSchede"."CodiceScheda" JOIN "OggettiVersion" ON "Oggetti_RelazioniSchede"."CodiceOggetto" = "OggettiVersion"."CodiceOggetto" WHERE "OggettiVersion"."Codice" = ' . $codiceVersione;
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }
    echo '"InformazioniOggetto": ' . json_encode($rowArray);

    $SQL = 'SELECT "OggettiVersion_Schede".* FROM "OggettiVersion_Schede" JOIN "OggettiVersion_RelazioniSchede" ON "OggettiVersion_Schede"."CodiceScheda" = "OggettiVersion_RelazioniSchede"."CodiceScheda" WHERE "OggettiVersion_RelazioniSchede"."CodiceVersione" = ' . $codiceVersione;
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }
    echo ', "InformazioniVersione": ' . json_encode($rowArray);

    $SQL = 'SELECT "Codice", "SubVersion" FROM "OggettiSubVersion" WHERE "CodiceVersione" = ' . $codiceVersione . ' ORDER BY "Codice"';
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        echo ', "CodiceSubVersion' . $row["SubVersion"] . '": ' . $row["Codice"];

        $SQL2 = 'SELECT "OggettiSubVersion_Schede".* FROM "OggettiSubVersion_Schede" JOIN "OggettiSubVersion_RelazioniSchede" ON "OggettiSubVersion_Schede"."CodiceScheda" = "OggettiSubVersion_RelazioniSchede"."CodiceScheda" WHERE "OggettiSubVersion_RelazioniSchede"."CodiceSubVersion" = ' . $row["Codice"];
        $result2 = pg_query($dbConnection, $SQL2) or die ("Error: $SQL2");
        $rowArray2 = array();
        while ($row2 = pg_fetch_array($result2, null, PGSQL_ASSOC)) {
            $rowArray2[] = $row2;
        }
        echo ', "InformazioniSubVersion' . $row["SubVersion"] . '": ' . json_encode($rowArray2);

        if ($row["SubVersion"] > 0) {
            $SQL3 = 'SELECT "Intervento" FROM "InterventiSubVersion_Relazioni" WHERE "InterventiSubVersion_Relazioni"."Figlio" = ' . $row["Codice"];
            $result3 = pg_query($dbConnection, $SQL3) or die ("Error: $SQL3");
            if ($row3 = pg_fetch_array($result3, null, PGSQL_ASSOC)) {
                echo ', "CodiceInterventoSubVersion' . $row["SubVersion"] . '": ' . $row3["Intervento"];

                $SQL2 = 'SELECT "InterventiSubVersion_Schede".* FROM "InterventiSubVersion_Schede" JOIN "InterventiSubVersion_RelazioniSchede" ON "InterventiSubVersion_Schede"."CodiceScheda" = "InterventiSubVersion_RelazioniSchede"."CodiceScheda" WHERE "InterventiSubVersion_RelazioniSchede"."CodiceIntervento" = ' . $row3["Intervento"];
                $result2 = pg_query($dbConnection, $SQL2) or die ("Error: $SQL2");
                $rowArray2 = array();
                while ($row2 = pg_fetch_array($result2, null, PGSQL_ASSOC)) {
                    $rowArray2[] = $row2;
                }
                echo ', "InformazioniInterventiSubVersion' . $row["SubVersion"] . '": ' . json_encode($rowArray2);
            }
        }
    }

    echo "}";

    include("./defaultEnd.php");
?>