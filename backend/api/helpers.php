<?php
/**
 * VIERBACH — Gedeelde hulpfuncties voor de beheer-API.
 */

require_once __DIR__ . '/config.php';

/* ------------------------------------------------------------------ */
/* Paden                                                              */
/* ------------------------------------------------------------------ */

function vb_data_file(): string
{
    return __DIR__ . '/../data/content.json';
}

function vb_uploads_dir(): string
{
    return __DIR__ . '/../uploads';
}

/* ------------------------------------------------------------------ */
/* Sessies                                                            */
/* ------------------------------------------------------------------ */

function vb_start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $isHttps = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    session_set_cookie_params([
        'lifetime' => 0,                 // tot de browser sluit
        'path'     => '/',
        'httponly' => true,              // niet leesbaar via JavaScript
        'secure'   => $isHttps,          // alleen over HTTPS (uit als lokaal http)
        'samesite' => 'Lax',
    ]);
    session_name('vierbach_admin');
    session_start();

    // CSRF-token aanmaken zodra een sessie bestaat
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
}

function vb_csrf(): string
{
    return $_SESSION['csrf'] ?? '';
}

/* ------------------------------------------------------------------ */
/* JSON-antwoorden                                                    */
/* ------------------------------------------------------------------ */

function vb_json($data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function vb_fail(string $msg, int $code = 400): void
{
    vb_json(['ok' => false, 'error' => $msg], $code);
}

/* ------------------------------------------------------------------ */
/* Invoer                                                             */
/* ------------------------------------------------------------------ */

function vb_read_json_body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode((string)$raw, true);
    return is_array($data) ? $data : [];
}

/* ------------------------------------------------------------------ */
/* Authenticatie & CSRF                                               */
/* ------------------------------------------------------------------ */

function vb_is_logged_in(): bool
{
    vb_start_session();
    return !empty($_SESSION['user']);
}

function vb_require_login(): void
{
    if (!vb_is_logged_in()) {
        vb_fail('Niet geautoriseerd. Log eerst in.', 401);
    }
}

function vb_require_csrf(): void
{
    $sent = (string)($_SERVER['HTTP_X_CSRF_TOKEN'] ?? '');
    if ($sent === '' || !hash_equals(vb_csrf(), $sent)) {
        vb_fail('CSRF-token ongeldig. Ververs de pagina en probeer opnieuw.', 403);
    }
}

/* ------------------------------------------------------------------ */
/* Content-opslag (JSON-bestand, geen database)                       */
/* ------------------------------------------------------------------ */

function vb_load_content(): array
{
    $file = vb_data_file();
    if (!is_file($file)) {
        return [];
    }
    $raw = file_get_contents($file);
    $data = json_decode((string)$raw, true);
    return is_array($data) ? $data : [];
}

function vb_save_content(array $content): bool
{
    $file = vb_data_file();
    $dir = dirname($file);
    if (!is_dir($dir)) {
        return false;
    }
    $json = json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false) {
        return false;
    }
    // Atomisch schrijven: eerst .tmp, daarna hernoemen
    $tmp = $file . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) === false) {
        return false;
    }
    if (!rename($tmp, $file)) {
        @unlink($tmp);
        return false;
    }
    @chmod($file, 0644);
    return true;
}

/* ------------------------------------------------------------------ */
/* Sanitize / validatie                                               */
/* ------------------------------------------------------------------ */

function vb_clean_text($value, int $max = 5000): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = str_replace(["\0", "\r"], '', $value);
    $value = strip_tags($value);          // geen HTML/scripts opslaan
    $value = trim($value);
    if (strlen($value) > $max) {
        $value = substr($value, 0, $max);
    }
    return $value;
}

/**
 * Alleen eigen /uploads/ paden accepteren; geen externe of traversal-urls.
 */
function vb_clean_upload_url($value): string
{
    if (!is_string($value)) {
        return '';
    }
    $value = trim($value);
    if ($value === '') {
        return '';
    }
    if (str_starts_with($value, '/uploads/') && !str_contains($value, '..') && !str_contains($value, '\\')) {
        return $value;
    }
    return '';
}

function vb_clean_specs($specs): array
{
    if (!is_array($specs)) {
        return [];
    }
    $out = [];
    foreach (array_slice($specs, 0, 8) as $s) {
        if (!is_array($s)) {
            continue;
        }
        $out[] = [
            'label' => vb_clean_text($s['label'] ?? '', 80),
            'value' => vb_clean_text($s['value'] ?? '', 120),
        ];
    }
    return $out;
}

function vb_clean_terms($terms): array
{
    if (!is_array($terms)) {
        return [];
    }
    $out = [];
    foreach (array_slice($terms, 0, 20) as $i => $t) {
        if (!is_array($t)) {
            continue;
        }
        $content = [];
        foreach (array_slice($t['content'] ?? [], 0, 20) as $p) {
            $c = vb_clean_text($p, 4000);
            if ($c !== '') {
                $content[] = $c;
            }
        }
        $id = vb_clean_text($t['id'] ?? '', 60);
        if ($id === '') {
            $id = 'term-' . ($i + 1);
        }
        $out[] = [
            'id'      => $id,
            'number'  => vb_clean_text($t['number'] ?? '', 10),
            'title'   => vb_clean_text($t['title'] ?? '', 200),
            'content' => $content,
        ];
    }
    return $out;
}

function vb_clean_project_specs($specs): array
{
    if (!is_array($specs)) {
        return [];
    }
    $out = [];
    foreach (array_slice($specs, 0, 12) as $s) {
        $t = vb_clean_text($s, 200);
        if ($t !== '') {
            $out[] = $t;
        }
    }
    return $out;
}

function vb_clean_projects($projects): array
{
    if (!is_array($projects)) {
        return [];
    }
    $out = [];
    foreach (array_slice($projects, 0, 12) as $i => $p) {
        if (!is_array($p)) {
            continue;
        }
        $id = vb_clean_text($p['id'] ?? '', 60);
        if ($id === '') {
            $id = 'project-' . ($i + 1);
        }
        $out[] = [
            'id'           => $id,
            'title'        => vb_clean_text($p['title'] ?? '', 200),
            'clientOrType' => vb_clean_text($p['clientOrType'] ?? '', 120),
            'date'         => vb_clean_text($p['date'] ?? '', 80),
            'location'     => vb_clean_text($p['location'] ?? '', 120),
            'description'  => vb_clean_text($p['description'] ?? '', 3000),
            'imageUrl'     => vb_clean_upload_url($p['imageUrl'] ?? ''),
            'specs'        => vb_clean_project_specs($p['specs'] ?? []),
        ];
    }
    return $out;
}

/**
 * Past de bewerkbare velden uit $in toe op de bestaande content,
 * met een strikte allowlist per sectie.
 */
function vb_apply_editable(array $existing, array $in): array
{
    $out = $existing;

    /* ---- Bedrijf ---- */
    $companyAllowed = [
        'name', 'tagline', 'phone', 'phoneDisplay', 'whatsapp', 'email',
        'kvk', 'btw', 'address', 'workingRadius', 'statusBadge',
    ];
    $company = array_intersect_key($existing['company'] ?? [], array_flip($companyAllowed));
    $companyIn = $in['company'] ?? [];
    foreach ($companyAllowed as $k) {
        if (array_key_exists($k, $companyIn)) {
            $company[$k] = vb_clean_text($companyIn[$k], 300);
        }
    }
    $company['logoImageUrl'] = vb_clean_upload_url($companyIn['logoImageUrl'] ?? ($existing['company']['logoImageUrl'] ?? ''));
    $out['company'] = $company;

    /* ---- Hero ---- */
    $hero = array_intersect_key($existing['hero'] ?? [], array_flip(['title', 'subtitle', 'craneModel', 'badgeText', 'heroImageUrl', 'specs']));
    $heroIn = $in['hero'] ?? [];
    foreach (['title', 'subtitle', 'craneModel', 'badgeText'] as $k) {
        if (array_key_exists($k, $heroIn)) {
            $hero[$k] = vb_clean_text($heroIn[$k], 3000);
        }
    }
    if (array_key_exists('heroImageUrl', $heroIn)) {
        $hero['heroImageUrl'] = vb_clean_upload_url($heroIn['heroImageUrl']);
    }
    if (isset($heroIn['specs']) && is_array($heroIn['specs']) && count($heroIn['specs']) > 0) {
        $hero['specs'] = vb_clean_specs($heroIn['specs']);
    }
    $out['hero'] = $hero;

    /* ---- Projecten (niet overschrijven bij een lege/ontbrekende array) ---- */
    if (isset($in['projects']) && is_array($in['projects']) && count($in['projects']) > 0) {
        $clean = vb_clean_projects($in['projects']);
        // Bewaar project-specificaties uit de bestaande content als de input ze niet meelevert
        $existingById = [];
        foreach ($existing['projects'] ?? [] as $ep) {
            if (isset($ep['id'])) {
                $existingById[$ep['id']] = $ep;
            }
        }
        foreach ($clean as $i => $cp) {
            if (empty($cp['specs']) && !empty($existingById[$cp['id']]['specs']) && is_array($existingById[$cp['id']]['specs'])) {
                $clean[$i]['specs'] = $existingById[$cp['id']]['specs'];
            }
        }
        $out['projects'] = $clean;
    }

    /* ---- Algemene voorwaarden (niet overschrijven bij een lege/ontbrekende array) ---- */
    if (isset($in['terms']) && is_array($in['terms']) && count($in['terms']) > 0) {
        $out['terms'] = vb_clean_terms($in['terms']);
    }

    $out['lastUpdated'] = gmdate('c');
    return $out;
}
