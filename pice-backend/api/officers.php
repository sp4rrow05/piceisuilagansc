<?php
require "../core/auth_guard.php";

/* ===== READ ALL ===== */
function officers_read() {
  global $pdo;

  $stmt = $pdo->query("
    SELECT * FROM officers
    ORDER BY sort_order ASC
  ");

  json_response($stmt->fetchAll(PDO::FETCH_ASSOC));
}

/* ===== CREATE ===== */
function officers_create() {
  global $pdo;

  $name = $_POST["name"] ?? "";
  $position = $_POST["position"] ?? "";
  $group = $_POST["group_name"] ?? "";

  $photo = "";

  if (isset($_FILES["photo"])) {
    $ext = pathinfo($_FILES["photo"]["name"], PATHINFO_EXTENSION);
    $photo = uniqid() . "." . $ext;

    move_uploaded_file(
      $_FILES["photo"]["tmp_name"],
      "../uploads/officers/" . $photo
    );
  }

  // Get last order in this group
  $stmt = $pdo->prepare("
    SELECT MAX(sort_order) as m FROM officers WHERE group_name=?
  ");
  $stmt->execute([$group]);
  $max = $stmt->fetch(PDO::FETCH_ASSOC)["m"] ?? 0;

  $stmt = $pdo->prepare("
    INSERT INTO officers
      (name, position, group_name, photo, sort_order)
    VALUES (?, ?, ?, ?, ?)
  ");

  $stmt->execute([
    $name,
    $position,
    $group,
    $photo,
    $max + 1
  ]);

  json_response(["success" => true]);
}

/* ===== UPDATE ===== */
function officers_update() {
  global $pdo;

  $id = $_POST["id"];

  $stmt = $pdo->prepare("SELECT photo FROM officers WHERE id=?");
  $stmt->execute([$id]);
  $old = $stmt->fetch(PDO::FETCH_ASSOC);

  $photo = $old["photo"];

  if (isset($_FILES["photo"])) {
    if ($photo && file_exists("../uploads/officers/" . $photo)) {
      unlink("../uploads/officers/" . $photo);
    }

    $ext = pathinfo($_FILES["photo"]["name"], PATHINFO_EXTENSION);
    $photo = uniqid() . "." . $ext;

    move_uploaded_file(
      $_FILES["photo"]["tmp_name"],
      "../uploads/officers/" . $photo
    );
  }

  $stmt = $pdo->prepare("
    UPDATE officers SET
      name=?,
      position=?,
      group_name=?,
      photo=?
    WHERE id=?
  ");

  $stmt->execute([
    $_POST["name"],
    $_POST["position"],
    $_POST["group_name"],
    $photo,
    $id
  ]);

  json_response(["success" => true]);
}

/* ===== DELETE ===== */
function officers_delete() {
  global $pdo;

  $id = $_GET["id"];

  $stmt = $pdo->prepare("SELECT photo FROM officers WHERE id=?");
  $stmt->execute([$id]);
  $old = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($old["photo"]) {
    @unlink("../uploads/officers/" . $old["photo"]);
  }

  $pdo->prepare("DELETE FROM officers WHERE id=?")
      ->execute([$id]);

  json_response(["success" => true]);
}

/* ===== MOVE UP / DOWN ===== */
function officers_move() {
  global $pdo;

  $id  = $_GET["id"] ?? 0;
  $dir = $_GET["dir"] ?? "up";

  // Get current
  $stmt = $pdo->prepare("
    SELECT id, group_name, sort_order
    FROM officers WHERE id=?
  ");
  $stmt->execute([$id]);
  $cur = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$cur) {
    json_response(["error" => "Not found"], 404);
  }

  $group = $cur["group_name"];
  $order = $cur["sort_order"];

  if ($dir === "up") {
    $stmt = $pdo->prepare("
      SELECT * FROM officers
      WHERE group_name=? AND sort_order < ?
      ORDER BY sort_order DESC LIMIT 1
    ");
  } else {
    $stmt = $pdo->prepare("
      SELECT * FROM officers
      WHERE group_name=? AND sort_order > ?
      ORDER BY sort_order ASC LIMIT 1
    ");
  }

  $stmt->execute([$group, $order]);
  $swap = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$swap) {
    json_response(["success" => true]);
  }

  // Swap orders
  $pdo->prepare("
    UPDATE officers SET sort_order=? WHERE id=?
  ")->execute([$swap["sort_order"], $cur["id"]]);

  $pdo->prepare("
    UPDATE officers SET sort_order=? WHERE id=?
  ")->execute([$order, $swap["id"]]);

  json_response(["success" => true]);
}
