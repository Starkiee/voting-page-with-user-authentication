<?php
$username = $_POST['username'];
$password = $_POST['password'];

$userData = json_decode(file_get_contents('../js/users.json'), true);

foreach ($userData['users'] as $user) {
    if ($user['username'] === $username && $user['password'] === $password) {
        echo 'Login successful';
        exit();
    }
}

echo 'Login failed';
?>