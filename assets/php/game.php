<?php
session_start();


if (!isset($_SESSION['user'])) {
    header("location: /JS/AjaxLOG");
    exit;
}


$obj = new stdClass();
$obj->success = false;
$obj->bothconnected = false;
$obj->players = array();
$obj->debug = "";
$obj->turn = 1;

$username = $_SESSION['user'];
$id = "";

//Player1 = celui qui host (test)
//Player2 = celui qui rejoint (user1)

define('DB_SERVER', 'mysql-arthurdev.alwaysdata.net');
define('DB_USERNAME', 'arthurdev');
define('DB_PASSWORD', 'Aze123*');
define('DB_DATABASE', 'arthurdev_tictactoe');

$db = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);

if (!$db) {
    $obj->message = 'Problème de connection avec la base de donnée';
} else {
    if (isset($_POST['host'])) {
        #celui qui rejoint la game
        $_SESSION['player1'] = $_POST['host'];
        $obj->success = true;
    } else {
        if (isset($_SESSION['player2'])) {
            $sql = "SELECT id FROM GAME WHERE player1 = '" . $_SESSION['player2'] . "'";
            if ($result = $db->query($sql))
            if (mysqli_num_rows($result) > 0) {
                $obj->message = "Adversaire déjà en jeu</br>retour au menu principal";
                $_SESSION['in_game'] = false;
                $sql = "UPDATE LOGGED SET in_game = 0 WHERE username = '$username'";
                if ($db->query($sql) === FALSE) $obj->message = $db->error;
                $sql = "DELETE FROM GAME WHERE player1 = '$username'";
                if ($db->query($sql) === FALSE) $obj->message = $db->error;
                unset($_SESSION['player2']);
                $obj->success = false;
            } else {
                $_SESSION['in_game'] = true;
                $sql = "UPDATE LOGGED SET in_game = 1 WHERE username = '$username'";
                if ($db->query($sql) === FALSE) $obj->message = $db->error;
                $obj->success = true;
            }
        } else if (isset($_SESSION['player1'])) {
            $_SESSION['in_game'] = true;
            $sql = "UPDATE LOGGED SET in_game = 1 WHERE username = '$username'";
            if ($db->query($sql) === FALSE) $obj->message = $db->error;
            $obj->success = true;
        } else {
            $obj->message = "Pas d'adversaire ni de partie en cours</br>retour au menu principal";
            $_SESSION['in_game'] = false;
            $sql = "UPDATE LOGGED SET in_game = 0 WHERE username = '$username'";
            if ($db->query($sql) === FALSE) $obj->message = $db->error;
            $obj->success = false;
        }

        if ($_SESSION['in_game']) {
            $sql = "SELECT id FROM LOGGED WHERE username  = '$username' LIMIT 1";
            $result = $db->query($sql);

            if (mysqli_num_rows($result) > 0) { // update du check dans la table LOGGED
                $row = $result->fetch_assoc();
                $id = $row['id'];
                $sql = "UPDATE LOGGED SET last_check = now() WHERE id = '$id'";
                if ($db->query($sql) === FALSE) $obj->message = $db->error;
            } else {
                $sql = "INSERT INTO LOGGED (username, last_check, first_check) VALUES ('$username',now(),now())";
                if ($db->query($sql) === FALSE) $obj->message = $db->error;
            }

            $sql = "DELETE FROM LOGGED WHERE last_check < date_sub(now(), interval 5 SECOND)";
            if ($db->query($sql) === FALSE) $obj->message = $db->error;

            // $sql = "DELETE FROM GAME WHERE player1 NOT IN (SELECT username FROM LOGGED) AND status = 0";
            // if ($db->query($sql) === FALSE) $obj->message = $db->error;

            if (isset($_SESSION['player1'])) {  //receiver = player2 = user1
                $sql = "SELECT id, turn, player1_in_room, status, best_of, score_player1, score_player2 FROM GAME WHERE player1 = '" . $_SESSION['player1'] . "' AND player2 = '" . $_SESSION['user'] . "'";
                $result = $db->query($sql);
                if (mysqli_num_rows($result) > 0) {
                    $row = $result->fetch_assoc();
                    $id = $row['id'];
                    $obj->message = "Connecté !</br></br>" . $_SESSION['player1'] . " arrive...";
                    $sql = "UPDATE GAME SET player2_in_room = 1 WHERE id = '$id'";
                    $db->query($sql);
                    if ($row['player1_in_room'] == 1) {
                        $obj->bothconnected = true;
                        if ($row['status'] == 0) {
                            $sql = "UPDATE GAME SET status = 1 WHERE id = '$id'";
                            if ($db->query($sql) === FALSE) $obj->message = $db->error;
                        }
                        $obj->players = array($_SESSION['user'],$_SESSION['player1'],$row['score_player2'], $row['score_player1']);
                        if ($row['turn'] == 2) {
                            $obj->message = "À vous de jouer !";
                            $obj->turn = 1;
                        }
                        else {
                            $obj->message = "Au tour de " . $_SESSION['player1'] . " !</br>Veuillez patienter";
                            $obj->turn = 0;
                        }
                    }
                } else {
                    unset($_SESSION['player1']);
                }


            } elseif (isset($_SESSION['player2'])) { //host = player1 = test
                $sql = "SELECT id, turn, player2_in_room, status, best_of, score_player1, score_player2 FROM GAME WHERE player2 = '" . $_SESSION['player2'] . "' AND player1 = '" . $_SESSION['user'] . "'";
                $result = $db->query($sql);
                if (mysqli_num_rows($result) > 0) {
                    $row = $result->fetch_assoc();
                    $id = $row['id'];
                    $obj->message = "Connecté !</br></br>" . $_SESSION['player2'] . ' arrive...';
                    $sql = "UPDATE GAME SET player1_in_room = 1 WHERE id = '$id'";
                    $db->query($sql);
                    if ($row['player2_in_room'] == 1) {
                        $obj->bothconnected = true;
                        if ($row['status'] == 0) {
                            $sql = "UPDATE GAME SET status = 1 WHERE id = '$id'";
                            if ($db->query($sql) === FALSE) $obj->message = $db->error;
                        }
                        $obj->players = array($_SESSION['user'],$_SESSION['player2'],$row['score_player1'], $row['score_player2']);
                        if ($row['turn'] == 1) {
                            $obj->message = "À vous de jouer !";
                            $obj->turn = 1;
                        }
                        else {
                            $obj->message = "Au tour de " . $_SESSION['player2'] . " !</br>Veuillez patienter";
                            $obj->turn = 0;
                        }
                    }
                } else {
                    unset($_SESSION['player2']);
                }
            }

        } else {
            $obj->success = false;
        }
    }
}
mysqli_close($db);


header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

echo json_encode($obj);
