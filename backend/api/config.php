<?php
// Production credentials are configured in Railway Variables, never in Git.
// With no password configured, administrator login remains disabled.
define('ADMIN_USERNAME', getenv('ADMIN_USERNAME') ?: 'admin');
$hash = getenv('ADMIN_PASSWORD_HASH') ?: '';
$password = getenv('ADMIN_PASSWORD') ?: '';
define('ADMIN_PASSWORD_HASH', $hash !== '' ? $hash : ($password !== '' ? password_hash($password, PASSWORD_BCRYPT) : ''));
