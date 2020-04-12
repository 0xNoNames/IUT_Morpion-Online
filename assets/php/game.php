<?php
session_start();
if (!isset($_SESSION['user'])) {
    header("location: /JS/AjaxLOG");
    exit;
}

$obj = new stdClass();
$obj->success = false;
$obj->bothconnected = false;
$obj->reset = false;
$obj->players = array();
$obj->debug = "";
$obj->player = 1;
$obj->board = array();
$obj->yourturn = 0;
$obj->victory = false;
$obj->forfait = false;

$board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
$username = $_SESSION['user'];
$id = "";
$cpt = 0;

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

        $sql = "SELECT in_game FROM LOGGED WHERE username  = '$username' LIMIT 1";
        $result = $db->query($sql);
        if (mysqli_num_rows($result) > 0) {
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
                $obj->player = 1;
                $sql = "SELECT id FROM LOGGED WHERE username = '" . $_SESSION['player1'] . "'";
                $result = $db->query($sql);
                if (mysqli_num_rows($result) == 0) {
                    $sql = "UPDATE GAME SET player1_in_room = 0 WHERE player1 = '" . $_SESSION['player1'] . "' AND player2 = '" . $_SESSION['user'] . "'";
                    $db->query($sql);
                }
                $sql = "SELECT id, player1, player2, turn, compteur, board, player1_in_room, status, best_of, score_player1, score_player2 FROM GAME WHERE player1 = '" . $_SESSION['player1'] . "' AND player2 = '" . $_SESSION['user'] . "'";
                $result = $db->query($sql);
                if (mysqli_num_rows($result) > 0) {
                    $row = $result->fetch_assoc();
                    $id = $row['id'];
                    $obj->message = "Connecté !</br></br>" . $_SESSION['player1'] . " arrive...";
                    if (isset($_POST['forfait'])) {
                        $sql = "UPDATE USERS SET score = score + 1 WHERE username = '" . $row['player1'] . "'";
                        $db->query($sql);
                        $sql = "UPDATE GAME SET status = 2 WHERE id = '$id'";
                        $db->query($sql);
                        $obj->forfait = true;
                        $_SESSION['forfaiteur'] = true;
                    } else {
                        $sql = "UPDATE GAME SET player2_in_room = 1 WHERE id = '$id'";
                        $db->query($sql);
                        if ($row['player1_in_room'] == 1) {
                            if ($row['status'] == 2) {
                                if (isset($_SESSION['forfaiteur'])) {
                                    if ($_SESSION['forfaiteur'] == true) {
                                        $obj->message = "Vous avez déclaré forfait !</br></br>Victoire pour " . $row['player1'] . " !";
                                    } else {
                                        $obj->message = $row['player2'] . " à déclaré forfait !</br></br>Vous avez gagné !";
                                    }
                                } else {
                                    $obj->message = $row['player2'] . " à déclaré forfait !</br></br>Vous avez gagné  !";
                                }
                                $obj->forfait = true;
                                mysqli_close($db);
                                header('Cache-Control: no-cache, must-revalidate');
                                header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                                header('Content-type: application/json');
                                echo json_encode($obj);
                                exit;
                            }
                            $obj->bothconnected = true;
                            $board = unserialize($row['board']);
                            if ($row['status'] == 0) {
                                $sql = "UPDATE GAME SET status = 1 WHERE id = '$id'";
                                if ($db->query($sql) === FALSE) $obj->message = $db->error;
                            }
                            $obj->players = array($_SESSION['player1'], $_SESSION['user'], $row['score_player1'], $row['score_player2']);
                            if ($row['turn'] == 2) {
                                $obj->message = "À vous de jouer !";
                                $obj->yourturn = 1;
                            } else {
                                $obj->message = "Au tour de " . $_SESSION['player1'] . " !</br>Veuillez patienter";
                                $obj->yourturn = 0;
                            }
                            if ($row['compteur'] == 9) {
                                $obj->reset = true;
                                $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0 WHERE id = '$id'";
                                $db->query($sql);
                            } else {
                                $obj->reset = false;
                            }
                            if (isset($_POST['click'])) {
                                if ($row['compteur'] != 9) {
                                    $obj->reset = false;
                                    $board[$_POST['click'][0]][$_POST['click'][1]] = "O";
                                    $obj->message = "Au tour de " . $_SESSION['player1'] . " !</br>Veuillez patienter";
                                    $sql = "UPDATE GAME SET board = '" . serialize($board) . "', turn = 1, compteur = compteur + 1 WHERE id = '$id'";
                                    if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                                    $obj->yourturn = 0;
                                }
                            }
                            for ($a = 0; $a < 3; ++$a) {
                                if ($board[0][$a] == "X" && $board[1][$a] == "X" && $board[2][$a] == "X") {
                                    $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                    $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player1 = score_player1 + 1 WHERE id = '$id'";
                                    if ($db->query($sql) === FALSE) $obj->debug = $db->error;

                                } else if ($board[0][$a] == "O" && $board[1][$a] == "O" && $board[2][$a] == "O") {
                                    $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                    $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player2 = score_player2 + 1 WHERE id = '$id'";
                                    if ($db->query($sql) === FALSE) $obj->debug = $db->error;

                                } else if ($board[$a][0] == "X" && $board[$a][1] == "X" && $board[$a][2] == "X") {
                                    $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                    $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player1 = score_player1 + 1 WHERE id = '$id'";
                                    if ($db->query($sql) === FALSE) $obj->debug = $db->error;

                                } else if ($board[$a][0] == "O" && $board[$a][1] == "O" && $board[$a][2] == "O") {
                                    $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                    $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player2 = score_player2 + 1 WHERE id = '$id'";
                                    if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                                }
                            }

                            if ($board[0][0] == "X" && $board[1][1] == "X" && $board[2][2] == "X") {
                                $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player1 = score_player1 + 1 WHERE id = '$id'";
                                if ($db->query($sql) === FALSE) $obj->debug = $db->error;

                            } else if ($board[0][0] == "O" && $board[1][1] == "O" && $board[2][2] == "O") {
                                $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player2 = score_player2 + 1 WHERE id = '$id'";
                                if ($db->query($sql) === FALSE) $obj->debug = $db->error;

                            } else if ($board[2][0] == "X" && $board[1][1] == "X" && $board[0][2] == "X") {
                                $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player1 = score_player1 + 1 WHERE id = '$id'";
                                if ($db->query($sql) === FALSE) $obj->debug = $db->error;

                            } else if ($board[2][0] == "O" && $board[1][1] == "O" && $board[0][2] == "O") {
                                $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player2 = score_player2 + 1 WHERE id = '$id'";
                                if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                            }

                            if ($row['score_player2'] == (intdiv($row['best_of'], 2) + 1) || $row['score_player1'] == (intdiv($row['best_of'], 2) + 1)) {
                                if ($row['score_player1'] > $row['score_player2']) {
                                    $obj->message = "Victoire pour " . $row['player1'] . " !";
                                    $obj->victory = true;
                                    $sql = "UPDATE USERS SET score = score + 1 WHERE username = '" . $row['player1'] . "'";
                                    if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                                } else {
                                    $obj->message = "Victoire pour " . $row['player2'] . " !";
                                    $obj->victory = true;
                                    $sql = "UPDATE USERS SET score = score + 1 WHERE username = '" . $row['player2'] . "'";
                                    if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                                }
                            }
                            if (isset($_POST['victory']) || isset($_POST['remove'])) {
                                $sql = "DELETE FROM GAME WHERE id = '$id'";
                                if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                                $sql = "UPDATE LOGGED SET in_game = 0 WHERE username = '$username'";
                                if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                            }
                            $obj->board = $board;
                        }
                    }
                } else {
                    unset($_SESSION['player1']);
                }
            } elseif (isset($_SESSION['player2'])) { //host = player1 = test
                $obj->player = 0;
                $sql = "SELECT id FROM LOGGED WHERE username = '" . $_SESSION['player2'] . "'";
                $result = $db->query($sql);
                if (mysqli_num_rows($result) == 0) {
                    $sql = "UPDATE GAME SET player2_in_room = 0 WHERE player2 = '" . $_SESSION['player2'] . "' AND player1 = '" . $_SESSION['user'] . "'";
                    $db->query($sql);
                }
                $sql = "SELECT id, turn, compteur, board, player1, player2, player2_in_room, status, best_of, score_player1, score_player2 FROM GAME WHERE player2 = '" . $_SESSION['player2'] . "' AND player1 = '" . $_SESSION['user'] . "'";
                $result = $db->query($sql);
                if (mysqli_num_rows($result) > 0) {
                    $row = $result->fetch_assoc();
                    $id = $row['id'];
                    $obj->message = "Connecté !</br></br>" . $_SESSION['player2'] . ' arrive...';
                    if (isset($_POST['forfait'])) {
                        $sql = "UPDATE USERS SET score = score + 1 WHERE username = '" . $row['player2'] . "'";
                        $db->query($sql);
                        $sql = "UPDATE GAME SET status = 2 WHERE id = '$id'";
                        if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                        $obj->forfait = true;
                        $_SESSION['forfaiteur'] = true;
                    } else {
                        if ($row['status'] == 2) { //celui qui reçoit le forfait
                            if (isset($_SESSION['forfaiteur'])) {
                                if ($_SESSION['forfaiteur'] == true) {
                                    $obj->message = "Vous avez déclaré forfait !</br></br>Victoire pour " . $row['player2'] . " !";
                                } else {
                                    $obj->message = $row['player2'] . " à déclaré forfait !</br></br>Vous avez gagné !";
                                }
                            } else {
                                $obj->message = $row['player2'] . " à déclaré forfait !</br></br>Vous avez gagné  !";
                            }
                            $obj->forfait = true;
                            mysqli_close($db);
                            header('Cache-Control: no-cache, must-revalidate');
                            header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
                            header('Content-type: application/json');
                            echo json_encode($obj);
                            exit;
                        }
                        $sql = "UPDATE GAME SET player1_in_room = 1 WHERE id = '$id'";
                        $db->query($sql);
                        if ($row['player2_in_room'] == 1) {
                            $obj->bothconnected = true;
                            $board = unserialize($row['board']);
                            if ($row['status'] == 0) {
                                $sql = "UPDATE GAME SET status = 1 WHERE id = '$id'";
                                if ($db->query($sql) === FALSE) $obj->message = $db->error;
                            }
                            $obj->players = array($_SESSION['user'], $_SESSION['player2'], $row['score_player1'], $row['score_player2']);
                            if ($row['turn'] == 1) {
                                $obj->message = "À vous de jouer !";
                                $obj->yourturn = 1;
                            } else {
                                $obj->message = "Au tour de " . $_SESSION['player2'] . " !</br>Veuillez patienter";
                                $obj->yourturn = 0;
                            }
                            if ($row['compteur'] == 9) {
                                $obj->reset = true;
                                $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                $obj->message = "Match nul !";
                                $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0 WHERE id = '$id'";
                                if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                            } else {
                                $obj->reset = false;
                            }
                            if (isset($_POST['click'])) {
                                if ($row['compteur'] != 9) {
                                    $obj->reset = false;
                                    $board[$_POST['click'][0]][$_POST['click'][1]] = "X";
                                    $obj->message = "Au tour de " . $_SESSION['player2'] . " !</br>Veuillez patienter";
                                    $sql = "UPDATE GAME SET board = '" . serialize($board) . "', turn = 2, compteur = compteur + 1 WHERE id = '$id'";
                                    if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                                    $obj->yourturn = 0;
                                }
                            }

                            for ($a = 0; $a < 3; ++$a) {
                                if ($board[0][$a] == "X" && $board[1][$a] == "X" && $board[2][$a] == "X") {
                                    $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                    $obj->message = "Victoire pour " . $row['player1'] . " !";
                                    $obj->victoire = $row['player1'];
                                    $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player1 = score_player1 + 1 WHERE id = '$id'";
                                    if ($db->query($sql) === FALSE) $obj->debug = $db->error;

                                } else if ($board[0][$a] == "O" && $board[1][$a] == "O" && $board[2][$a] == "O") {
                                    $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                    $obj->message = "Victoire pour " . $row['player2'] . " !";
                                    $obj->victoire = $row['player2'];
                                    $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player2 = score_player2 + 1 WHERE id = '$id'";
                                    if ($db->query($sql) === FALSE) $obj->debug = $db->error;

                                } else if ($board[$a][0] == "X" && $board[$a][1] == "X" && $board[$a][2] == "X") {
                                    $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                    $obj->message = "Victoire pour " . $row['player1'] . " !";
                                    $obj->victoire = $row['player1'];
                                    $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player1 = score_player1 + 1 WHERE id = '$id'";
                                    if ($db->query($sql) === FALSE) $obj->debug = $db->error;

                                } else if ($board[$a][0] == "O" && $board[$a][1] == "O" && $board[$a][2] == "O") {
                                    $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                    $obj->message = "Victoire pour " . $row['player2'] . " !";
                                    $obj->victoire = $row['player2'];
                                    $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player2 = score_player2 + 1 WHERE id = '$id'";
                                    if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                                }
                            }
                            if ($board[0][0] == "X" && $board[1][1] == "X" && $board[2][2] == "X") {
                                $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                $obj->message = "Victoire pour " . $row['player1'] . " !";
                                $obj->victoire = $row['player1'];
                                $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player1 = score_player1 + 1 WHERE id = '$id'";
                                if ($db->query($sql) === FALSE) $obj->debug = $db->error;

                            } else if ($board[0][0] == "O" && $board[1][1] == "O" && $board[2][2] == "O") {
                                $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                $obj->message = "Victoire pour " . $row['player2'] . " !";
                                $obj->victoire = $row['player2'];
                                $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player2 = score_player2 + 1 WHERE id = '$id'";
                                if ($db->query($sql) === FALSE) $obj->debug = $db->error;

                            } else if ($board[2][0] == "X" && $board[1][1] == "X" && $board[0][2] == "X") {
                                $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                $obj->message = "Victoire pour " . $row['player1'] . " !";
                                $obj->victoire = $row['player1'];
                                $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player1 = score_player1 + 1 WHERE id = '$id'";
                                if ($db->query($sql) === FALSE) $obj->debug = $db->error;

                            } else if ($board[2][0] == "O" && $board[1][1] == "O" && $board[0][2] == "O") {
                                $board = array(array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"), array("&nbsp", "&nbsp", "&nbsp"));
                                $obj->message = "Victoire pour " . $row['player2'] . " !";
                                $obj->victoire = $row['player2'];
                                $sql = "UPDATE GAME SET board = '" . serialize($board) . "', compteur = 0, score_player2 = score_player2 + 1 WHERE id = '$id'";
                                if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                            }

                            if ($row['score_player2'] == (intdiv($row['best_of'], 2) + 1) || $row['score_player1'] == (intdiv($row['best_of'], 2) + 1)) {
                                if ($row['score_player1'] > $row['score_player2']) {
                                    $obj->message = "Victoire pour " . $row['player1'] . " !";
                                    $obj->victory = true;
                                    $sql = "UPDATE USERS SET score = score + 1 WHERE username = '" . $row['player1'] . "'";
                                    if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                                } else {
                                    $obj->message = "Victoire pour " . $row['player2'] . " !";
                                    $obj->victory = true;
                                    $sql = "UPDATE USERS SET score = score + 1 WHERE username = '" . $row['player2'] . "'";
                                    if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                                }

                            }


                            if (isset($_POST['victory']) || isset($_POST['remove'])) {
                                $sql = "DELETE FROM GAME WHERE id = '$id'";
                                if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                                $sql = "UPDATE LOGGED SET in_game = 0 WHERE username = '$username'";
                                if ($db->query($sql) === FALSE) $obj->debug = $db->error;
                            }
                            $obj->board = $board;
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
