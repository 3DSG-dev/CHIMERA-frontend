<?php
    function CheckUser()
    {
        session_start();

        if (isset($_SESSION['validUser'])) {
            return $_SESSION['validUserName'];
        }
        else {
            LoadDefaultSettings();

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
                    $_SESSION['fullName'] = $row['FullName'];

                    LoadSettings($dbConnection);

                    pg_close($dbConnection);

                    return $_SESSION['validUserName'];
                }
                pg_close($dbConnection);
            }
        }

        return null;
    }

    function LoadDefaultSettings()
    {
        $_SESSION['dbName'] = "BIM3DSG_BIM-test-v2";
        $_SESSION['titolo'] = "BIM3DSG - TEST";

        $_SESSION['dbConnectionString'] = "host=localhost port=5432 dbname=" . $_SESSION['dbName'] . " user=postgres password=PASSWORD";
        $_SESSION["layer0Label"] = 'Layer0';
        $_SESSION["layer1Label"] = 'Layer1';
        $_SESSION["layer2Label"] = 'Layer2';
        $_SESSION["layer3Label"] = 'Layer3';
        $_SESSION["nomeLabel"] = 'Nome';
        $_SESSION["versionLabel"] = 'Version';
    }

    function LoadSettings($dbConnection)
    {
        $SQL = 'SELECT * FROM "Settings"';
        $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");
        while ($row = pg_fetch_array($result, null, PGSQL_ASSOC)) {
            switch ($row["Key"]) {
                case "Layer0" :
                    $_SESSION["layer0Label"] = $row["TextValue"];
                    break;
                case "Layer1" :
                    $_SESSION["layer1Label"] = $row["TextValue"];
                    break;
                case "Layer2" :
                    $_SESSION["layer2Label"] = $row["TextValue"];
                    break;
                case "Layer3" :
                    $_SESSION["layer3Label"] = $row["TextValue"];
                    break;
                case "Nome" :
                    $_SESSION["nomeLabel"] = $row["TextValue"];
                    break;
                case "Version" :
                    $_SESSION["versionLabel"] = $row["TextValue"];
                    break;
                default :
                    break;
            }
        }
    }

    CheckUser();
?>