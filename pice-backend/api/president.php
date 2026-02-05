<?php
require "../core/auth_guard.php";

/* ================= READ PUBLIC ================= */
function president_read() {
  global $pdo;

  $page = $pdo->query("SELECT * FROM president_page LIMIT 1")
              ->fetch(PDO::FETCH_ASSOC);

  $sections = $pdo->query("
    SELECT * FROM president_sections
    ORDER BY sort_order ASC
  ")->fetchAll(PDO::FETCH_ASSOC);

  echo json_encode([
    "page" => $page,
    "sections" => $sections
  ]);
}

/* ================= UPDATE COVER ================= */
function president_cover_update() {
  global $pdo;

  if (!isset($_FILES["image"])) {
    json_response(["error" => "No image uploaded"], 400);
  }

  $dir = __DIR__ . "/../uploads/president/";
  if (!is_dir($dir)) mkdir($dir, 0777, true);

  $ext = pathinfo($_FILES["image"]["name"], PATHINFO_EXTENSION);
  $file = uniqid() . "." . $ext;

  move_uploaded_file($_FILES["image"]["tmp_name"], $dir . $file);

  $stmt = $pdo->prepare("UPDATE president_page SET cover_image=? WHERE id=1");
  $stmt->execute([$file]);

  json_response(["success" => true]);
}

/* ================= SECTIONS ================= */

function president_section_create() {
  global $pdo;

  $sub = $_POST["subheader"];
  $content = $_POST["content"];

  $stmt = $pdo->prepare("
    INSERT INTO president_sections (subheader, content)
    VALUES (?, ?)
  ");

  $stmt->execute([$sub, $content]);

  json_response(["success" => true]);
}

function president_section_update() {
  global $pdo;

  $id = $_POST["id"];
  $sub = $_POST["subheader"];
  $content = $_POST["content"];

  $stmt = $pdo->prepare("
    UPDATE president_sections
    SET subheader=?, content=?
    WHERE id=?
  ");

  $stmt->execute([$sub, $content, $id]);

  json_response(["success" => true]);
}

function president_section_delete() {
  global $pdo;

  $id = $_GET["id"];

  $stmt = $pdo->prepare("DELETE FROM president_sections WHERE id=?");
  $stmt->execute([$id]);

  json_response(["success" => true]);
}
