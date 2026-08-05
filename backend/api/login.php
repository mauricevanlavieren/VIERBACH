<?php
/**
 * POST /api/login.php  —  { "username": "...", "password": "..." }
 * Geeft bij succes een sessie en een CSRF-token terug.
 */

require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    vb_fail('Method not allowed', 405);
}

vb_start_session();

// Al ingelogd? Direct ok.
if (vb_is_logged_in()) {
    vb_json(['ok' => true, 'csrf' => vb_csrf()]);
}

$body = vb_read_json_body();
$username = vb_clean_text($body['username'] ?? '', 100);
$password = (string)($body['password'] ?? '');

if ($username === '' || $password === '') {
    vb_fail('Voer gebruikersnaam en wachtwoord in.', 400);
}

// Tijd-constante vergelijking + kleine vertraging om brute force te vertragen.
if (!hash_equals(ADMIN_USERNAME, $username) || !password_verify($password, ADMIN_PASSWORD_HASH)) {
    usleep(400000);
    vb_fail('Onjuiste gebruikersnaam of wachtwoord.', 401);
}

// Nieuwe sessie-id tegen session fixation
session_regenerate_id(true);
$_SESSION['user'] = $username;
$_SESSION['csrf'] = bin2hex(random_bytes(32));

vb_json(['ok' => true, 'csrf' => vb_csrf()]);
