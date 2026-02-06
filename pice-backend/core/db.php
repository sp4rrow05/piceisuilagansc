<?php
$host = "http://145.79.26.201";
$db   = "u329369565_pice_db";
$user = "u329369565_piceisuadmin";
$pass = "@Sp4rrow05#";

try {
  $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
  die("DB Connection Error");
}
