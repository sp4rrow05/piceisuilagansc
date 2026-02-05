<?php
require "../core/auth_guard.php";

/* ========== FOLDERS ========== */

function ce_folders_read() {
  global $pdo;

  $parent = $_GET["parent_id"] ?? null;

  if ($parent === "" || $parent === null) {
    $stmt = $pdo->query("SELECT * FROM ce_folders WHERE parent_id IS NULL ORDER BY name");
  } else {
    $stmt = $pdo->prepare("SELECT * FROM ce_folders WHERE parent_id=? ORDER BY name");
    $stmt->execute([$parent]);
  }

  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function ce_folder_create() {
  global $pdo;

  $name = trim($_POST["name"] ?? "");
  $parent = $_POST["parent_id"] ?? null;

  if (!$name) {
    echo json_encode(["error" => "Folder name required"]);
    return;
  }

  $stmt = $pdo->prepare("INSERT INTO ce_folders (name, parent_id) VALUES (?, ?)");
  $stmt->execute([$name, $parent]);

  echo json_encode(["success" => true]);
}


/* ========== FILES ========== */

function ce_files_by_folder() {
  global $pdo;

  $folder = $_GET["folder_id"] ?? 0;

  $stmt = $pdo->prepare("
    SELECT * FROM ce_files 
    WHERE folder_id=? 
    ORDER BY created_at DESC
  ");
  $stmt->execute([$folder]);

  echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

function ce_file_upload() {
  global $pdo;

  $folder = $_POST["folder_id"] ?? null;
  $title  = trim($_POST["title"] ?? "");

  /* ===== VALIDATIONS ===== */
  if (!$folder) {
    echo json_encode(["error" => "No folder selected"]);
    return;
  }

  if (!$title) {
    echo json_encode(["error" => "File title required"]);
    return;
  }

  if (!isset($_FILES["file"])) {
    echo json_encode(["error" => "No file selected"]);
    return;
  }

  $allowed = [
    "pdf","doc","docx","xls","xlsx",
    "ppt","pptx","jpg","jpeg","png","zip"
  ];

  $original = $_FILES["file"]["name"];
  $ext = strtolower(pathinfo($original, PATHINFO_EXTENSION));

  if (!in_array($ext, $allowed)) {
    echo json_encode(["error" => "File type not allowed"]);
    return;
  }

  /* ===== RAW FILENAME BUT SAFE ===== */
  $safe = preg_replace("/[^a-zA-Z0-9._-]/", "_", $original);

  $target = "../uploads/ce_library/" . $safe;

  // avoid overwrite
  $i = 1;
  while (file_exists($target)) {
    $safe = $i . "_" . $safe;
    $target = "../uploads/ce_library/" . $safe;
    $i++;
  }

  move_uploaded_file($_FILES["file"]["tmp_name"], $target);

  $stmt = $pdo->prepare("
    INSERT INTO ce_files 
      (folder_id, title, filename, filetype)
    VALUES (?, ?, ?, ?)
  ");

  $stmt->execute([$folder, $title, $safe, $ext]);

  echo json_encode(["success" => true]);
}

function ce_file_delete() {
  global $pdo;

  $id = $_GET["id"] ?? 0;

  $stmt = $pdo->prepare("SELECT filename FROM ce_files WHERE id=?");
  $stmt->execute([$id]);
  $file = $stmt->fetch();

  if ($file) {
    @unlink("../uploads/ce_library/" . $file["filename"]);
  }

  $pdo->prepare("DELETE FROM ce_files WHERE id=?")->execute([$id]);

  echo json_encode(["success" => true]);
}
function ce_folder_delete() {
  global $pdo;

  $id = $_GET["id"];

  // delete files in folder
  $stmt = $pdo->prepare("SELECT filename FROM ce_files WHERE folder_id=?");
  $stmt->execute([$id]);

  foreach ($stmt->fetchAll() as $f) {
    @unlink("../uploads/ce_library/" . $f["filename"]);
  }

  $pdo->prepare("DELETE FROM ce_files WHERE folder_id=?")->execute([$id]);

  // delete subfolders recursively
  $subs = $pdo->prepare("SELECT id FROM ce_folders WHERE parent_id=?");
  $subs->execute([$id]);

  foreach ($subs->fetchAll() as $s) {
    $_GET["id"] = $s["id"];
    ce_folder_delete();
  }

  // delete folder
  $pdo->prepare("DELETE FROM ce_folders WHERE id=?")->execute([$id]);

  echo json_encode(["success" => true]);
}



function ce_breadcrumb() {
  global $pdo;

  $id = $_GET["id"] ?? null;

  $path = [];

  while ($id) {
    $stmt = $pdo->prepare("SELECT id, name, parent_id FROM ce_folders WHERE id=?");
    $stmt->execute([$id]);
    $f = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$f) break;

    array_unshift($path, $f);
    $id = $f["parent_id"];
  }

  echo json_encode($path);
}



