<?php
/**
 * Alleen voor LOKAAL TESTEN met PHP's ingebouwde server:
 *   php -S 127.0.0.1:8000 -t deploy scripts/local-router.php
 *
 * De ingebouwde server negeert .htaccess, dus deze router laat
 * /admin de React-app laden (zelfde effect als de rewrite op STRATO).
 */

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$root = __DIR__ . '/../deploy';
$file = $root . $path;

if ($path !== '/' && is_file($file) && !is_dir($file)) {
    return false; // statische bestanden normaal serveren
}

if ($path === '/admin' || $path === '/admin/') {
    require $root . '/index.html';
    return true;
}

return false;
