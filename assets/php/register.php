<?php
session_start();

if (isset($_SESSION["user"]) || !isset($_POST["username"])) {
    header("location: /JS/AjaxLOG");
    exit;
}

$obj = new stdClass();
$obj->success = false;
$obj->message = 'Problème d\'inscription';

define('DB_SERVER', 'mysql-arthurdev.alwaysdata.net');
define('DB_USERNAME', 'arthurdev');
define('DB_PASSWORD', 'Aze123*');
define('DB_DATABASE', 'arthurdev_tictactoe');

$db = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);


if (!$db) {
    $obj->message = 'Problème de connection avec la base de donnée';
} else {
    $username = mysqli_real_escape_string($db, $_POST['username']);
    $email = mysqli_real_escape_string($db, $_POST['email']);

    $sql = "SELECT id, username, email FROM USERS WHERE username  = '" . $username . "' OR email = '" . $email . "'";
    $results = $db->query($sql);

    if ($results->num_rows > 0) {
        $row = $results->fetch_assoc();
        if ($row['email'] == $email) {
            $obj->message = 'Email déjà utilsé';
        } elseif ($row['username'] == $username) {
            $obj->message = 'Nom d\'utilisateur déjà pris';
        }
    } else {
        if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
            $obj->message = 'Email non valide';
        } elseif (preg_match('/[A-Za-z0-9]+/', $_POST['username']) == 0) {
            $obj->message = 'Nom d\'utilisateur non valide';
        } elseif ((strlen($_POST['password']) > 20 || strlen($_POST['password']) < 5)) {
            $obj->message = 'Mot de passe doit être compris entre 5 et 20 caractères';
        } else {
            $password = password_hash(mysqli_real_escape_string($db, $_POST['password']), PASSWORD_DEFAULT);
            $sql = 'INSERT INTO USERS (username, password, email) VALUES (\'' . $username . '\',\'' . $password . '\',\'' . $email . '\')';
            if ($db->query($sql) === TRUE) {
                $obj->message = 'Utilisateur crée !';
                session_regenerate_id();
                $obj->success = true;
                $_SESSION['user'] = $username;
            } else {
                $obj->message = $db->error;
            }
        }
    }
    mysqli_close($db);
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode($obj);