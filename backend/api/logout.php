<?php
/**
 * POST /api/logout.php  —  beëindigt de sessie.
 */

require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    vb_fail('Method not allowed', 405);
}

vb_start_session();
vb_require_login();
vb_require_csrf();

$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
}

session_destroy();

vb_json(['ok' => true]);
