<?php
    include("./defaultStart.php");

    header("Content-type: application/json");
    echo "{";

    $codiceVersione = isset($_GET['codiceVersione']) ? $_GET['codiceVersione'] : null;

    $SQL = 'SELECT "CodiceOggetto" FROM "OggettiVersion" WHERE "Codice" = ' . $codiceVersione;
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    if ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $codiceOggetto = $row["CodiceOggetto"];
        echo '"CodiceOggetto": ' . $codiceOggetto;
    }

    $SQL = 'SELECT DISTINCT "URL", "MaterialeOggetti"."CodiceOggetto" AS "Codice" FROM "MaterialeOggetti" WHERE "Tipo" = \'immagine\' AND "CodiceOggetto" = ' . $codiceOggetto;
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }
    echo ', "ImmaginiOggetto": ' . json_encode($rowArray);

    $SQL = 'SELECT DISTINCT "URL", "CodiceVersione" AS "Codice" FROM "MaterialeVersioni" WHERE "Tipo" = \'immagine\' AND "CodiceVersione" = ' . $codiceVersione;
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $rowArray = array();
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rowArray[] = $row;
    }
    echo ', "ImmaginiVersione": ' . json_encode($rowArray);


    $SQL = 'SELECT "Codice", "SubVersion" FROM "OggettiSubVersion" WHERE "CodiceVersione" = ' . $codiceVersione . ' ORDER BY "Codice"';
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        echo ', "CodiceSubVersion' . $row["SubVersion"] . '": ' . $row["Codice"];

        $SQL2 = 'SELECT DISTINCT "URL", "CodiceSubVersion" AS "Codice" FROM "MaterialeSubVersion" WHERE "Tipo" = \'immagine\' AND "CodiceSubVersion" = ' . $row["Codice"];
        $result2 = pg_query($dbConnection, $SQL2) or die ("Error: $SQL2");
        $rowArray2 = array();
        while ($row2 = pg_fetch_array($result2, null, PGSQL_ASSOC)) {
            $rowArray2[] = $row2;
        }
        echo ', "ImmaginiSubVersion' . $row["SubVersion"] . '": ' . json_encode($rowArray2);

        if ($row["SubVersion"] > 0) {
            $SQL3 = 'SELECT "Intervento" FROM "InterventiSubVersion_Relazioni" WHERE "InterventiSubVersion_Relazioni"."Figlio" = ' . $row["Codice"];
            $result3 = pg_query($dbConnection, $SQL3) or die ("Error: $SQL3");
            if ($row3 = pg_fetch_array($result3, null, PGSQL_ASSOC)) {
                echo ', "CodiceInterventoSubVersion' . $row["SubVersion"] . '": ' . $row3["Intervento"];

                $SQL2 = 'SELECT DISTINCT "URL", "CodiceInterventiSubVersion" AS "Codice" FROM "MaterialeInterventiSubVersion" WHERE "Tipo" = \'immagine\' AND "CodiceInterventiSubVersion" = ' . $row3["Intervento"];
                $result2 = pg_query($dbConnection, $SQL2) or die ("Error: $SQL2");
                $rowArray2 = array();
                while ($row2 = pg_fetch_array($result2, null, PGSQL_ASSOC)) {
                    $rowArray2[] = $row2;
                }
                echo ', "ImmaginiInterventiSubVersion' . $row["SubVersion"] . '": ' . json_encode($rowArray2);
            }
        }
    }

    echo "}";

    include("./defaultEnd.php");
?>