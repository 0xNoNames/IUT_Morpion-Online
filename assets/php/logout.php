<?php
session_start();

define('DB_SERVER', 'mysql-arthurdev.alwaysdata.net');
define('DB_USERNAME', 'arthurdev');
define('DB_PASSWORD', 'Aze123*');
define('DB_DATABASE', 'arthurdev_tictactoe');
$username = $_SESSION['user'];

$db = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
$sql = "DELETE FROM LOGGED WHERE username = '$username'";
$db->query($sql);


// Détruit toutes les variables de session
$_SESSION = array();

// Si vous voulez détruire complètement la session, effacez également
// le cookie de session.
// Note : cela détruira la session et pas seulement les données de session !
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finalement, on détruit la session.
session_destroy();

$obj = new stdClass();
$obj->success = true;

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

echo json_encode($obj);