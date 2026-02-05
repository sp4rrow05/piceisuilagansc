<?php
require "../core/auth_guard.php";

// =======================
// READ CURRENT CBL
// =======================
function cbl_read() {
  global $pdo;

  try {
    $stmt = $pdo->query("SELECT * FROM cbl_documents LIMIT 1");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    json_response($row ?: [
      "id" => null,
      "file" => null
    ]);

  } catch (Exception $e) {
    json_response([
      "error" => "DB read failed",
      "message" => $e->getMessage()
    ], 500);
  }
}


// =======================
// UPLOAD / UPDATE
// =======================
function cbl_update() {
  require "../core/auth_guard.php";
  global $pdo;

  // ===== DEBUG 1: Did PHP even receive file? =====
  if (empty($_FILES)) {
    json_response([
      "error" => "FILES is empty",
      "post" => $_POST,
      "files" => $_FILES,
      "content_type" => $_SERVER["CONTENT_TYPE"] ?? "none"
    ], 400);
  }

  if (!isset($_FILES["file"])) {
    json_response([
      "error" => "No 'file' key in FILES",
      "available_keys" => array_keys($_FILES)
    ], 400);
  }

  $file = $_FILES["file"];

  // ===== DEBUG 2: Upload error code =====
  if ($file["error"] !== UPLOAD_ERR_OK) {
    json_response([
      "error" => "PHP upload error",
      "code" => $file["error"],
      "meaning" => upload_error_message($file["error"])
    ], 400);
  }

  $ext = strtolower(pathinfo($file["name"], PATHINFO_EXTENSION));

  if ($ext !== "pdf") {
    json_response([
      "error" => "Only PDF allowed",
      "received_ext" => $ext
    ], 400);
  }

  // ===== DEBUG 3: Folder check =====
  $dir = __DIR__ . "/../uploads/cbl/";

  if (!is_dir($dir)) {
    $created = mkdir($dir, 0777, true);
    if (!$created) {
      json_response([
        "error" => "Cannot create folder",
        "path" => $dir
      ], 500);
    }
  }

  if (!is_writable($dir)) {
    json_response([
      "error" => "Folder not writable",
      "path" => $dir
    ], 500);
  }

  // ===== DEBUG 4: Move file =====
  $fileName = uniqid() . ".pdf";
  $target = $dir . $fileName;

  $moved = move_uploaded_file($file["tmp_name"], $target);

  if (!$moved) {
    json_response([
      "error" => "move_uploaded_file failed",
      "tmp" => $file["tmp_name"],
      "target" => $target,
      "exists_tmp" => file_exists($file["tmp_name"]) ? "YES" : "NO"
    ], 500);
  }

  // ===== SAVE TO DB =====
  $stmt = $pdo->query("SELECT * FROM cbl_documents LIMIT 1");
  $old = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($old) {
    $stmt = $pdo->prepare("UPDATE cbl_documents SET file=?, updated_at=NOW() WHERE id=?");
    $stmt->execute([$fileName, $old["id"]]);
  } else {
    $stmt = $pdo->prepare("INSERT INTO cbl_documents (file) VALUES (?)");
    $stmt->execute([$fileName]);
  }

  json_response([
    "success" => true,
    "file" => $fileName
  ]);
}
function upload_error_message($code) {
  $errors = [
    UPLOAD_ERR_INI_SIZE   => "File exceeds upload_max_filesize",
    UPLOAD_ERR_FORM_SIZE  => "File exceeds form MAX_FILE_SIZE",
    UPLOAD_ERR_PARTIAL    => "File only partially uploaded",
    UPLOAD_ERR_NO_FILE    => "No file uploaded",
    UPLOAD_ERR_NO_TMP_DIR => "Missing temp folder",
    UPLOAD_ERR_CANT_WRITE => "Failed to write to disk",
    UPLOAD_ERR_EXTENSION  => "Upload blocked by extension"
  ];

  return $errors[$code] ?? "Unknown error";
}

