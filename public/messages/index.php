<?php

function decode($str)
{
    $asArray = true;
    $depth = 512;
    $fdata = rawurldecode($str);

    return json_decode($fdata, $asArray, $depth, JSON_THROW_ON_ERROR);
}

function encode($obj)
{
    return json_encode($obj, JSON_UNESCAPED_UNICODE);
}

if (!session_id()) {
    session_start();
}

if (!isset($_SESSION["msg_nextId"])) {
    $messages = [];
    $nextId = 1;
} else {
    $messages = decode($_SESSION["messages"] ?? "[]");
    $nextId = intval($_SESSION["msg_nextId"]);
}

$isPOST = $_SERVER["REQUEST_METHOD"] == "POST";

if ($isPOST) {
    $input = file_get_contents("php://input");
    $requestData = decode($input);

    $requestData["id"] = $nextId;
    $nextId++;

    $messages[] = $requestData;
}

$_SESSION["messages"] = encode((array)$messages);
$_SESSION["msg_nextId"] = $nextId;

if ($isPOST) {
    header("HTTP/1.1 204 No Content", true, 204);
}

if (!$isPOST) {
    $from = intval($_GET["from"] ?? 0);
    if ($from === 0) {
        $res = (array)$messages;
    } else {
        $res = array_slice($messages, $from);
    }

    echo (encode((array)$res));
}
