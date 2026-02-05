<?php
require "../core/auth_guard.php";

function accomplishments_read() {
  global $pdo;

  header("Content-Type: application/json");

  $res = $pdo->query("SELECT * FROM accomplishments ORDER BY id DESC");
  $data = [];
  while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
    $data[] = $row;
  }

  echo json_encode($data);
  exit;   // IMPORTANT – stop extra output
}

function accomplishments_get() {
  global $pdo;

  $id = $_GET["id"] ?? 0;

  $stmt = $pdo->prepare("SELECT * FROM accomplishments WHERE id=?");
  $stmt->execute([$id]);

  $row = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($row) {
    json_response($row);
  } else {
    json_response(["error" => "Not found"], 404);
  }
}

function accomplishments_create() {
  global $pdo;

  $title = $_POST["title"] ?? "";
  $description = $_POST["description"] ?? "";
  $date = $_POST["date"] ?? "";
  $category = $_POST["category"] ?? "";

  if (!$title || !$description || !$date || !$category) {
    json_response(["error" => "Missing fields"], 400);
  }

  $imageName = "";

  if (isset($_FILES["image"])) {
    $ext = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
    $imageName = uniqid() . "." . $ext;

    move_uploaded_file(
      $_FILES["image"]["tmp_name"],
      "../uploads/accomplishments/" . $imageName
    );
  }

  $stmt = $pdo->prepare("
    INSERT INTO accomplishments
    (title, description, date, category, image)
    VALUES (?, ?, ?, ?, ?)
  ");

  $stmt->execute([$title, $description, $date, $category, $imageName]);

  json_response(["success" => true]);
}

function accomplishments_update() {
  global $pdo;

  $id = $_POST["id"] ?? 0;
  $title = $_POST["title"] ?? "";
  $description = $_POST["description"] ?? "";
  $date = $_POST["date"] ?? "";
  $category = $_POST["category"] ?? "";

  if (!$id || !$title || !$description || !$date || !$category) {
    json_response(["error" => "Missing fields"], 400);
  }

  $stmt = $pdo->prepare("SELECT image FROM accomplishments WHERE id=?");
  $stmt->execute([$id]);
  $old = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$old) {
    json_response(["error" => "Record not found"], 404);
  }

  $imageName = $old["image"];

  if (isset($_FILES["image"])) {
    if ($imageName && file_exists("../uploads/accomplishments/" . $imageName)) {
      unlink("../uploads/accomplishments/" . $imageName);
    }

    $ext = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
    $imageName = uniqid() . "." . $ext;

    move_uploaded_file(
      $_FILES["image"]["tmp_name"],
      "../uploads/accomplishments/" . $imageName
    );
  }

  $stmt = $pdo->prepare("
    UPDATE accomplishments
    SET title=?, description=?, date=?, category=?, image=?
    WHERE id=?
  ");

  $stmt->execute([
    $title,
    $description,
    $date,
    $category,
    $imageName,
    $id
  ]);

  json_response(["success" => true]);
}

function accomplishments_delete() {
  global $pdo;

  $id = $_GET["id"] ?? 0;

  if (!$id) {
    json_response(["error" => "Missing ID"], 400);
  }

  $stmt = $pdo->prepare("SELECT image FROM accomplishments WHERE id=?");
  $stmt->execute([$id]);
  $old = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($old && $old["image"] && file_exists("../uploads/accomplishments/" . $old["image"])) {
    unlink("../uploads/accomplishments/" . $old["image"]);
  }

  $stmt = $pdo->prepare("DELETE FROM accomplishments WHERE id=?");
  $stmt->execute([$id]);

  json_response(["success" => true]);
}
