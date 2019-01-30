<?php

$titolo = "BIM3DSG - TEST";

function checkUser()
{
    session_start();
    if (!isset($_SESSION['started'])) {
        $_SESSION['started']=1;
    }
    if(isset($_SESSION['validUser'])) {
        return $_SESSION['validUserName'];
    }
    else {
        $_SESSION['dbName'] = "BIM3DSG_BIM-test-v2";
        $_SESSION['dbConnectionString'] = "host=localhost port=5432 dbname=" . $_SESSION['dbName'] . " user=postgres password=PASSWORD";

        $dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');

        $user = isset($_POST['user']) ? $_POST['user'] : null;
        $pwd = isset($_POST['pwd']) ? $_POST['pwd'] : null;

        if ((isset($user)) && (isset($pwd))) {
            $pwd = md5($pwd);
            $SQL = "select count(*) from  \"Utenti\" where \"User\" = '$user' AND \"Password\" = '$pwd'";
            $result = pg_query($dbconn, $SQL) or die ("Error: $SQL");
            $row = pg_fetch_array($result, NULL, PGSQL_ASSOC);

            if ($row['count'] == 1) {
                $SQL2 = "select * from  \"Utenti\" where \"User\" = '$user' AND \"Password\" = '$pwd'";
                $result2 = pg_query($dbconn, $SQL2) or die ("Error: $SQL2");
                $row2 = pg_fetch_array($result2, NULL, PGSQL_ASSOC);

                $_SESSION['validUser'] = 1;
                $_SESSION['validUserName'] = $user;
                $_SESSION['FullName'] = $row2['FullName'];

                pg_close($dbconn);
                return $_SESSION['validUserName'];
            }
        }
    }
    session_unset();
    session_destroy();
    return null;
}
checkUser();

?>

