<?php
/*
	Модуль создания структуры БД gisdb
	!!! Переписать на pdo !!!
*/

if (!$dbd = mysqli_connect('localhost','gisuser','gisuser')){
	die(mysqli_connect_error());
}
mysqli_query($dbd,'use gisdb');
mysqli_query($dbd,'set names utf8');

// Создание таблицы point

$create_str = 'create table point (id int unsigned auto_increment primary key, name char(150) default "",
					lon decimal(20,15) default 0, lat decimal(20,15) default 0, key(name), key(lat), key(lon))';

if (!mysqli_query($dbd,$create_str)){
	echo mysqli_error($dbd);
}else{
	echo 'Таблица создана!';
}


// И т.д. 









?>
