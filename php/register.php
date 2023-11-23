<?php
$username = $_POST['username'];
$password = $_POST['password'];

$userData = json_decode(file_get_contents('../js/users.json'), true);
foreach ($userData['users'] as $user) {
    if ($user['username'] === $username) {
        echo 'Username already exists';
        exit();
    }
}

$userData['users'][] = ['username' => $username, 'password' => $password];

file_put_contents('.//js/users.json', json_encode($userData));

echo 'Registration successful';
?>