<?php
require "../core/auth_guard.php";

function financial_read() {
  global $pdo;

  $stmt = $pdo->query("SELECT * FROM financial_report LIMIT 1");
  $row = $stmt->fetch(PDO::FETCH_ASSOC);

  json_response($row ?: ["file" => null]);
}

function financial_update() {
  global $pdo;

  if (!isset($_FILES["file"])) {
    json_response(["error" => "No file uploaded"], 400);
  }

  $ext = strtolower(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION));

  if ($ext !== "pdf") {
    json_response(["error" => "Only PDF allowed"], 400);
  }

  $dir = "../uploads/financial/";
  if (!is_dir($dir)) mkdir($dir, 0777, true);

  $old = $pdo->query("SELECT file FROM financial_report LIMIT 1")->fetch();

  if ($old && $old["file"] && file_exists($dir.$old["file"])) {
    unlink($dir.$old["file"]);
  }

  $fileName = uniqid().".pdf";
  move_uploaded_file($_FILES["file"]["tmp_name"], $dir.$fileName);

  $pdo->prepare("UPDATE financial_report SET file=? WHERE id=1")
      ->execute([$fileName]);

  json_response(["success" => true]);
}
