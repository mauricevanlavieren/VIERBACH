<?php
/**
 * POST /api/upload.php  —  alleen voor ingelogde beheerders.
 * Multipart:  file=<afbeelding>
 * Toegestaan: JPG, JPEG, PNG, WEBP, SVG — maximaal 5 MB.
 */

require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    vb_fail('Method not allowed', 405);
}

vb_start_session();
vb_require_login();
vb_require_csrf();

$maxBytes = 5 * 1024 * 1024; // 5 MB
$allowedExt = ['jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'svg' => 'image/svg+xml'];

if (empty($_FILES['file'])) {
    vb_fail('Geen bestand ontvangen of de upload is mislukt.', 400);
}

$f = $_FILES['file'];

if ((int)$f['error'] === UPLOAD_ERR_INI_SIZE || (int)$f['error'] === UPLOAD_ERR_FORM_SIZE || (int)$f['size'] > $maxBytes) {
    vb_fail('Bestand is te groot (maximaal 5 MB).', 413);
}

if ((int)$f['error'] !== UPLOAD_ERR_OK) {
    vb_fail('Geen bestand ontvangen of de upload is mislukt.', 400);
}

$ext = strtolower(pathinfo((string)$f['name'], PATHINFO_EXTENSION));
if (!isset($allowedExt[$ext])) {
    vb_fail('Alleen JPG, JPEG, PNG, WEBP of SVG bestanden zijn toegestaan.', 415);
}

// Controleer dat het bestand ook echt een afbeelding is
$isValid = false;
if ($ext === 'svg') {
    $head = strtolower((string)file_get_contents($f['tmp_name'], false, null, 0, 2048));
    $isValid = str_contains($head, '<svg')
        && !str_contains($head, '<?php')
        && !str_contains($head, '<script')
        && !str_contains($head, 'javascript:');
} else {
    $info = @getimagesize($f['tmp_name']);
    $isValid = is_array($info)
        && in_array($info['mime'], ['image/jpeg', 'image/png', 'image/webp'], true)
        && $info['mime'] === $allowedExt[$ext];
}

if (!$isValid) {
    vb_fail('Bestand is geen geldige afbeelding.', 415);
}

$dir = vb_uploads_dir();
if (!is_dir($dir)) {
    if (!@mkdir($dir, 0755, true)) {
        vb_fail('Uploadmap kon niet worden aangemaakt.', 500);
    }
}

// Veilige, willekeurige bestandsnaam (geen gebruikersnaam, geen traversal)
$name = 'img_' . bin2hex(random_bytes(10)) . '.' . $ext;
$dest = $dir . '/' . $name;

if (!move_uploaded_file($f['tmp_name'], $dest)) {
    vb_fail('Kon het bestand niet opslaan op de server.', 500);
}
@chmod($dest, 0644);

vb_json(['ok' => true, 'url' => '/uploads/' . $name]);
