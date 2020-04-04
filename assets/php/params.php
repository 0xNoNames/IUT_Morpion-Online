<?php
session_start();

if (!isset($_SESSION["user"]) || !isset($_POST["bestof"])) {
    header("location: /JS/AjaxLOG");
    exit;
}

$obj = new stdClass();
$obj->success = false;
$obj->message = "Impossible d'envoyer la demande";


if (preg_match('/[1-3-5]+/', $_POST['bestof']) == 0) {
    $obj->message = "Mauvaise valeur de best of";
} else {
    $bo = html_entity_decode($_POST['bestof']);
    $player1 = html_entity_decode($_SESSION['user']);
    $player2 = html_entity_decode($_POST['player2']);
    
    define('DB_SERVER', 'mysql-arthurdev.alwaysdata.net');
    define('DB_USERNAME', 'arthurdev');
    define('DB_PASSWORD', 'Aze123*');
    define('DB_DATABASE', 'arthurdev_tictactoe');

    $db = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);

    if (!$db) {
        $obj->message = 'Problème de connection avec la base de donnée';
    } else {
        $sql = "SELECT in_game FROM LOGGED WHERE username  = '$player2'";
        $result = $db->query($sql);

        if ($row = mysqli_num_rows($result) > 0) {
            if ($row['in_game'] != 0) {
                $obj->message = "Adversaire déjà en partie";
            } else {
                $sql = "SELECT id FROM GAME WHERE player1  = '$player1' and player2 = '$player2'";
                $result = $db->query($sql);
                if ($row = mysqli_num_rows($result) > 0) {
                    $obj->message = "Demande déjà envoyé !";
                } else {
                    $sql = 'INSERT INTO GAME (best_of, player1, status, player2) VALUES (\'' . $bo . '\',\'' . $player1 . '\',\'0\',\'' . $player2 . '\')';
                    if ($db->query($sql) === TRUE) {
                        $_SESSION['player2'] = $player2;
                        $obj->message = "Demande de partie envoyé";
                        $obj->success = true;
                    } else {
                        $obj->message = $db->error;
                    }
                }
            }
        } else {
            $obj->message = "Adversaire hors-ligne";
        }
        mysqli_close($db);
    }
}


header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');
echo json_encode($obj);
