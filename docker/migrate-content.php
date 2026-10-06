<?php
// Eenmalige inhoudsmigratie; bewaar bestaande foto's en overige CMS-velden.
$file = '/var/lib/vierbach/data/content.json';
$marker = '/var/lib/vierbach/data/.terms-2026-10-06';
if (is_file($marker)) {
    exit(0);
}
$current = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);
$seed = json_decode(file_get_contents('/opt/vierbach-seed/data/content.json'), true, 512, JSON_THROW_ON_ERROR);
if (!is_array($current) || !is_array($seed) || count($seed['terms'] ?? []) !== 15) {
    throw new RuntimeException('Ongeldige inhoud voor voorwaardenmigratie');
}
$backup = $file . '.before-terms-2026-10-06';
if (!is_file($backup) && !copy($file, $backup)) {
    throw new RuntimeException('Backup van bestaande inhoud mislukt');
}
foreach (['address', 'kvk', 'email'] as $field) {
    $current['company'][$field] = $seed['company'][$field];
}
if (($current['company']['btw'] ?? '') === 'NL001234567B01') {
    $current['company']['btw'] = '';
}
$current['terms'] = $seed['terms'];
$current['lastUpdated'] = gmdate('c');
$json = json_encode($current, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR);
if (file_put_contents($file . '.tmp', $json, LOCK_EX) === false || !rename($file . '.tmp', $file)) {
    throw new RuntimeException('Opslaan van voorwaarden mislukt');
}
if (file_put_contents($marker, 'done') === false) {
    throw new RuntimeException('Opslaan migratiestatus mislukt');
}
