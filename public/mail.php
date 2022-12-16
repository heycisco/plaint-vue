<?php
$subject = 'Новая жалоба!';
$data = json_decode(file_get_contents('php://input'), true);
$message = $data['msg'];
$name = $data['name'];
$to_email = 'testphp@starchenkov.pro';
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=utf-8" . "\r\n";
$headers .= 'From: ' . $name;
mail($to_email,$subject,$message,$headers);
?>