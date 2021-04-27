<?php
    include("./defaultStart.php");

    $thumbMaxSize = 384;

    $ref = isset($_POST['ref']) ? $_POST['ref'] : null;
    $url = isset($_POST['url']) ? $_POST['url'] : null;
    $codice = isset($_POST['codice']) ? $_POST['codice'] : null;

    $fileReceived = $_FILES["addImagesInput"];

    $error = $fileReceived['error'];
    if ($error != UPLOAD_ERR_OK) {
        die("Error code " . $error);
    }
    if ($fileReceived["size"] > 33554432) {
        die("File size is too big!");
    }

    $fileName = $fileReceived['tmp_name'];
    $tmpDir = dirname($fileName);
    $fileNameThumb = $_SERVER["DOCUMENT_ROOT"] . "tmp/L_" . basename($fileName);

    switch (strtolower($fileReceived['type'])) {
        case 'image/png':
            $img = imagecreatefrompng($fileName);
            break;
        case 'image/jpeg':
            $img = imagecreatefromjpeg($fileName);
            break;
        default:
            die('Unsupported File!');
    }

    $width = imagesx($img);
    $height = imagesy($img);

    if ($width > $height) {
        $newWidth = $thumbMaxSize;
        $newHeight = floor($height * ($thumbMaxSize / $width));
        $originalQuality = $width;
    } else {
        $newHeight = $thumbMaxSize;
        $newWidth = floor($width * ($thumbMaxSize / $height));
        $originalQuality = $height;
    }
    $tmpImg = imagecreatetruecolor($newWidth, $newHeight);
    imagecopyresampled($tmpImg, $img, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
    switch (strtolower($fileReceived['type'])) {
        case 'image/png':
            imagejpeg($tmpImg, $fileNameThumb);
            break;
        case 'image/jpeg':
            imagepng($tmpImg, $fileNameThumb);
            break;
        default:
            die('Unsupported File!');
    }

    $now = date("Y-m-d H:i:s");
    $exif = exif_read_data($fileName, 0, true);
    $dataScatto = isset($exif['EXIF']['DateTimeOriginal']) ? preg_replace('/:/', '-', $exif['EXIF']['DateTimeOriginal'], 2) : $now;

    $file = file_get_contents($fileName);
    $fileBytea = pg_escape_bytea($file);
    $fileThumb = file_get_contents($fileNameThumb);
    $fileThumbBytea = pg_escape_bytea($fileThumb);

    $SQL = "INSERT INTO \"Materiale$ref\" VALUES ($codice, '$url', 'immagine', $originalQuality, '$fileBytea', NULL, '$dataScatto', 7, 4, 0, '{$_SESSION['validUserName']}', '{$_SESSION['validUserName']}','$now', '{$_SESSION['validUserName']}', '{$fileReceived['type']}')";
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");

    $SQL = "INSERT INTO \"Materiale$ref\" VALUES ($codice, '$url', 'immagine', $thumbMaxSize, '$fileThumbBytea', NULL, '$dataScatto', 7, 4, 0, '{$_SESSION['validUserName']}', '{$_SESSION['validUserName']}','$now', '{$_SESSION['validUserName']}', '{$fileReceived['type']}')";
    $result = pg_query($dbConnection, $SQL) or die ("Error: $SQL");

    unlink($fileName);
    unlink($fileNameThumb);

    include("./defaultEnd.php");
?>