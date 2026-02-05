<?php


$action = $_GET["action"] ?? "";

// Protect only write actions
if (in_array($action, ["create", "update", "delete"])) {

  require_once __DIR__ . "/../core/auth_guard.php";

}

/* =======================
   READ ALL FAQS
======================= */
function faqs_read() {
  global $pdo;

  try {
    $stmt = $pdo->query("SELECT * FROM faqs ORDER BY id DESC");

    echo json_encode(
      $stmt->fetchAll(PDO::FETCH_ASSOC)
    );

  } catch (Exception $e) {
    json_response([
      "error" => "Failed to load FAQs",
      "debug" => $e->getMessage()
    ], 500);
  }
}

/* =======================
   GET SINGLE FAQ
======================= */
function faqs_get() {
  global $pdo;

  $id = $_GET["id"] ?? 0;

  try {
    $stmt = $pdo->prepare("SELECT * FROM faqs WHERE id = ?");
    $stmt->execute([$id]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
      json_response($row);
    } else {
      json_response(["error" => "Not found"], 404);
    }

  } catch (Exception $e) {
    json_response([
      "error" => "Failed to load FAQ",
      "debug" => $e->getMessage()
    ], 500);
  }
}

/* =======================
   CREATE FAQ
======================= */
function faqs_create() {
  global $pdo;

  $question = trim($_POST["question"] ?? "");
  $answer   = trim($_POST["answer"] ?? "");

  if (!$question || !$answer) {
    json_response(["error" => "Missing fields"], 400);
  }

  try {
    $stmt = $pdo->prepare(
      "INSERT INTO faqs (question, answer) VALUES (?, ?)"
    );

    $stmt->execute([$question, $answer]);

    json_response(["success" => true]);

  } catch (Exception $e) {
    json_response([
      "error" => "Failed to create FAQ",
      "debug" => $e->getMessage()
    ], 500);
  }
}

/* =======================
   UPDATE FAQ
======================= */
function faqs_update() {
  global $pdo;

  $id       = $_POST["id"] ?? 0;
  $question = trim($_POST["question"] ?? "");
  $answer   = trim($_POST["answer"] ?? "");

  if (!$id || !$question || !$answer) {
    json_response(["error" => "Missing fields"], 400);
  }

  try {
    $stmt = $pdo->prepare(
      "UPDATE faqs SET question = ?, answer = ? WHERE id = ?"
    );

    $stmt->execute([$question, $answer, $id]);

    json_response(["success" => true]);

  } catch (Exception $e) {
    json_response([
      "error" => "Failed to update FAQ",
      "debug" => $e->getMessage()
    ], 500);
  }
}

/* =======================
   DELETE FAQ
======================= */
function faqs_delete() {
  global $pdo;

  $id = $_GET["id"] ?? 0;

  if (!$id) {
    json_response(["error" => "Missing ID"], 400);
  }

  try {
    $stmt = $pdo->prepare("DELETE FROM faqs WHERE id = ?");
    $stmt->execute([$id]);

    json_response(["success" => true]);

  } catch (Exception $e) {
    json_response([
      "error" => "Failed to delete FAQ",
      "debug" => $e->getMessage()
    ], 500);
  }
}
