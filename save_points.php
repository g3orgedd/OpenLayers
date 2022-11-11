<?php
/*
	!!! Переписать на pdo !!!
*/

if (!$dbd = mysqli_connect('localhost','gisuser','gisuser')){
	die(mysqli_connect_error());
}
mysqli_query($dbd,'use gisdb');
mysqli_query($dbd,'set names utf8');

// Сохраннеие строки в  таблицу point

if (!isset($_POST['lon'])){
	die('Нет данных');
}

$lon = $_POST['lon'];
$lat = $_POST['lat'];

$ins_str = "insert into point set lon=$lon, lat=$lat ";

if (!mysqli_query($dbd,$ins_str)){
	echo mysqli_error($dbd);
}else{
	echo 'Запись добавлена!';
}



?>