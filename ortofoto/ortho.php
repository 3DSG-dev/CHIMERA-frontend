<?php

if ($handle = opendir('/var/images/')) {
    while (false !== ($entry = readdir($handle))) {
		if (preg_match("/^(.)*1314_(([0-9]*)_)*[0-9][0-9][0-9]\.tif$/", $entry)) {
	        echo "$entry\n";
		} else {
		}    	
    	
    	
    }
    closedir($handle);
}
?>
