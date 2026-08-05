import { WebsiteData } from './types';

const JSON_HEADERS = { Accept: 'application/json', 'Content-Type': 'application/json' };

async function parse<T>(res: Response): Promise<T> {
  try {
    return (await res.json()) as T;
  } catch {
    return {} as T;
  }
}

export interface AuthResult {
  ok: boolean;
  authenticated?: boolean;
  username?: string | null;
  csrf?: string;
  error?: string;
}

/** Publieke content ophalen; null als er geen PHP-backend is (b.v. GitHub Pages). */
export async function fetchContent(): Promise<WebsiteData | null> {
  try {
    const res = await fetch('/api/content.php', { headers: { Accept: 'application/json' } });
    if (!res.ok) return null;
    const data = await parse<WebsiteData>(res);
    return data && data.company ? data : null;
  } catch {
    return null;
  }
}

/** Bestaat er een geldige beheersessie? */
export async function checkAuth(): Promise<AuthResult> {
  try {
    const res = await fetch('/api/auth.php', { headers: { Accept: 'application/json' } });
    const data = await parse<AuthResult>(res);
    return { ok: res.ok, ...data };
  } catch {
    return { ok: false, authenticated: false, error: 'Kan de server niet bereiken.' };
  }
}

export async function login(username: string, password: string): Promise<AuthResult> {
  try {
    const res = await fetch('/api/login.php', {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify({ username, password }),
    });
    const data = await parse<AuthResult>(res);
    return { ok: res.ok, ...data };
  } catch {
    return { ok: false, error: 'Kan de server niet bereiken.' };
  }
}

export async function logout(csrf: string): Promise<boolean> {
  try {
    const res = await fetch('/api/logout.php', {
      method: 'POST',
      headers: { ...JSON_HEADERS, 'X-CSRF-Token': csrf },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function saveContent(
  csrf: string,
  payload: {
    company: WebsiteData['company'];
    hero: WebsiteData['hero'];
    projects: WebsiteData['projects'];
    terms: WebsiteData['terms'];
  }
): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch('/api/save-content.php', {
      method: 'POST',
      headers: { ...JSON_HEADERS, 'X-CSRF-Token': csrf },
      body: JSON.stringify(payload),
    });
    const data = await parse<{ ok: boolean; error?: string }>(res);
    return { ok: res.ok, ...data };
  } catch {
    return { ok: false, error: 'Kan de server niet bereiken.' };
  }
}

export async function uploadImage(
  csrf: string,
  file: File
): Promise<{ ok: boolean; url?: string; error?: string }> {
  try {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload.php', {
      method: 'POST',
      headers: { 'X-CSRF-Token': csrf },
      body: fd,
    });
    const data = await parse<{ ok: boolean; url?: string; error?: string }>(res);
    return { ok: res.ok, ...data };
  } catch {
    return { ok: false, error: 'Kan de server niet bereiken.' };
  }
}
