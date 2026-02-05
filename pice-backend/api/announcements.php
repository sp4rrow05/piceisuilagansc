<?php
require "../core/auth_guard.php";

// =======================
// READ ALL
// =======================

function announcements_read() {
  global $pdo;

  header("Content-Type: application/json");

  $res = $pdo->query("SELECT * FROM announcements ORDER BY id DESC");
  $data = [];
  while ($row = $res->fetch(PDO::FETCH_ASSOC)) {
    $data[] = $row;
  }

  echo json_encode($data);
  exit;   // IMPORTANT – stop extra output
}

// =======================
// GET ONE
// =======================
function announcements_get() {
  global $pdo;

  $id = $_GET["id"] ?? 0;

  $stmt = $pdo->prepare("SELECT * FROM announcements WHERE id=?");
  $stmt->execute([$id]);
  $row = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($row) {
    json_response($row);
  } else {
    json_response(["error" => "Not found"], 404);
  }
}


// =======================
// CREATE
// =======================
function announcements_create() {
  require "../core/auth_guard.php";
  global $pdo;

  $title = $_POST["title"] ?? "";
  $content = $_POST["content"] ?? "";

  if (!$title || !$content) {
    json_response(["error" => "Missing fields"], 400);
  }

  $stmt = $pdo->prepare(
    "INSERT INTO announcements (title, content) VALUES (?, ?)"
  );
  $stmt->execute([$title, $content]);
  json_response(["success" => true]);
}


// =======================
// UPDATE
// =======================
function announcements_update() {
  require "../core/auth_guard.php";
  global $pdo;

  $id = $_POST["id"] ?? 0;
  $title = $_POST["title"] ?? "";
  $content = $_POST["content"] ?? "";

  if (!$id || !$title || !$content) {
    json_response(["error" => "Missing fields"], 400);
  }

  $stmt = $pdo->prepare(
    "UPDATE announcements SET title=?, content=? WHERE id=?"
  );
  $stmt->execute([$title, $content, $id]);
  json_response(["success" => true]);
}


// =======================
// DELETE
// =======================
function announcements_delete() {
  require "../core/auth_guard.php";
  global $pdo;

  $id = $_GET["id"] ?? 0;

  if (!$id) {
    json_response(["error" => "Missing ID"], 400);
  }

  $stmt = $pdo->prepare("DELETE FROM announcements WHERE id=?");
  $stmt->execute([$id]);

  json_response(["success" => true]);
}
