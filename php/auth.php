<?php
    function checkUser()
    {
        session_start();

        if (isset($_SESSION['validUser'])) {
            return $_SESSION['validUserName'];
        }
        else {
            $_SESSION['dbName'] = "BIM3DSG_BIM-test-v2";
            $_SESSION['titolo'] = "BIM3DSG - TEST";
            $_SESSION['dbConnectionString'] = "host=localhost port=5432 dbname=" . $_SESSION['dbName'] . " user=postgres password=PASSWORD";

            $user = isset($_POST['username']) ? $_POST['username'] : null;
            $pwd = isset($_POST['password']) ? $_POST['password'] : null;

            if ((isset($user)) && (isset($pwd))) {
                $pwd = md5($pwd);

                $dbConnection = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');
                $SQL = "SELECT * FROM \"Utenti\" WHERE \"User\" = '$user' AND \"Password\" = '$pwd'";
                $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
                if ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                    $_SESSION['validUser'] = 1;
                    $_SESSION['validUserName'] = $user;
                    $_SESSION['FullName'] = $row['FullName'];

                    pg_close($dbConnection);

                    return $_SESSION['validUserName'];
                }
                pg_close($dbConnection);
            }
        }

        session_unset();
        session_destroy();

        return null;
    }

    checkUser();
?>