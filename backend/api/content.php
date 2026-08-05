<?php
/**
 * GET /api/content.php  —  publieke content voor de website (geen login nodig).
 */

require_once __DIR__ . '/helpers.php';

vb_start_session();

$content = vb_load_content();

if (empty($content)) {
    // Nog geen content.json? Dan valt de React-site terug op de standaardinhoud.
    vb_json(new stdClass());
}

vb_json($content);
