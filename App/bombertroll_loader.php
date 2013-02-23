<?php
/**************************
* BOMBER TROLL LOADER PHP *
**************************/

$no_cache = false;
$jsfile = "bombertroll_loader.js";
$output = "";
$modified = 0;
$filelist = array();

if (file_exists($jsfile)) {
	$handle = fopen($jsfile, "r");
	if ($handle) {
		while (($line = fgets($handle)) !== false) {
			// Process line
			if (trim($line) == "//combinator:end") break;
			if (trim($line) == "//combinator:start") {
				$modified = max($modified, filemtime($jsfile));
				$filelist[] = $jsfile;
				continue;
			}
			
			if ($modified == 0) {
				continue;
			}
			
			$pos = strpos($line, "include_js");
			if ($pos !== FALSE) {
				// Add JS contents
				$tabs = substr_count($line, "\t", 0, $pos);
				$spaces = substr_count($line, " ", 0, $pos);
				$sub_jsfile = extract_filename($line);
				
				if (file_exists($sub_jsfile)) {
					// Leading Comment
					$output .= "\n\n";
					$output .= "/* --- Start of " . $sub_jsfile . " --- */";
					$output .= "\n\n";
					
					// Process File
					$modified = max($modified, filemtime($sub_jsfile));
					$filelist[] = $sub_jsfile;
					$sub_handle = fopen($sub_jsfile, "r");
					if ($sub_handle) {
						while (($sub_line = fgets($sub_handle)) !== false) {
							for ($i=0; $i<$tabs; $i++) {
								$output .= "\t";
							}
							for ($i=0; $i<$spaces; $i++) {
								$output .= " ";
							}
							$output .= $sub_line;
						}
					}
					
					// Trailing Comment
					$output .= "\n\n";
					$output .= "/* --- End of " . $sub_jsfile . " --- */";
					$output .= "\n\n";
				} else {
					$output .= $line;
				}
			} else {
				// Add the line
				$output .= $line;
			}
		}
		fclose($handle);
	}
}

// Send Etag hash
$modified = max($modified, filemtime(__FILE__));
$hash = $modified . '-' . md5(implode(",", $filelist));
header ("Etag: \"" . $hash . "\"");

// Send combined contents
if (!$no_cache && isset($_SERVER['HTTP_IF_NONE_MATCH']) && stripslashes($_SERVER['HTTP_IF_NONE_MATCH']) == '"' . $hash . '"') {
	// Return visit and no modifications, so do not send anything
	header("HTTP/1.0 304 Not Modified");
	header('Content-Length: 0');
} else {
	// Send output
	$output = iconv("ISO-8859-1", "UTF-8", $output);
	header("Content-Type: text/javascript");
	header('Content-Length: ' . strlen($output));
	echo $output;
}

/*
* Helpers
*/

function extract_filename($line) {
	$dummy_filename = "empty_dummy.file";
	$offset = strpos($line, "\"") + 1;
	if ($offset <= 0) {
		$offset = strpos($line, "'") + 1;
	}
	$length = strpos($line, "\"", $offset + 1) - $offset;
	if ($length < 4) {
		$length = strpos($line, "'", $offset + 1) - $offset;
	}
	if ($offset < ($offset + $length)) {
		return substr($line, $offset, $length) . ".js";
	} else {
		return $dummy_filename . "." . $offset . "." . $length;
	}
}

?>
