<?php

/*
	Модуль записи в таблицу point
*/

$host = "127.0.0.1";
$db = "gisdb";
// $user = "gisuser"; 
// $pass = "gisuser";

$dsn = "mysql:host=$host; dbname=$db; charset=utf8";

try {
    $dbh = new PDO($dsn, $user='root', $pass='');

	// Сохраннеие строки в  таблицу point
	if (!isset($_POST['lon'], $_POST['lat'])) {
		die('No data!');
	}

	$name = $_POST['name'];
	$lon = $_POST['lon'];
	$lat = $_POST['lat'];

	$dbh -> exec("INSERT INTO point SET name = $name, lon = $lon, lat = $lat") 
	or die(print_r($dbh -> errorInfo(), true));

	echo 'SAVED!';
} catch (PDOException $e) {
    die("DB ERROR: " . $e -> getMessage());
}

?>