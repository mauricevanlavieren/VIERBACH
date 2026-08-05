<?php
/**
 * GET /api/auth.php  —  is er een geldige beheersessie?
 */

require_once __DIR__ . '/helpers.php';

vb_start_session();

vb_json([
    'authenticated' => vb_is_logged_in(),
    'username'      => $_SESSION['user'] ?? null,
    'csrf'          => vb_csrf(),
]);
