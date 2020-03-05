<?php
    include("./defaultStart.php");

    header("Content-type: application/json");
    echo "{";

    $SQL = 'SELECT * FROM "GisTables"';
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
    $database = null;
    $dbConnection2 = null;
    while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        if ($database != null) {
            echo ',';
        }
        if ($database != $row["Database"]) {
            if ($dbConnection2 != null) {
                pg_close($dbConnection2);
            }

            $database = $row["Database"];
            $dbConnection2 = pg_connect("host=localhost port=5432 dbname=$database user=postgres password=5ETBL6gzh9") or die ('Error connecting to db');
        }

        $SQL2 = "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = '{$row["Table"]}' AND column_name NOT IN ('layer0', 'layer1', 'layer2', 'layer3', 'name', 'version', 'geom')";
        $result2 = pg_query($dbConnection2, $SQL2) or die ("Error: $SQL2");
        $rowArray2 = array();
        while ($row2 = pg_fetch_array($result2, null, PGSQL_ASSOC)) {
            $rowArray2[] = $row2;
        }
        echo '"' . $database . '||' . $row["Table"] . '": ' . json_encode($rowArray2);
    }

    if ($dbConnection2 != null) {
        pg_close($dbConnection2);
    }

    echo "}";

    include("./defaultEnd.php");
?>