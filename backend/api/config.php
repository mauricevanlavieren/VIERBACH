<?php
/**
 * VIERBACH — Beheerder-inloggegevens (SERVER ONLY).
 *
 * Dit bestand wordt NOOIT naar de browser gestuurd. Het wordt door
 * api/.htaccess afgeschermd tegen directe downloads.
 *
 * Het wachtwoord staat hier als een veilige bcrypt-hash (password_hash()).
 *
 * WACHTWOORD WIJZIGEN:
 *   1. Genereer een nieuwe hash op uw eigen computer of via SSH:
 *        php tools/make-hash.php "uwnieuwewachtwoord"
 *   2. Vervang de waarde hieronder (tussen de aanhalingstekens) door de uitvoer.
 */

define('ADMIN_USERNAME', 'admin');

define('ADMIN_PASSWORD_HASH', '$2y$10$BOjEfHGOZpSwXTPdoKdireALgBFUXgF81MyEP0wNKRiPXRoJ.21ya');
