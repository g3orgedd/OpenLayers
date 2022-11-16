<?php
//defined('_SPATH') or die;
// Соединение с базой данных
function cdb(){
   // соединение с БД
   $dbd = mysqli_connect('localhost','geodagrt','gdb94siw');
   // проверка успешности соединения !!!Убрать сообщения!!!
   if(!$dbd){
      return 0;
   }else{
      mysqli_query($dbd,'use '._MAINDB);
      mysqli_query($dbd,'set names utf8');
      return $dbd;
   }
}

// !!!!!!  потом перенести во внешнюю систему !!!!!!
function cdbv(){
   // соединение с БД
   $dbd = mysqli_connect('localhost','dagzfond','jp7s2F93zu');
   // проверка успешности соединения !!!Убрать сообщения!!!
   if(!$dbd){
      return 0;
   }else{
      mysqli_query($dbd,'use dagzemfond');
      mysqli_query($dbd,'set names utf8');
      return $dbd;
   }
}

// Соединение с базой данных c выбором базы данных
function cdbsec($fl){
   // соединение с БД
   $zbd = mysqli_connect('localhost','geodagrt','gdb94siw');
   // проверка успешности соединения 
   if(!$zbd){
    return 'Ошибка соединения!';
      return 0;
   }else{
      if($fl==2){
         mysqli_query($zbd,'use '._SECDB);
      }else{
         mysqli_query($zbd,'use '._MAINDB);
      }
      mysqli_query($zbd,'set names utf8');
      return $zbd;
   }
}
///////////////////////////////////////////////////////////
// Авторизация пользователей
function auth(){
//session_start();
   if (!isset($_SESSION['login'])){
      if (isset($_POST['ok'])){
         $login = isset($_POST['login']) ? trim($_POST['login']): '';
         $pass = isset($_POST['pass']) ? trim($_POST['pass']): '';
         if( preg_match('/^[A-Za-z0-9\- ]+$/u', $login) && preg_match('/^[A-Za-z0-9\- ]+$/u', $pass)){
            if (!$dbd = cdb()){
               $ret_val = '0';
            }
            $sql = 'select * from user where udal="0" and us_lgn="' . $login . '" ';
            if(!$res = mysqli_query($dbd,$sql)){
               $ret_val = '0';
            }else{
               $res_arr = mysqli_fetch_assoc($res);
               if (password_verify($pass,$res_arr['us_pass'])){
                  $_SESSION['login'] = $login;
                  $_SESSION['role']  = $res_arr['role_id'];
                  $_SESSION['polzId']  = $res_arr['id'];
                  $ret_val = $_SESSION['login'];
                  //-- сохранение информации о входе в систему
                  user_log($res_arr['id'],'Авторизация','Главный модуль системы' );
               }else{
                  sleep(2);
                  $ret_val = '0';
               }
            }
         }else{
            sleep(2);
            $ret_val = '0';         }
      }else{
         sleep(2);
         $ret_val = '0';
      }
   }else{ 
      $ret_val = $_SESSION['login'];
   }
return $ret_val;
}

// Функция сохранения действий пользователя в системе
function user_log($user_id, $oper, $modul){
      if($user_id=='' || $oper=='' || $modul=='' || $modul==0){
        return 0;
      }
      $dbd = cdb();
      $user_id = mysqli_real_escape_string($dbd,$user_id);
      $oper = mysqli_real_escape_string($dbd,$oper);
      $modul_id = intval($modul);
     $sql_str = 'insert into '._SECDB.'.userlog (user_id, oper, modul_id) values ('.$user_id.', "'.$oper.'",'.$modul_id.') ';
     if(!$res = mysqli_query($dbd,$sql_str)){
        echo 'error!';
     }else{
       return 1;
     }
}

// =======================================
function printForm(){
   if(isset($_POST['registr'])){
      print <<<html
    <div id='content1'>
      <form action ="rabun/reg.php" method ='post'>
        <div id='form_reg' class="form_auth">
           <div class="ttl_form1">Регистрация пользователя</div>
           <table width=87% align="center" >
               <tr><td style="width=25%;text-align:left;">Пользователь</td><td style="width=75%;text-align:left;"><input name="login" type="text" class="inp_frm1" autocomplete="off" value="eguest"></td></tr>
               <tr><td style="width=25%;text-align:left;">Электронная почта</td><td style="width=75%;text-align:left;"><input name="email" type="text" class="inp_frm1" autocomplete="off" value="eolisaev@yandex.ru"></td></tr>
               <tr><td style="width=25%;text-align:left;">Пароль</td><td style="width=75%;text-align:left;"><input name="pass1" type="password" class="inp_frm1" autocomplete="off" value="1"></td></tr> 
               <tr><td style="width=25%;text-align:left;">Повтор пароля</td><td style="width=75%;text-align:left;"><input name="pass2" type="password" class="inp_frm1" autocomplete="off" value="1"></td></tr> 
           </table>
           <div class="vknop_form"><input type="submit" value="Регистрация" name="reg" class="vknop"><input type="submit" value="Отмена" name="canc" class="vknop"></div>
        </div>
      </form>
html;
  }else{
    print <<<html
    <div id="content1">
    <form action ="" method ="post">
      <div id="form_auth" class="form_auth">
        <div class="ttl_form1">Авторизация</div>
          <table width=85% align="center" >
             <tr><td style="width=25%;text-align:left;">Пользователь</td><td style="width=75%;text-align:left;"><input name="login" type="text" class="inp_frm1" autocomplete="off" value="admin"></td></tr>
             <tr><td style="width=25%;text-align:left;">Пароль</td><td style="width=75%;text-align:left;"><input name="pass" type="password" class="inp_frm1" autocomplete="off" value="1"></td></tr> 
          </table>
          <div class="vknop_form"><input type="submit" value="Регистрация" name="registr" class="vknop1"><input type="submit" value="Войти" name="ok" class="vknop"></div>
      </div>
    </form>
html;
  }
}

// =================================
function menu($wmenu){
   $path = _SPATH;
   if ($wmenu==1){         // role = 1 - администратор системы
   print <<<html
   <ul id="navbar">
      <li id="navvvod"><a href="#">Ввод данных</a>
        <ul>
          <li><a href="{$path}uchastok/">Земельные участки</a></li>
          <li><a href="{$path}pravoobl/">Правообладатели</a></li>
          <li><a href="{$path}akt/" class="dis">Акты осмотра</a></li>
          <li><a href="{$path}obj_ned/" class="dis">Объекты недвижимости</a></li>
          <li><a href="{$path}obj_nez/" class="dis">Объекты незавершенного строительства</a></li>
        </ul>
      </li>
      <li id="navar"><a href="{$path}arenda/" class="dis">Договоры аренды</a>
      </li>

      <li id="navrep"><a href="#">Отчеты</a>
        <ul>
          <li><a href="{$path}rep/kart/">Карточки земельных участков</a></li>
          <li><a href="{$path}rep/spis/">Список земельных участков</a></li>
        </ul>
     </li>

     <li id="navnsi"><a href="#">НСИ</a>
        <ul>
          <li><a href="{$path}spr/vpr/">Виды права</a></li>
          <li><a href="{$path}spr/kat/">Категории земель</a></li>
          <li><a href="{$path}spr/vri/">Виды разрешенного использования</a></li>
          <li><a href="{$path}spr/oob/">Виды ограничений, обременений</a></li>
          <li><a href="{$path}spr/okp/">Классификатор ОКОПФ</a></li>
          <li><a href="{$path}spr/dol/">Должности</a></li>
          <li><a href="{$path}spr/org/">Организации</a></li>
          <li><a href="{$path}spr/vned/">Виды недвижимости</a></li>
          <li><a href="{$path}spr/tned/">Типы недвижимости</a></li>
          <li><a href="{$path}spr/kult/">Категории объектов культурного наследия</a></li>
          <li><a href="{$path}spr/vokn/">Виды объектов культурного наследия</a></li>
        </ul>
      </li>

      <li id="navadm"><a href="#">Администрирование</a>
       <ul>
          <li><a href="{$path}nastr/">Настройки</a>
          <li><a href="{$path}arhiv/">Архив данных</a></li>
          <li><a href="{$path}usmanag/">Управление пользователями</a></li>
          <li><a href="{$path}juser/">Журнал Пользователей</a></li>
          <li><a href="{$path}journal/">Журнал операций</a></li>
        </ul>
      </li>

     <li id="navspr"><a href="#">Справка</a>
       <ul>
          <li><a href="{$path}hlp.php" target="_blank">Помощь</a>
          <li><a href="{$path}prog.php">Разработчики</a></li>
        </ul>
     </li>  
  
     <li id="navvyh"><a href="{$path}vyhod/">Выход</a></li>
  </ul>
html;
  // строка меню Справка <li><a href="{$path}hlp.php">Помощь</a> 
   }elseif($wmenu==3){              // role_id=3 - простой сотрудник (пользователь)
   print <<<html
   <ul id="navbar">
      <li id="navvvod"><a href="#">Ввод данных</a>
        <ul>
          <li><a href="{$path}uchastok/">Земельные участки</a></li>
          <li><a href="{$path}pravoobl/">Правообладатели</a></li>
          <li><a href="{$path}akt/" class="dis">Акты осмотра</a></li>
          <li><a href="{$path}obj_ned/" class="dis">Объекты недвижимости</a></li>
          <li><a href="{$path}obj_nez/" class="dis">Объекты незавершенного строительства</a></li>
        </ul>
      </li>

      <li id="navar"><a href="{$path}arenda/" class="dis">Договоры аренды</a>
      </li>

      <li id="navrep"><a href="#">Отчеты</a>
        <ul>
          <li><a href="{$path}rep/kart/">Карточки земельных участков</a></li>
          <li><a href="{$path}rep/spis/">Список земельных участков</a></li>
        </ul>
     </li>
     <li id="navnsi"><a href="#">НСИ</a>
        <ul>
          <li><a href="{$path}spr/vpr/">Виды права</a></li>
          <li><a href="{$path}spr/kat/">Категории земель</a></li>
          <li><a href="{$path}spr/vri/">Виды разрешенного использования</a></li>
          <li><a href="{$path}spr/oob/">Виды ограничений, обременений</a></li>
          <li><a href="{$path}spr/okp/">Классификатор ОКОПФ</a></li>
          <li><a href="{$path}spr/dol/">Должности</a></li>
          <li><a href="{$path}spr/org/">Организации</a></li>
          <li><a href="{$path}spr/vned/">Виды недвижимости</a></li>
          <li><a href="{$path}spr/tned/">Типы недвижимости</a></li>
          <li><a href="{$path}spr/kult/">Категории объектов культурного наследия</a></li>
          <li><a href="{$path}spr/vokn/">Виды объектов культурного наследия</a></li>
        </ul>
     </li>
     <li id="navnastr"><a href="{$path}nastr/">Настройки</a>
     </li>
     <li id="navspr"><a href="#">Справка</a>
       <ul>
          <li><a href="{$path}hlp.php">Помощь</a>
          <li><a href="{$path}prog.php">Разработчики</a></li>
        </ul>
     </li>  
     <li id="navvyh"><a href="{$path}vyhod/">Выход</a></li>
  </ul>
html;
   }
}
// ========================== печать header
function nach(){
   $path = _SPATH;
   echo <<<html
   <div id="main">
      <div id="header">
         <img src="{$path}fldg/gerb3.png" style="height:100%;">
         <div id="titul"><span id="tit1">Правительство Республики Дагестан</span><br>
                         <span id="tit2">Министерство по земельным и имущественным отношениям Республики Дагестан</span><br>
                         <span id="tit3">Информационно-аналитическая система</span> <span id="tit3">&laquo;Земельный фонд Республики Дагестан&raquo;</span></div>
         <img src="{$path}fldg/flag_trep1.gif" style="height:100%;opacity:0.4;">
      </div>
html;
// <img src="$path/fldg/flag_map.png" style="height:100%;opacity:0.3;"></div>
}
// =========================================
function nach_auto(){
   $path = _SPATH;
   echo <<<html
   <div id="main">
      <div id="header1">
         <img src="{$path}fldg/gerb3.png" style="height:100%;">
         <div id="titul"><span id="tit1">Правительство Республики Дагестан</span><br>
                         <span id="tit2">Министерство по земельным и имущественным отношениям Республики Дагестан</span><br>
                         <span id="tit2">Информационно-аналитическая система &laquo;Земельный фонд РД&raquo;</span></div>
         <img src="{$path}fldg/flag_map.png" style="height:100%;">
      </div>
html;
}

// Печать div - content и его фона 
function bgfon(){
   // Корректировка Даты перед вставкой в таблицу  
    if(!isset($_SESSION['polzId'])){
    echo '<p>нету</p>';
      return 0;
    }
    $sel_str = 'select fon_img from nastr where user_id = ' . $_SESSION['polzId'];
    $dbd = cdb();
    if(!$result = mysqli_query($dbd,$sel_str)){
      die(mysqli_error($dbd));
    }
    $arr = mysqli_fetch_assoc($result);
    $root_dir = str_replace('rabun','',dirname(__FILE__));
    $url_fl_nm = _SPATH . $arr['fon_img'];
    $abs_fl_nm =$root_dir . $arr['fon_img'];
    if(!isset($arr['fon_img']) || $arr['fon_img']=='' || !file_exists($abs_fl_nm)){
      echo '<div id="content" style="background: #ffffff;">';
    }else{
      echo '<div id="content" style="background: url(\''. $url_fl_nm. '\')  no-repeat #ffffff; background-position: center center;">';
    }
    echo '<div id="zat-main" class="zat-main zat-main_hid"></div>';
}


// =========================== печать footer
function konec(){
   echo <<<html
      </div>   <!-- End of content -->
     <div id="footer"><span id="fcopy">&copy; 2018 - Министерство по земельным и имущественным отношениям Республики Дагестан</span></div>
   </div>   <!-- End of main -->
html;
}

// Функция выдающая русские сообщения об ошибках от MySQL  !!!!
function myoshib($errno){
   if($errno==1217){
      $ret_mess = 'Ошибка удаления. Удаляемая запись используется!';
   }elseif($errno==1062){
     $ret_mess = 'Ошибка ввода. Дублируется ключевой параметр!';
   }elseif($errno==1451){
     $ret_mess = 'Запрет удаления. Удаляемая запись используется!';
   }elseif($errno==1146){
     $ret_mess = 'Указанная таблица не найдена!';
   }elseif($errno==1054){
     $ret_mess = 'Указанный столбец не найден!';
   }else{
     $ret_mess = '<Ошибка ввода> ';       //. $errno;    // $errno;
   }
   return $ret_mess;
}

// Корректировка дат из html в mysql- установление значения по умолчанию для пустых СТАРАЯ!!!
function makeDate($d,$flag=1){
  // Корректировка Даты перед вставкой в таблицу  
  // $flag=1 - по умолчанию - "начальная" дата "0000-00-00", 
  //       иначе - конечная дата "9000-01-01"
    if ($d == ''){
    if ($flag == 1)  {
      return '"0000-00-00"';
    } 
    else {
      return '"9000-01-01"';
    }   
  } 
  else {
    return '"'.$d.'"';
  }
}
// Корректировка дат из html в mysql- установление значения по умолчанию для пустых - НОВАЯ
function dateFromHtml($d='', $flag=1){
   // Корректировка Даты перед вставкой в таблицу  
  // $flag=1 - по умолчанию - "начальная" дата "0000-00-00", 
  //       иначе - конечная дата "9000-01-01"
  if ($d == ''){
    if ($flag == 1)  {
      return '"0000-00-00"';
    } 
    else {
      return '"9000-01-01"';
    }   
  } 
  else {
    return '"'.$d.'"';
  }

}

// Корректировка дат из mysql в HTML- установление значения по умолчанию для пустых 
// function makeDate($d){
function dateToHtml($d){
   // Корректировка Даты перед вставкой в таблицу  
      if ($d == '0000-00-00' || $d == '9000-01-01' || $d == _MAXDATE || is_null($d)) {
         return '';
      } else{
         return $d;
      }
}
// проверка переменной на число
function ret_chisl($d){
  // если не число, то возвращем 0
   if(is_numeric($d)){
      return $d;
   }else{
      return 0;
   }
}

// Формат Даты в строку для отчета: ГГГГ-ММ-ДД -> ДД.ММ.ГГГГ  
function dateToRep($d){
   if($d == '0000-00-00' || $d == _MAXDATE){
      return '';
   }else{         
      return date_format(date_create($d),'d.m.Y');
   }
}
  
// Формат числа для отчета: 1234567.55 -> 1 234 567,55  
function numToRep($n){
   if($n == 0 || $n == '0' || $n == ""){
      return '0';
   }else{
   return number_format ( $n, 2 , "," , " " );
   }
}

// Формироавние условия фильтрации  
function form_flt($dtb, $flt_obj, $tbl){
/*  $dtb - соединение с БД
*   $flt_obj - содержит параметры фильтрации присланные из формы фильтрации
*   $tbl - форма для которой формируется условие фильтрации (поле form таблицы flt_tbl)
*   Возвращет условие фильтрации, которое включается в запрос к данным 
* 
*/
  $ret_mass = array('','','');
  if($tbl==''){
    $ret_mass[2]='Не выбрана таблица!';
    return $ret_mass;
  }

   $ret_mass[2]=$flt_obj;  
   
  $flt_str1='';
  $flt_str2='';
  $par_nm1 = mysqli_real_escape_string($dtb,$flt_obj['par1']);   // параметры
  $fld_zn1 = mysqli_real_escape_string($dtb,$flt_obj['zn11']);  // значение1
  $fld_zn2 = mysqli_real_escape_string($dtb,$flt_obj['zn12']);  // значение2
  $fld_oper = intval($flt_obj['oper1']);

// загрузка данных для первого условия
  $sel_str = 'select 1 num, flt_tbl.* from '._MAINDB.'.flt_tbl where form="'.$tbl.'" and rus_name="'.$par_nm1.'"';
  if(!$result = mysqli_query($dtb, $sel_str)){
    $ret_mass[2]='Ошибка загрузки данных 1!';
    return $ret_mass;
  }
  $arr1 = mysqli_fetch_assoc($result);
  $fld_nm = $arr1['name'];

// 
  if($arr1['j_c']!=''){
    $flt_str1 = $arr1['j_c'] . ' where  (';
  }else{
    $flt_str1 = ' where  (';
  }

  if ($fld_oper == 6){                // пусто
    $flt_str1 .= $fld_nm . ' = \'\' ';
  }else if($fld_oper == 5){          // между
    $flt_str1 .= $fld_nm . ' >= \''. $fld_zn1 .'\' and  '.$fld_nm.' <= \''.$fld_zn2.'\' ';
  }else if($fld_oper == 1){          // содержит
    $flt_str1 .= $fld_nm . ' like \'%'. $fld_zn1 .'%\' ';
  }else if($fld_oper == 2){         // равно
    $flt_str1 .= $fld_nm . ' = \''. $fld_zn1.'\' ' ;
  }else if($fld_oper == 3){         // больше либо равно
    $flt_str1 .= $fld_nm . ' >= \''. $fld_zn1.'\' ' ;
  }else if($fld_oper == 4){         // меньше либо равно
    $flt_str1 .= $fld_nm . ' <= \''. $fld_zn1.'\' ' ;
  }else if($fld_oper == 7){         // начинается с 
    $len_znach = mb_strlen($fld_zn1,'UTF8');
    $flt_str1 .= ' left('. $fld_nm . ','.$len_znach.')= \''. $fld_zn1.'\' ' ;
  }
  if ($flt_obj['loper']==''){   // только одно усовие 
    $ret_mass[0] = $flt_str1 .') ';
  }else{
    $par_nm2 = mysqli_real_escape_string($dtb,$flt_obj['par2']);   // параметры
    $fld_zn1 = mysqli_real_escape_string($dtb,$flt_obj['zn21']);
    $fld_zn2 = mysqli_real_escape_string($dtb,$flt_obj['zn22']);
    $loper = ($flt_obj['loper']=='И')?' and ':' or ';
    $fld_oper = intval($flt_obj['oper2']);
  // загрузка данных для второго условия
    $sel_str = 'select 1 num, flt_tbl.* from '._MAINDB.'.flt_tbl where form="'.$tbl.'" and rus_name="'.$par_nm2.'"';
    if(!$result = mysqli_query($dtb, $sel_str)){
      $ret_mass[2]='Ошибка загрузки данных 2!';
      return $ret_mass;
    }
    $arr2 = mysqli_fetch_assoc($result);
    $fld_nm = $arr2['name'];
    if($arr2['j_c']!='' && $arr1['j_c'] != $arr2['j_c']){
      $flt_str1 = $arr2['j_c'] .' '. $flt_str1;
    }

    if ($fld_oper == 6){     // пусто
      $flt_str2 = $fld_nm . ' = \'\' ';
    }else if($fld_oper == 5){  // между
      $flt_str2 = $fld_nm . ' >= \''. $fld_zn1 .'\' and  '.$fld_nm.' <= \''.$fld_zn2.'\' ';
    }else if($fld_oper == 1){  // содержит
      $flt_str2 = $fld_nm . ' like \'%'. $fld_zn1 .'%\' ';
    }else if($fld_oper == 2){ // равно
      $flt_str2 = $fld_nm . ' = \''. $fld_zn1.'\' ' ;
    }else if($fld_oper == 3){
      $flt_str2 = $fld_nm . ' >= \''. $fld_zn1.'\' ' ;
    }else if($fld_oper == 4){
      $flt_str2 = $fld_nm . ' <= \''. $fld_zn1.'\' ' ;
    }else if($fld_oper == 7){         // начинается с 
      $len_znach = mb_strlen($fld_zn1,'UTF8');
      $flt_str2 = ' left('. $fld_nm . ','.$len_znach.')= \''. $fld_zn1.'\' ' ;
    }
    $ret_mass[0] = $flt_str1 .') '. $loper . ' ('. $flt_str2 .') ';
  }

  return $ret_mass;
}




// Проверка на дубликат ключей в таблице
function read_dubl($dtb, $tbl='', $key='', $flag = 0){
  if($tbl==''){
    return 'Нет таблицы';
  }else{
    $tbl = mysqli_real_escape_string($dtb,$tbl);
  }
  if($key==''){
    return 'Нет ключа';
  }else{
    $key = mysqli_real_escape_string($dtb,$key);
  }
  $sql_str = 'select '.$key.', count(*) kol, group_concat(id) spis_id from '.$tbl.' where '.$key.'>"" group by '.$key .' having kol>1';
  if (!$res=mysqli_query($dtb, $sql_str)){
    return 'Ошибка запроса 1';    
  }else{
    if(mysqli_num_rows($res)>0){
      $ret_str = '';
      $s=0;
      while($arr = mysqli_fetch_array($res)){
        $s++;
        $ret_str .= $arr[0].' - '. $arr[1].', <br>';
        if($flag==1){
          $upd_str = 'update '.$tbl.' set oshibka="Дубликат ключа для: '.$arr[0].'" where id in ('.$arr[2].') ';
          if (!mysqli_query($dtb, $upd_str)){
            return 'Ошибка запроса 2 '.mysqli_error($dtb);    
          }
        }
      }
      return 'Дубликаты ключа ('.$s.'): '. $ret_str;
    }else{
      return 'Ок';
    }
  }
}

// ********************************************************
  function output_log_text($log_text = 'Нет данных', $fl_nm='/tmp/log.txt'){
    // вывод сообщений в ЛОГ-файл
  //*** Установка локального времени
    date_default_timezone_set("UTC"); // Устанавливаем часовой пояс по Гринвичу
    $time = time(); // Вот это значение отправляем в базу
    $loc_offset = 3; // Смещение локального времени относительно Гринвича - +3 часа
    $time += $loc_offset * 3600; // Добавляем 3 часа к времени по Гринвичу
    //echo date("Y-m-d H:i:s", $time); // Выводим время пользователя, согласно его часовому
  //***          
  $log_text = "\n".date(" *** d.m.Y H:m:s",$time)." \n".$log_text;
    if($fl_nm=='/tmp/log.txt'){
      $fl_nm = _SDOCRT . $fl_nm;
    }
    if (file_put_contents($fl_nm, $log_text, FILE_APPEND | LOCK_EX)) {
      return '1';
    }else{
      return '-1';
    }
  } 

// ****** Вывод соординат в файл 
  function output_coords($log_text='Нет данных', $fl_nm='/tmp/coord.txt'){
    // вывод сообщений в ЛОГ-файл
    $log_text = $log_text."\n";
    if($fl_nm=='/tmp/coord.txt'){
      $fl_nm = _SDOCRT . $fl_nm;
    }
    if (file_put_contents($fl_nm, $log_text, FILE_APPEND | LOCK_EX)) {
      return '1';
    }else{
      return '-1';
    }
  } 

//  Заменяет все вхождения строки $seach в строке $haystack на строку $replace, начиная с позиции $offset
//  с учетом кодировки $encoding.
function mb_str_replace($haystack, $search,$replace, $offset=0,$encoding='auto'){
    $len_sch = mb_strlen($search,$encoding);
    $len_rep = mb_strlen($replace,$encoding);
    $len_haystack = mb_strlen($haystack,$encoding);
    
    while(($offset = mb_strpos($haystack,$search,$offset,$encoding)) !== false){
        $haystack = mb_substr($haystack,0,$offset,$encoding) . $replace . mb_substr($haystack, $offset + $len_sch, $len_haystack, $encoding);
        $offset = $offset + $len_rep;
        if($offset > mb_strlen($haystack,$encoding)){
          break;
        }
    }
    return $haystack;
}

?>