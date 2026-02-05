<?php
require "../core/auth_guard.php";

// ================= READ ALL =================
function schoolyear_read() {
  global $pdo;

  $stmt = $pdo->query("SELECT * FROM documents_schoolyear ORDER BY school_year DESC");

  json_response($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// ================= CREATE YEAR =================
function schoolyear_create() {
  global $pdo;

  $year = $_POST["school_year"] ?? "";

  if (!$year) {
    json_response(["error" => "Missing year"], 400);
  }

  $stmt = $pdo->prepare("INSERT INTO documents_schoolyear (school_year) VALUES (?)");
  $stmt->execute([$year]);

  json_response(["success" => true]);
}

// ================= UPLOAD ACTION PLAN =================
function schoolyear_upload_action() {
  global $pdo;

  $id = $_POST["id"] ?? 0;

  if (!isset($_FILES["file"])) {
    json_response(["error" => "No file"], 400);
  }

  $ext = strtolower(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION));

  if ($ext !== "docx") {
    json_response(["error" => "Only DOCX allowed"], 400);
  }

  $dir = "../uploads/action_plan/";
  if (!is_dir($dir)) mkdir($dir, 0777, true);

  $name = uniqid() . ".docx";

  move_uploaded_file($_FILES["file"]["tmp_name"], $dir . $name);

  $stmt = $pdo->prepare("UPDATE documents_schoolyear SET action_plan_file=? WHERE id=?");
  $stmt->execute([$name, $id]);

  json_response(["success" => true]);
}

// ================= UPLOAD FINANCIAL =================
function schoolyear_upload_financial() {
  global $pdo;

  $id = $_POST["id"] ?? 0;

  if (!isset($_FILES["file"])) {
    json_response(["error" => "No file"], 400);
  }

  $ext = strtolower(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION));

  if ($ext !== "pdf") {
    json_response(["error" => "Only PDF allowed"], 400);
  }

  $dir = "../uploads/financial/";
  if (!is_dir($dir)) mkdir($dir, 0777, true);

  $name = uniqid() . ".pdf";

  move_uploaded_file($_FILES["file"]["tmp_name"], $dir . $name);

  $stmt = $pdo->prepare("UPDATE documents_schoolyear SET financial_report_file=? WHERE id=?");
  $stmt->execute([$name, $id]);

  json_response(["success" => true]);
}
