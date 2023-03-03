<?php
$path = $_GET["path"];
$files = scandir($path);
$filenames = array();
foreach ($files as $file) {
  if ($file !== "." && $file !== ".." && strpos($file, '.') !== false) {
    $filenames[] = $file;
  }
}
echo json_encode($filenames);
?>
