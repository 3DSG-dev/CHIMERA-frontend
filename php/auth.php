<?php
/**
 * Created by PhpStorm.
 * User: francescal
 * Date: 28/01/2019
 * Time: 15:56
 */

//header('Content-Type: charset=utf-8');
$titolo = "BIM3DSG - TEST - Saqqara";

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
        $user = isset($_GET['user'])?$_GET['user']:$_POST['user'];
        $pwd = isset($_GET['pwd'])?$_GET['pwd']:$_POST['pwd'];
        $pwd=md5($pwd);
        $SQL= "select count(*) from  \"Utenti\" where \"User\" = '$user' AND \"Password\" = '$pwd'";
        $result1 = pg_query($dbconn, $SQL) or die ("Error: $SQL");
        while($tmp = pg_fetch_array($result1, NULL, PGSQL_ASSOC))
        {
            if ($tmp[count]==1)
            {

                $SQL2= "select * from  \"Utenti\" where \"User\" = '$user' AND \"Password\" = '$pwd'";
                $result2 = pg_query($dbconn, $SQL2) or die ("Error: $SQL2");
                $tmp2 = pg_fetch_array($result2, NULL, PGSQL_ASSOC);

                $_SESSION['validUser']=1;
                $_SESSION['validUserName']=$user;
                $_SESSION['FullName']=$tmp2['FullName'];
                $_SESSION['BIM-mode']=0;
                $_SESSION['layer0'] = "Area";
                $_SESSION['layer1'] = "Zone";
                $_SESSION['layer2'] = "Sector";
                $_SESSION['layer3'] = "Type";
                $_SESSION['objectName'] = "Name";
                return $_SESSION['validUserName'];
            }
        }
        pg_close($dbconn);
    }
    session_unset();
    session_destroy();
    return null;
}
checkUser();

?>

