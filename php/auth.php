<?php
$titolo = "BIM3DSG - TEST";

function checkUser(){
    session_start();

    if (!isset($_SESSION['started'])) {
        $_SESSION['started']=1;
    }

    if(isset($_SESSION['validUser'])) {
        return $_SESSION['validUserName'];
    }
    else {
        $_SESSION['dbName'] = "BIM3DSG_BIM-test-lori2";
        //$_SESSION['dbName'] = "BIM3DSG_BIM-test-new";
        $_SESSION['dbConnectionString'] = "host=localhost port=5432 dbname=" . $_SESSION['dbName'] . " user=postgres password=5ETBL6gzh9";

        $user = isset($_POST['user']) ? $_POST['user'] : null;
        $pwd = isset($_POST['pwd']) ? $_POST['pwd'] : null;


        if ((isset($user)) && (isset($pwd))) {
            $dbconn = pg_connect($_SESSION['dbConnectionString']) or die ('Error connecting to db');

            $pwd = md5($pwd);
            $SQL = "select * from  \"Utenti\" where \"User\" = '$user' AND \"Password\" = '$pwd'";
            $result = pg_query($dbconn, $SQL) or die ("Error: $SQL");
            $row = pg_fetch_array($result, NULL, PGSQL_ASSOC);

            $rows = pg_num_rows($result);
            if ($rows == 1) {
                $_SESSION['validUser'] = 1;
                $_SESSION['validUserName'] = $user;
                $_SESSION['FullName'] = $row['FullName'];

                pg_close($dbconn);
                return $_SESSION['validUserName'];
            }
            pg_close($dbconn);
        }
    }
    session_unset();
    session_destroy();

    return null;
}

checkUser();
?>

