<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once "../core/bootstrap.php";

$module = $_GET["module"] ?? "";
$action = $_GET["action"] ?? "";
switch ($module) {

  case "auth":
    require "auth.php";

    if ($action === "login") auth_login();
    if ($action === "me") auth_me();
    if ($action === "logout") auth_logout();
    if ($action === "change_password") auth_change_password();
    if ($action === "logs") auth_logs();
    break;


  case "accomplishments":
    require "accomplishments.php";

    if ($action === "read") accomplishments_read();
    if ($action === "get") accomplishments_get();
    if ($action === "create") accomplishments_create();
    if ($action === "update") accomplishments_update();
    if ($action === "delete") accomplishments_delete();
    break;


  case "announcements":
    require "announcements.php";

    if ($action === "read") announcements_read();
    if ($action === "get") announcements_get();
    if ($action === "create") announcements_create();
    if ($action === "update") announcements_update();
    if ($action === "delete") announcements_delete();
    break;


  case "downloads":
    require "downloads.php";

    if ($action === "read") downloads_read();
    if ($action === "get") downloads_get();
    if ($action === "create") downloads_create();
    if ($action === "update") downloads_update();
    if ($action === "delete") downloads_delete();
    break;


  case "faqs":
    require "faqs.php";

    if ($action === "read") faqs_read();
    if ($action === "get") faqs_get();
    if ($action === "create") faqs_create();
    if ($action === "update") faqs_update();
    if ($action === "delete") faqs_delete();
    break;


  case "cbl":
    require "cbl.php";

    if ($action === "read") cbl_read();
    if ($action === "update") cbl_update();
    break;

  case "president":
    require "president.php";

    if ($action === "read") president_read();
    if ($action === "cover_update") president_cover_update();
    if ($action === "section_create") president_section_create();
    if ($action === "section_update") president_section_update();
    if ($action === "section_delete") president_section_delete();
    break;

  case "chairman":
    require "chairman.php";

    if ($action === "read") chairman_read();
    if ($action === "cover_update") chairman_cover_update();
    if ($action === "section_create") chairman_section_create();
    if ($action === "section_update") chairman_section_update();
    if ($action === "section_delete") chairman_section_delete();
    break;

  case "officers":
    require "officers.php";

    if ($action === "read") officers_read();
    if ($action === "create") officers_create();
    if ($action === "update") officers_update();
    if ($action === "delete") officers_delete();
    if ($action === "move") officers_move();
    break;

  case "actionplan":
    require "actionplan.php";

    if ($action === "read") actionplan_read();
    if ($action === "update") actionplan_update();
    break;


  case "financial":
    require "financial.php";
    if ($action === "read") financial_read();
    if ($action === "update") financial_update();
    break;

  case "ce":
    require "ce_library.php";

    if ($action === "folders") ce_folders_read();
    if ($action === "create_folder") ce_folder_create();

    if ($action === "files") ce_files_by_folder();
    if ($action === "upload") ce_file_upload();
    if ($action === "delete") ce_file_delete();
    if ($action === "delete_folder") ce_folder_delete();
    break;



  default:
    echo json_encode(["error" => "Invalid module or action"]);
}
