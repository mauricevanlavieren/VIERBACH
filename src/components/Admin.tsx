import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  LogOut,
  Save,
  Lock,
  User,
  AlertCircle,
  Loader2,
  Upload,
  Trash2,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { WebsiteData } from '../types';
import { INITIAL_WEBSITE_DATA } from '../data/defaultData';
import { checkAuth, fetchContent, login, logout, saveContent, uploadImage } from '../api';

type AuthState = 'loading' | 'guest' | 'authed';

type Status = { kind: 'success' | 'error'; text: string } | null;

interface UploadResult {
  ok: boolean;
  url?: string;
  error?: string;
}

/* ------------------------------------------------------------------ */
/* Kleine herbruikbare velden                                         */
/* ------------------------------------------------------------------ */

const inputCls =
  'w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors';

function Field({
  label,
  value,
  onChange,
  type = 'text',
  large = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  large?: boolean;
}) {
  return (
    <div className="flex-1 min-w-0">
      <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
      <input
        type={type}
        className={large ? `${inputCls} text-base py-2.5` : inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  large = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  large?: boolean;
}) {
  return (
    <div className="flex-1 min-w-0">
      <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
      <textarea
        rows={rows}
        className={large ? `${inputCls} text-base leading-relaxed py-2.5 resize-y` : `${inputCls} resize-y`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6">
      <h2 className="text-sm font-extrabold uppercase tracking-wider text-amber-400 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ImagePicker({
  label,
  imageUrl,
  onUpload,
  onClear,
  clearable = true,
}: {
  label: string;
  imageUrl: string;
  onUpload: (file: File) => Promise<UploadResult>;
  onClear?: () => void;
  clearable?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    const res = await onUpload(file);
    setBusy(false);
    if (!res.ok) setError(res.error ?? 'Upload mislukt.');
    e.target.value = '';
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-1">{label}</label>
      <div className="flex items-center gap-4 bg-slate-950 border border-slate-800 rounded-lg p-3">
        {imageUrl ? (
          <img src={imageUrl} alt={label} className="h-20 w-32 object-cover rounded-md border border-slate-800" />
        ) : (
          <div className="h-20 w-32 rounded-md border border-dashed border-slate-700 flex items-center justify-center text-slate-600 text-xs">
            Geen foto
          </div>
        )}
        <div className="space-y-2">
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="hidden" onChange={handleChange} />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-100 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
            <span>{busy ? 'Bezig met uploaden...' : 'Kies nieuwe foto'}</span>
          </button>
          {clearable && imageUrl && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-xs font-semibold transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Foto verwijderen</span>
            </button>
          )}
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hoofdcomponent                                                     */
/* ------------------------------------------------------------------ */

export const Admin: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>('loading');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginBusy, setLoginBusy] = useState(false);
  const [csrf, setCsrf] = useState('');
  const [form, setForm] = useState<WebsiteData | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [saving, setSaving] = useState(false);

  /* --- Eerste check: al ingelogd? --- */
  useEffect(() => {
    let cancelled = false;
    checkAuth().then(async (res) => {
      if (cancelled) return;
      if (res.authenticated) {
        setCsrf(res.csrf ?? '');
        const content = await fetchContent();
        if (cancelled) return;
        setForm(content ? content : INITIAL_WEBSITE_DATA);
        setAuth('authed');
      } else {
        setAuth('guest');
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginBusy(true);
    setLoginError(null);
    const res = await login(username.trim(), password);
    setLoginBusy(false);
    if (!res.ok) {
      setLoginError(res.error ?? 'Inloggen mislukt.');
      return;
    }
    setCsrf(res.csrf ?? '');
    const content = await fetchContent();
    setForm(content ? content : INITIAL_WEBSITE_DATA);
    setPassword('');
    setAuth('authed');
  };

  const handleLogout = async () => {
    await logout(csrf);
    setAuth('guest');
    setForm(null);
    setStatus(null);
  };

  /* --- Form updates --- */
  const setCompany = (field: keyof WebsiteData['company'], value: string) =>
    setForm((f) => (f ? { ...f, company: { ...f.company, [field]: value } } : f));

  const setHero = (field: keyof WebsiteData['hero'], value: string) =>
    setForm((f) => (f ? { ...f, hero: { ...f.hero, [field]: value } } : f));

  const setSpec = (idx: number, field: 'label' | 'value', value: string) =>
    setForm((f) => {
      if (!f) return f;
      const specs = f.hero.specs.map((s, i) => (i === idx ? { ...s, [field]: value } : s));
      return { ...f, hero: { ...f.hero, specs } };
    });

  const setProject = (idx: number, field: 'title' | 'date' | 'location' | 'description', value: string) =>
    setForm((f) => {
      if (!f) return f;
      const projects = f.projects.map((p, i) => (i === idx ? { ...p, [field]: value } : p));
      return { ...f, projects };
    });

  /* --- Algemene voorwaarden --- */
  const setTermTitle = (idx: number, value: string) =>
    setForm((f) => {
      if (!f) return f;
      const terms = f.terms.map((t, i) => (i === idx ? { ...t, title: value } : t));
      return { ...f, terms };
    });

  const setTermParagraph = (termIdx: number, pIdx: number, value: string) =>
    setForm((f) => {
      if (!f) return f;
      const terms = f.terms.map((t, i) => {
        if (i !== termIdx) return t;
        const content = t.content.map((c, j) => (j === pIdx ? value : c));
        return { ...t, content };
      });
      return { ...f, terms };
    });

  const addTermParagraph = (termIdx: number) =>
    setForm((f) => {
      if (!f) return f;
      const terms = f.terms.map((t, i) =>
        i === termIdx ? { ...t, content: [...t.content, 'Nieuwe regel of voorwaarde...'] } : t
      );
      return { ...f, terms };
    });

  const removeTermParagraph = (termIdx: number, pIdx: number) =>
    setForm((f) => {
      if (!f) return f;
      const terms = f.terms.map((t, i) =>
        i === termIdx ? { ...t, content: t.content.filter((_, j) => j !== pIdx) } : t
      );
      return { ...f, terms };
    });

  /* --- Uploads --- */
  const handleUpload = useCallback(
    (apply: (url: string) => void) =>
      async (file: File): Promise<UploadResult> => {
        const res = await uploadImage(csrf, file);
        if (res.ok && res.url) {
          apply(res.url);
          setStatus({ kind: 'success', text: '✅ Foto geüpload. Klik onderaan op "Wijzigingen opslaan" om vast te leggen.' });
        } else {
          setStatus({ kind: 'error', text: res.error ?? 'Upload mislukt.' });
        }
        return res;
      },
    [csrf]
  );

  /* --- Opslaan --- */
  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    setStatus(null);
    const res = await saveContent(csrf, {
      company: form.company,
      hero: form.hero,
      projects: form.projects,
      terms: form.terms,
    });
    setSaving(false);
    setStatus(
      res.ok
        ? { kind: 'success', text: '✅ Wijzigingen opgeslagen! De publieke website is bijgewerkt.' }
        : { kind: 'error', text: res.error ?? 'Opslaan mislukt.' }
    );
  };

  /* ================= LOGIN SCHERM ================= */
  if (auth === 'loading') {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  if (auth === 'guest' || !form) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-amber-400 text-slate-950 rounded-lg flex items-center justify-center font-black">
              VB
            </div>
            <div>
              <h1 className="text-white font-extrabold tracking-tight leading-tight">VIERBACH Beheer</h1>
              <p className="text-xs text-slate-400">Log in om de website te beheren</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Gebruikersnaam</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  autoComplete="username"
                  className={`${inputCls} pl-9`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Wachtwoord</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  autoComplete="current-password"
                  className={`${inputCls} pl-9`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loginBusy || !username || !password}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-extrabold py-3 rounded-xl transition-all active:scale-[0.98]"
            >
              {loginBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              <span>Inloggen</span>
            </button>
          </form>

          <a href="/" className="block text-center text-xs text-slate-500 hover:text-amber-400 mt-6 transition-colors">
            ← Terug naar de website
          </a>
        </div>
      </div>
    );
  }

  /* ================= DASHBOARD ================= */
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Topbalk */}
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-400 text-slate-950 rounded-lg flex items-center justify-center font-black text-sm">
              VB
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white leading-tight">VIERBACH Beheer</h1>
              <p className="text-[11px] text-slate-400 leading-tight">Bewerk de inhoud van uw website</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-amber-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bekijk website</span>
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-red-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Uitloggen</span>
            </button>
          </div>
        </div>
      </header>

      {/* Statusmelding */}
      {status && (
        <div
          className={`max-w-4xl mx-auto px-4 mt-4 ${
            status.kind === 'success'
              ? 'bg-emerald-400/10 border border-emerald-400/30 text-emerald-300'
              : 'bg-red-400/10 border border-red-400/30 text-red-300'
          } text-sm rounded-xl px-4 py-3`}
        >
          {status.text}
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 pb-32">
        {/* --- Website & Bedrijf --- */}
        <Section title="Website & Bedrijf">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Bedrijfsnaam (tekstlogo)" value={form.company.name} onChange={(v) => setCompany('name', v)} />
            <Field label="Slogan onder het logo" value={form.company.tagline} onChange={(v) => setCompany('tagline', v)} />
            <Field label="Status (topbalk)" value={form.company.statusBadge} onChange={(v) => setCompany('statusBadge', v)} />
            <Field label="Werkgebied (topbalk)" value={form.company.workingRadius} onChange={(v) => setCompany('workingRadius', v)} />
            <Field label="Telefoon (link, zonder spaties)" value={form.company.phone} onChange={(v) => setCompany('phone', v)} />
            <Field label="Telefoon (weergave)" value={form.company.phoneDisplay} onChange={(v) => setCompany('phoneDisplay', v)} />
            <Field label="WhatsApp-nummer" value={form.company.whatsapp} onChange={(v) => setCompany('whatsapp', v)} />
            <Field label="E-mailadres" value={form.company.email} onChange={(v) => setCompany('email', v)} />
            <Field label="Standplaats / adres omschrijving" value={form.company.address} onChange={(v) => setCompany('address', v)} />
            <Field label="KVK-nummer" value={form.company.kvk} onChange={(v) => setCompany('kvk', v)} />
            <Field label="BTW-nummer" value={form.company.btw} onChange={(v) => setCompany('btw', v)} />
          </div>
        </Section>

        {/* --- Startpagina (Hero) --- */}
        <Section title="Startpagina">
          <Field label="Hoofdtitel" value={form.hero.title} onChange={(v) => setHero('title', v)} />
          <TextArea label="Introductietekst" value={form.hero.subtitle} onChange={(v) => setHero('subtitle', v)} rows={3} />
          <Field label="Kraanmodel-badge" value={form.hero.craneModel} onChange={(v) => setHero('craneModel', v)} />
          <Field label="Badgetekst (pijl-tekens)" value={form.hero.badgeText} onChange={(v) => setHero('badgeText', v)} />

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">Technische specificaties</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {form.hero.specs.map((spec, idx) => (
                <div key={idx} className="flex gap-2 bg-slate-950 border border-slate-800 rounded-lg p-2">
                  <input
                    className={`${inputCls} !bg-slate-900`}
                    value={spec.label}
                    onChange={(e) => setSpec(idx, 'label', e.target.value)}
                    placeholder="Label"
                  />
                  <input
                    className={`${inputCls} !bg-slate-900`}
                    value={spec.value}
                    onChange={(e) => setSpec(idx, 'value', e.target.value)}
                    placeholder="Waarde"
                  />
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* --- Foto's --- */}
        <Section title="Foto's">
          <ImagePicker
            label="Hoofdfoto (hero — kraanfoto bovenaan)"
            imageUrl={form.hero.heroImageUrl}
            onUpload={handleUpload((url) => setHero('heroImageUrl', url))}
            onClear={() => setHero('heroImageUrl', '')}
            clearable={false}
          />
          <ImagePicker
            label="Logo-afbeelding (optioneel — leeg toont het tekstlogo 'VIERBACH')"
            imageUrl={form.company.logoImageUrl ?? ''}
            onUpload={handleUpload((url) => setCompany('logoImageUrl', url))}
            onClear={() => setCompany('logoImageUrl', '')}
          />
        </Section>

        {/* --- Projecten --- */}
        <Section title="Recente projecten (3)">
          {form.projects.map((project, idx) => (
            <div key={project.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Project {idx + 1}</p>
              <Field label="Titel" value={project.title} onChange={(v) => setProject(idx, 'title', v)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label="Datum" value={project.date} onChange={(v) => setProject(idx, 'date', v)} />
                <Field label="Locatie" value={project.location} onChange={(v) => setProject(idx, 'location', v)} />
              </div>
              <TextArea label="Omschrijving" value={project.description} onChange={(v) => setProject(idx, 'description', v)} rows={3} />
              <ImagePicker
                label="Projectfoto"
                imageUrl={project.imageUrl}
                onUpload={handleUpload((url) =>
                  setForm((f) =>
                    f
                      ? {
                          ...f,
                          projects: f.projects.map((p, i) => (i === idx ? { ...p, imageUrl: url } : p)),
                        }
                      : f
                  )
                )}
                clearable={false}
              />
            </div>
          ))}
        </Section>

        {/* --- Algemene voorwaarden --- */}
        <Section title="Algemene voorwaarden">
          {form.terms.length === 0 ? (
            <p className="text-sm text-slate-500">Geen voorwaarden gevonden.</p>
          ) : (
            form.terms.map((term, idx) => (
              <div key={term.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 text-sm font-black flex items-center justify-center shrink-0">
                    {term.number}
                  </span>
                  <Field label="Titel artikel" value={term.title} onChange={(v) => setTermTitle(idx, v)} large />
                </div>
                <div className="space-y-4">
                  {term.content.map((paragraph, pIdx) => (
                    <div key={pIdx} className="flex items-start gap-3">
                      <TextArea
                        label={`Paragraaf ${pIdx + 1}`}
                        value={paragraph}
                        onChange={(v) => setTermParagraph(idx, pIdx, v)}
                        rows={10}
                        large
                      />
                      <button
                        type="button"
                        onClick={() => removeTermParagraph(idx, pIdx)}
                        className="mt-7 p-2 text-slate-500 hover:text-red-400 transition-colors shrink-0"
                        title="Paragraaf verwijderen"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => addTermParagraph(idx)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-amber-400 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Paragraaf toevoegen</span>
                </button>
              </div>
            ))
          )}
        </Section>
      </main>

      {/* Opslaan-balk (onderaan) */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-[11px] text-slate-500 hidden sm:block">
            Wijzigingen worden direct op de website gepubliceerd.
          </p>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-extrabold px-6 py-3 rounded-xl transition-all active:scale-[0.98]"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Bezig met opslaan...' : 'Wijzigingen opslaan'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
