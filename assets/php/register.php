<?php
session_start();

if (isset($_SESSION["user"]) || !isset($_POST["username"])) {
    header("location: /");
    exit;
}

$obj = new stdClass();
$obj->success = false;
$obj->message = 'Problème d\'inscription';

define('DB_SERVER', 'mysql-arthurdev.alwaysdata.net');
define('DB_USERNAME', 'arthurdev');
define('DB_PASSWORD', 'Aze123*');
define('DB_DATABASE', 'arthurdev_tictactoe');

if (!filter_var(html_entity_decode($_POST['mail']), FILTER_VALIDATE_EMAIL)) {
    $obj->message = 'Adresse mail non valide';
} elseif (preg_match('/[A-Za-z0-9]+/', html_entity_decode($_POST['username'])) == 0) {
    $obj->message = 'Nom d\'utilisateur non valide';
} elseif (strlen(html_entity_decode($_POST['username'])) > 25) {
    $obj->message = 'Le nom d\'utlisateur ne doit pas dépasser 25 caractères';
} elseif (strlen(html_entity_decode($_POST['mail'])) > 30) {
    $obj->message = 'L\'adresse mail ne doit pas dépasser 30 caractères';
} elseif ((strlen(html_entity_decode($_POST['password'])) > 20 || strlen(html_entity_decode($_POST['password'])) < 6)) {
    $obj->message = 'Le mot de passe doit être compris entre 6 et 20 caractères';
} elseif (html_entity_decode($_POST['password']) != html_entity_decode($_POST['passwordretry'])) {
    $obj->message = 'Les mots de passe ne correspondent pas';
} else {
    $db = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);

    if (!$db) {
        $obj->message = 'Problème de connection avec la base de donnée';
    } else {
        $username = mysqli_real_escape_string($db, $_POST['username']);
        $email = mysqli_real_escape_string($db, $_POST['mail']);

        $sql = "SELECT id, username, email FROM USERS WHERE username  = '" . $username . "' OR email = '" . $email . "'";
        $results = $db->query($sql);

        if (mysqli_num_rows($results) > 0) {
            $row = $results->fetch_assoc();
            if ($row['email'] == $email) {
                $obj->message = 'Email déjà utilsé';
            } elseif ($row['username'] == $username) {
                $obj->message = 'Nom d\'utilisateur déjà pris';
            }
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
        mysqli_close($db);
    }
}


header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode($obj);
