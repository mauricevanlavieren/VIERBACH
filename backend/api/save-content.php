<?php
/**
 * POST /api/save-content.php  —  alleen voor ingelogde beheerders.
 * Body: { "company": {...}, "hero": {...}, "projects": [...] }
 */

require_once __DIR__ . '/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    vb_fail('Method not allowed', 405);
}

vb_start_session();
vb_require_login();
vb_require_csrf();

$in = vb_read_json_body();
$updated = vb_apply_editable(vb_load_content(), $in);

if (!vb_save_content($updated)) {
    vb_fail('Kon wijzigingen niet opslaan. Controleer of data/content.json beschrijfbaar is (permissies).', 500);
}

vb_json(['ok' => true, 'lastUpdated' => $updated['lastUpdated'] ?? null]);
