<?php
require "../core/auth_guard.php";

function actionplan_read() {
  global $pdo;

  $stmt = $pdo->query("SELECT * FROM action_plan LIMIT 1");
  $row = $stmt->fetch(PDO::FETCH_ASSOC);

  json_response($row ?: [
    "id" => null,
    "file" => null
  ]);
}

function actionplan_update() {
  require "../core/auth_guard.php";
  global $pdo;

  if (!isset($_FILES["file"])) {
    json_response(["error" => "No file uploaded"], 400);
  }

  $ext = strtolower(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION));

  if ($ext !== "pdf") {
    json_response(["error" => "Only PDF allowed"], 400);
  }

  $dir = __DIR__ . "/../uploads/actionplan/";
  if (!is_dir($dir)) mkdir($dir, 0777, true);

  // get old
  $stmt = $pdo->query("SELECT * FROM action_plan LIMIT 1");
  $old = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($old && $old["file"] && file_exists($dir.$old["file"])) {
    unlink($dir.$old["file"]);
  }

  $fileName = uniqid().".pdf";

  move_uploaded_file(
    $_FILES["file"]["tmp_name"],
    $dir.$fileName
  );

  if ($old) {
    $stmt = $pdo->prepare("UPDATE action_plan SET file=?, updated_at=NOW() WHERE id=?");
    $stmt->execute([$fileName, $old["id"]]);
  } else {
    $stmt = $pdo->prepare("INSERT INTO action_plan (file) VALUES (?)");
    $stmt->execute([$fileName]);
  }

  json_response(["success"=>true,"file"=>$fileName]);
}
