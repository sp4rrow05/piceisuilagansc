<?php
require_once "../core/bootstrap.php";

function log_attempt($username, $status) {
  global $pdo;

  $stmt = $pdo->prepare("
    INSERT INTO login_logs (username, ip_address, user_agent, status)
    VALUES (?, ?, ?, ?)
  ");

  $stmt->execute([
    $username,
    $_SERVER["REMOTE_ADDR"] ?? "unknown",
    $_SERVER["HTTP_USER_AGENT"] ?? "unknown",
    $status
  ]);
}

/* ================= LOGIN ================= */

function auth_login() {
  global $pdo;

  $username = $_POST["username"] ?? "";
  $password = $_POST["password"] ?? "";

  $stmt = $pdo->prepare("SELECT * FROM admins WHERE username=?");
  $stmt->execute([$username]);
  $admin = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$admin || !password_verify($password, $admin["password"])) {
    log_attempt($username, "failed");
    json_response(["success" => false]);
    return;
  }

  $_SESSION["admin"] = [
    "id" => $admin["id"],
    "username" => $admin["username"]
  ];

  log_attempt($username, "success");

  json_response(["success" => true]);
}

/* ================= SESSION CHECK ================= */

function auth_me() {
  json_response([
    "loggedIn" => isset($_SESSION["admin"]),
    "user" => $_SESSION["admin"] ?? null
  ]);
}

/* ================= LOGOUT ================= */

function auth_logout() {
  if (isset($_SESSION["admin"])) {
    log_attempt($_SESSION["admin"]["username"], "logout");
  }

  session_destroy();
  json_response(["success" => true]);
}

/* ================= CHANGE PASSWORD ================= */

function auth_change_password() {
  global $pdo;

  if (!isset($_SESSION["admin"])) {
    json_response(["error" => "Unauthorized"], 401);
  }

  $old = $_POST["oldPassword"] ?? "";
  $new = $_POST["newPassword"] ?? "";

  $stmt = $pdo->prepare("SELECT * FROM admins WHERE id=?");
  $stmt->execute([$_SESSION["admin"]["id"]]);
  $admin = $stmt->fetch(PDO::FETCH_ASSOC);

  // ❌ Wrong old password
  if (!password_verify($old, $admin["password"])) {
    log_attempt($admin["username"], "password_change_failed");
    json_response([
      "success" => false,
      "message" => "Old password incorrect"
    ]);
    return;
  }

  $hash = password_hash($new, PASSWORD_DEFAULT);

  $stmt = $pdo->prepare("UPDATE admins SET password=? WHERE id=?");
  $stmt->execute([$hash, $admin["id"]]);

  // ✅ LOG SUCCESSFUL PASSWORD CHANGE
  log_attempt($admin["username"], "password_change");

  json_response(["success" => true]);
}


/* ================= LOGS VIEW ================= */

function auth_logs() {
  global $pdo;

  $stmt = $pdo->query("
    SELECT * FROM login_logs
    ORDER BY created_at DESC
    LIMIT 50
  ");

  json_response($stmt->fetchAll(PDO::FETCH_ASSOC));
}
