<?php
$host = '127.0.0.1';
$user = 'root';
$pass = '';
$db   = 'suwish';

echo "Testing connection to $host...\n";

try {
    $dsn = "mysql:host=$host;port=3306;dbname=$db";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT           => 5,
    ];
    $pdo = new PDO($dsn, $user, $pass, $options);
    echo "Connection successful!\n";
} catch (\PDOException $e) {
    echo "Connection failed: " . $e->getMessage() . "\n";
}
