<?php
$host = "localhost";
$db   = "pice_db";
$user = "root";
$pass = "";

try {
  $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
  die("DB Connection Error");
}
