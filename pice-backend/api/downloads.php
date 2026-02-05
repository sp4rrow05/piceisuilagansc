<?php

$action = $_GET["action"] ?? "";

// Protect only write actions
if (in_array($action, ["create", "update", "delete"])) {
  require_once __DIR__ . "/../core/auth_guard.php";
}

require_once "../core/response.php";

/* ========== READ ========== */
function downloads_read() {
  global $pdo;

  $stmt = $pdo->query("SELECT * FROM downloads ORDER BY id DESC");

  echo json_encode(
    $stmt->fetchAll(PDO::FETCH_ASSOC)
  );
}

/* ========== GET ONE ========== */
function downloads_get() {
  global $pdo;

  $id = $_GET["id"] ?? 0;

  $stmt = $pdo->prepare("SELECT * FROM downloads WHERE id=?");
  $stmt->execute([$id]);

  if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    json_response($row);
  } else {
    json_response(["error" => "Not found"], 404);
  }
}

/* ========== CREATE ========== */
function downloads_create() {
  global $pdo;

  $title = $_POST["title"] ?? "";
  $description = $_POST["description"] ?? "";
  $category = $_POST["category"] ?? "others";

  if (!$title || !isset($_FILES["file"])) {
    json_response(["error" => "Missing fields"], 400);
  }

  $file = $_FILES["file"];

  $ext = pathinfo($file["name"], PATHINFO_EXTENSION);
  $fileName = uniqid() . "." . $ext;

  move_uploaded_file(
    $file["tmp_name"],
    "../uploads/downloads/" . $fileName
  );

  $stmt = $pdo->prepare(
    "INSERT INTO downloads (title, description, category, file)
     VALUES (?, ?, ?, ?)"
  );

  $stmt->execute([$title, $description, $category, $fileName]);

  json_response(["success" => true]);
}

/* ========== UPDATE ========== */
function downloads_update() {
  global $pdo;

  $id = $_POST["id"] ?? 0;
  $title = $_POST["title"] ?? "";
  $description = $_POST["description"] ?? "";
  $category = $_POST["category"] ?? "others";

  if (!$id || !$title) {
    json_response(["error" => "Missing fields"], 400);
  }

  $stmt = $pdo->prepare("SELECT file FROM downloads WHERE id=?");
  $stmt->execute([$id]);
  $old = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$old) {
    json_response(["error" => "Not found"], 404);
  }

  $fileName = $old["file"];

  if (isset($_FILES["file"])) {
    if ($fileName && file_exists("../uploads/downloads/" . $fileName)) {
      unlink("../uploads/downloads/" . $fileName);
    }

    $ext = pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION);
    $fileName = uniqid() . "." . $ext;

    move_uploaded_file(
      $_FILES["file"]["tmp_name"],
      "../uploads/downloads/" . $fileName
    );
  }

  $stmt = $pdo->prepare(
    "UPDATE downloads 
     SET title=?, description=?, category=?, file=? 
     WHERE id=?"
  );

  $stmt->execute([$title, $description, $category, $fileName, $id]);

  json_response(["success" => true]);
}

/* ========== DELETE ========== */
function downloads_delete() {
  global $pdo;

  $id = $_GET["id"] ?? 0;

  $stmt = $pdo->prepare("SELECT file FROM downloads WHERE id=?");
  $stmt->execute([$id]);
  $old = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($old && $old["file"] && file_exists("../uploads/downloads/" . $old["file"])) {
    unlink("../uploads/downloads/" . $old["file"]);
  }

  $stmt = $pdo->prepare("DELETE FROM downloads WHERE id=?");
  $stmt->execute([$id]);

  json_response(["success" => true]);
}
