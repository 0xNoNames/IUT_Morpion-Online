<?php
session_start();

if (!isset($_SESSION['user'])) {
    header("location: /JS/AjaxLOG");
    exit;
}

$obj = new stdClass();
$obj->success = isset($_SESSION['user']);
$obj->username = $_SESSION['user'];
$obj->ingame = false;
$obj->logged = array("0");
$obj->pendings = array("");
$obj->scores = array("");

$username = $_SESSION['user'];
$loggedusers = array();
$scores = array();
$pendings = array();

define('DB_SERVER', 'mysql-arthurdev.alwaysdata.net');
define('DB_USERNAME', 'arthurdev');
define('DB_PASSWORD', 'Aze123*');
define('DB_DATABASE', 'arthurdev_tictactoe');


$db = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
if (!$db) {
    $obj->message = 'Problème de connection avec la base de donnée';
} else {

    //update du check
    $sql = "SELECT id FROM LOGGED WHERE username  = '$username' LIMIT 1";
    $result = $db->query($sql);
    if (mysqli_num_rows($result) > 0) {
        $row = $result->fetch_assoc();
        $id = $row['id'];
        $sql = "UPDATE LOGGED SET last_check = now() WHERE id = '$id'";
        if ($db->query($sql)) $obj->message = "Check actualisé !";
        else $obj->message = "Problèmes pour actualiser la session";
    } else {
        $sql = "INSERT INTO LOGGED (username, last_check, first_check) VALUES ('$username',now(),now())";
        if ($db->query($sql) === FALSE) $obj->message = $db->error;
    }

    //afficher les joueurs en ligne
    $sql = "SELECT username, in_game, UNIX_TIMESTAMP(first_check) as first_check FROM LOGGED WHERE username <> '$username' ORDER BY first_check DESC";
    $result = $db->query($sql);
    if (mysqli_num_rows($result) > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($loggedusers, array($row['username'], $row['in_game']));
        }
        $obj->logged = $loggedusers;
    }

    //afficher les demandes
    $sql = "SELECT id, player1, player2, best_of FROM GAME WHERE player2 = '$username' ORDER BY id ASC";
    $result = $db->query($sql);
    if (mysqli_num_rows($result) > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($pendings, array($row['player1'], $row['best_of'], $row['id']));
        }
        $obj->pendings = $pendings;
    }

    //afficher les scores dans le scoreboard
    $sql = "SELECT username, score FROM USERS ORDER BY score DESC LIMIT 10";
    $result = $db->query($sql);
    if (mysqli_num_rows($result) > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($scores, array($row['username'], $row['score']));
        }
        $obj->scores = $scores;
    }

    //suppresion des joueurs non connecté depuis 5 secondes
    $sql = "DELETE FROM LOGGED WHERE last_check < date_sub(now(), interval 5 SECOND)";
    if ($db->query($sql) === FALSE) $obj->message = $db->error;

    //Supprime les demandes où celui l'a envoyé n'est plus connecté et que la game est pas en cours
    $sql = "DELETE FROM GAME WHERE player1 NOT IN (SELECT username FROM LOGGED) AND status = 0";
    if ($db->query($sql) === FALSE) $obj->message = $db->error;

    //Reconnection à la derniere game
    $sql = "SELECT id, player1, player2 FROM GAME WHERE status = 1 AND (player2 = '$username' OR player1 = '$username')";
    $result = $db->query($sql);
    if (mysqli_num_rows($result) > 0) {
        $row = $result->fetch_assoc();
        if (! isset($_SESSION['player2']) && ! isset($_SESSION['player1'])) {
            if ($row['player1'] == $username) {
                $_SESSION['player2'] = $row['player2'];
            }
            else if ($row['player2'] == $username) {
                $_SESSION['player1'] = $row['player1'];
            }
        }
        $_SESSION['in_game'] = true;
        $obj->in_game = 1;
    } else {
        $_SESSION['in_game'] = false;
        $obj->in_game = 0;
    }

    mysqli_close($db);
}

header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

echo json_encode($obj);
