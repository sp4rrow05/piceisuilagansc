<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


if (!isset($_SESSION["admin"])) {
  echo json_encode(["error" => "Unauthorized"]);
  exit;
}
