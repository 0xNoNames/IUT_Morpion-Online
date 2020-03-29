<?php
session_start();

if (!isset($_SESSION["user"])) {
    header("Refresh:0");
    exit;
}

$obj = new stdClass();
$obj->success = false;

define('DB_SERVER', 'mysql-arthurdev.alwaysdata.net');
define('DB_USERNAME', 'arthurdev');
define('DB_PASSWORD', 'Aze123*');
define('DB_DATABASE', 'arthurdev_tictactoe');
$username = $_SESSION['user'];
$loggedusers = array();

$db = mysqli_connect(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_DATABASE);

if (!$db) {
    $obj->message = 'Problème de connection avec la base de donnée';
} else {
    $sql = "SELECT id FROM LOGGED WHERE username  = '$username' LIMIT 1";
    $result = $db->query($sql);

    if (mysqli_num_rows($result) > 0) {
        $row = $result->fetch_assoc();
        $id = $row['id'];
        $sql = "UPDATE LOGGED SET LastCheck = now() WHERE id = '$id'";

        if ($db->query($sql)) {
            $obj->message = "Check actualisé !";
        }

    } else {
        $sql = "INSERT INTO LOGGED (username, LastCheck, FirstCheck) VALUES ('$username',now(),now())";
        if ($db->query($sql) === FALSE) {
            $obj->message = $db->error;
        }
    }
    $sql = "SELECT username, ingame, UNIX_TIMESTAMP(FirstCheck) as FirstCheck FROM LOGGED WHERE username <> '$username' ORDER BY FirstCheck DESC";
    $result = $db->query($sql);
    if (mysqli_num_rows($result) > 0) {
        while ($row = $result->fetch_assoc()) {
            $user = array($row['username'], $row['ingame']);
            array_push($loggedusers, $user);
        }
        $obj->success = true;
        $obj->logged = $loggedusers;
    } else {
        $obj->logged = array("0");
    }
    $sql = "DELETE FROM LOGGED WHERE LastCheck < date_sub(now(), interval 10 SECOND)";
    $db->query($sql);

    mysqli_close($db);
}


header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

echo json_encode($obj);
