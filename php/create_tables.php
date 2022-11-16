<?php

/*
	Модуль создания структуры БД gisdb
*/

$host = "127.0.0.1";
$db = "gisdb";
// $user = "gisuser"; 
// $pass = "gisuser";

$dsn = "mysql:host=$host; dbname=$db; charset=utf8";

$createTablePoints = "CREATE TABLE point (
	id INT(7) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(150) DEFAULT '',
	lon DECIMAL(20, 15) DEFAULT 0, 
	lat DECIMAL(20, 15) DEFAULT 0, 
	KEY(lat), KEY(lon))";

try {
    $dbh = new PDO($dsn, $user='root', $pass='');

	$dbh -> exec($createTablePoints) or die(print_r($dbh -> errorInfo(), true));

	echo 'Таблица создана!';
} catch (PDOException $e) {
    die("DB ERROR: " . $e -> getMessage());
}

?>