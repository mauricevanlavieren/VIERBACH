<?php
/**
 * CLI-only hulpmiddel: genereert een bcrypt-hash voor het beheerwachtwoord.
 *
 * Gebruik (op uw computer of via SSH op de server):
 *   php tools/make-hash.php "uwnieuwewachtwoord"
 *
 * Kopieer de uitvoer naar api/config.php als ADMIN_PASSWORD_HASH.
 */

if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("Dit script is alleen via de terminal (CLI) bruikbaar.\n");
}

$password = $argv[1] ?? '';

if ($password === '') {
    fwrite(STDERR, "Gebruik: php tools/make-hash.php \"uw-wachtwoord\"\n");
    exit(1);
}

if (strlen($password) < 8) {
    fwrite(STDERR, "Wachtwoord moet minimaal 8 tekens zijn.\n");
    exit(1);
}

echo password_hash($password, PASSWORD_DEFAULT) . "\n";
echo "\nPlak deze waarde in api/config.php als ADMIN_PASSWORD_HASH.\n";
