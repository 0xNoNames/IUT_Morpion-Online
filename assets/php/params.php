<?php
session_start();

if (isset($_SESSION["user"]) || !isset($_POST["bestof"])) {
    header("location: /JS/AjaxLOG");
    exit;
}

$obj = new stdClass();
$obj->success = false;
$obj->message = 'Fatal error';


$_SESSION['bestof'] = $_POST['bestof'];

print $_SESSION['bestof'];

/*define('DB_SERVER', 'mysql-arthurdev.alwaysdata.net');
define('DB_USERNAME', 'arthurdev');
define('DB_PASSWORD', 'Aze123*');
define('DB_DATABASE', 'arthurdev_tictactoe');

$db = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);

if (!$db) {
    $obj->message = 'Problème de connection avec la base de donnée';
} else {
    $username = mysqli_real_escape_string($db, $_POST['username']);
    $password = mysqli_real_escape_string($db, $_POST['password']);
    $sql = "SELECT id FROM LOGGED WHERE username  = '$username' LIMIT 1";
    $result = $db->query($sql);

    if (mysqli_num_rows($result) > 0) {
        $obj->message = "Utilisateur déjà connecté !";
    } else {
        session_regenerate_id();
        $obj->success = true;
        $_SESSION['user'] = $username;
    }

    mysqli_close($db);
}*/

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode($obj);