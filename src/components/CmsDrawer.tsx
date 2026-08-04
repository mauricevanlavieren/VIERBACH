import React, { useState } from 'react';
import {
  X,
  Save,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Trash2,
  Check,
  Phone,
  Truck,
  HardHat,
  FileText,
  Lock,
  Unlock,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { WebsiteData, ProjectItem, TermSection } from '../types';

interface CmsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: WebsiteData;
  onSaveData: (newData: WebsiteData) => void;
  onResetData: () => void;
}

export const CmsDrawer: React.FC<CmsDrawerProps> = ({
  isOpen,
  onClose,
  data,
  onSaveData,
  onResetData,
}) => {
  const [formData, setFormData] = useState<WebsiteData>(JSON.parse(JSON.stringify(data)));
  const [activeTab, setActiveTab] = useState<'company' | 'hero' | 'projects' | 'terms'>('company');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(true); // Default unlocked for smooth editing, option to lock

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    const updated = { ...formData, lastUpdated: new Date().toISOString() };
    onSaveData(updated);
    showToast('✅ Wijzigingen succesvol opgeslagen!');
  };

  const handleReset = () => {
    if (window.confirm('Weet u zeker dat u alle gegevens wilt herstellen naar de standaardinstellingen?')) {
      onResetData();
      showToast('🔄 Standaardinstellingen hersteld!');
      onClose();
    }
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vierbach-website-data-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 Instellingen gedownload als JSON bestand!');
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.company && parsed.hero && parsed.projects) {
          setFormData(parsed);
          onSaveData(parsed);
          showToast('📤 Nieuwe gegevens succesvol geïmporteerd!');
        } else {
          alert('Ongeldig JSON bestand. Zorg ervoor dat het een VIERBACH export is.');
        }
      } catch (err) {
        alert('Fout bij het lezen van het JSON bestand.');
      }
    };
    reader.readAsText(file);
  };

  // Helper to update deeply
  const updateCompany = (field: string, val: string) => {
    setFormData((prev) => ({
      ...prev,
      company: { ...prev.company, [field]: val },
    }));
  };

  const updateHero = (field: string, val: any) => {
    setFormData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: val },
    }));
  };

  const updateHeroSpec = (idx: number, field: string, val: string) => {
    setFormData((prev) => {
      const newSpecs = [...prev.hero.specs];
      newSpecs[idx] = { ...newSpecs[idx], [field]: val };
      return {
        ...prev,
        hero: { ...prev.hero, specs: newSpecs },
      };
    });
  };

  const updateProject = (idx: number, field: keyof ProjectItem, val: any) => {
    setFormData((prev) => {
      const newProjects = [...prev.projects];
      newProjects[idx] = { ...newProjects[idx], [field]: val };
      return { ...prev, projects: newProjects };
    });
  };

  const updateProjectSpec = (projIdx: number, specIdx: number, val: string) => {
    setFormData((prev) => {
      const newProjects = [...prev.projects];
      const newSpecs = [...newProjects[projIdx].specs];
      newSpecs[specIdx] = val;
      newProjects[projIdx].specs = newSpecs;
      return { ...prev, projects: newProjects };
    });
  };

  const addProjectSpec = (projIdx: number) => {
    setFormData((prev) => {
      const newProjects = [...prev.projects];
      newProjects[projIdx].specs.push('Nieuwe specificatie');
      return { ...prev, projects: newProjects };
    });
  };

  const removeProjectSpec = (projIdx: number, specIdx: number) => {
    setFormData((prev) => {
      const newProjects = [...prev.projects];
      newProjects[projIdx].specs.splice(specIdx, 1);
      return { ...prev, projects: newProjects };
    });
  };

  const updateTerm = (idx: number, field: keyof TermSection, val: any) => {
    setFormData((prev) => {
      const newTerms = [...prev.terms];
      newTerms[idx] = { ...newTerms[idx], [field]: val };
      return { ...prev, terms: newTerms };
    });
  };

  const updateTermParagraph = (termIdx: number, pIdx: number, val: string) => {
    setFormData((prev) => {
      const newTerms = [...prev.terms];
      const newContent = [...newTerms[termIdx].content];
      newContent[pIdx] = val;
      newTerms[termIdx].content = newContent;
      return { ...prev, terms: newTerms };
    });
  };

  const addTermParagraph = (termIdx: number) => {
    setFormData((prev) => {
      const newTerms = [...prev.terms];
      newTerms[termIdx].content.push('Nieuwe regel of voorwaarde artikel...');
      return { ...prev, terms: newTerms };
    });
  };

  const removeTermParagraph = (termIdx: number, pIdx: number) => {
    setFormData((prev) => {
      const newTerms = [...prev.terms];
      newTerms[termIdx].content.splice(pIdx, 1);
      return { ...prev, terms: newTerms };
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400 text-slate-950 rounded-lg font-black text-xs">
              CMS
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Eigenaar Beheer Systeem
              </h2>
              <p className="text-xs text-slate-400">
                Pas teksten, telefoonnummers en projecten eenvoudig aan
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-extrabold text-center transition-all">
            {toastMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('company')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'company'
                ? 'border-amber-400 text-amber-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contact & Bedrijf</span>
          </button>

          <button
            onClick={() => setActiveTab('hero')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'hero'
                ? 'border-amber-400 text-amber-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Hero & AT6 Kraan</span>
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'projects'
                ? 'border-amber-400 text-amber-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <HardHat className="w-3.5 h-3.5" />
            <span>3 Recente Projecten</span>
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'terms'
                ? 'border-amber-400 text-amber-400 bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Algemene Voorwaarden</span>
          </button>
        </div>

        {/* Form Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* TAB 1: COMPANY */}
          {activeTab === 'company' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-amber-400 border-b border-slate-800 pb-2">
                Bedrijfs- en Contactgegevens
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Bedrijfsnaam</label>
                  <input
                    type="text"
                    value={formData.company.name}
                    onChange={(e) => updateCompany('name', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Status Badge (Topbalk)</label>
                  <input
                    type="text"
                    value={formData.company.statusBadge}
                    onChange={(e) => updateCompany('statusBadge', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Telefoon Weergave (bijv: 06 - 12 34 56 78)</label>
                  <input
                    type="text"
                    value={formData.company.phoneDisplay}
                    onChange={(e) => updateCompany('phoneDisplay', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Telefoon / WhatsApp Bellen (zonder spaties: 31612345678)</label>
                  <input
                    type="text"
                    value={formData.company.phone}
                    onChange={(e) => {
                      updateCompany('phone', e.target.value);
                      updateCompany('whatsapp', e.target.value);
                    }}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">E-mailadres</label>
                  <input
                    type="email"
                    value={formData.company.email}
                    onChange={(e) => updateCompany('email', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Werkgebied / Straal</label>
                  <input
                    type="text"
                    value={formData.company.workingRadius}
                    onChange={(e) => updateCompany('workingRadius', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">KVK Nummer</label>
                  <input
                    type="text"
                    value={formData.company.kvk}
                    onChange={(e) => updateCompany('kvk', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">BTW Nummer</label>
                  <input
                    type="text"
                    value={formData.company.btw}
                    onChange={(e) => updateCompany('btw', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Standplaats & Adres Omschrijving</label>
                <input
                  type="text"
                  value={formData.company.address}
                  onChange={(e) => updateCompany('address', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-amber-400 outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: HERO & CRANE */}
          {activeTab === 'hero' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-amber-400 border-b border-slate-800 pb-2">
                Hero Sectie & Kraan Specificaties
              </h3>

              <div>
                <label className="block text-slate-400 mb-1">Kraan Model Boven-titel</label>
                <input
                  type="text"
                  value={formData.hero.craneModel}
                  onChange={(e) => updateHero('craneModel', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Hoofdtitel Landingpage</label>
                <input
                  type="text"
                  value={formData.hero.title}
                  onChange={(e) => updateHero('title', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-amber-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Ondertitel / Beschrijving</label>
                <textarea
                  rows={3}
                  value={formData.hero.subtitle}
                  onChange={(e) => updateHero('subtitle', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-amber-400 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Hero Afbeelding URL (Afbeelding AT6 Kraan)</label>
                <input
                  type="text"
                  value={formData.hero.heroImageUrl}
                  onChange={(e) => updateHero('heroImageUrl', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white focus:border-amber-400 outline-none font-mono text-[11px]"
                />
              </div>

              <div className="pt-2">
                <label className="block text-slate-300 font-bold mb-2">AT6 Specificaties Kasten</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.hero.specs.map((spec, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded border border-slate-800 space-y-2">
                      <input
                        type="text"
                        value={spec.label}
                        onChange={(e) => updateHeroSpec(idx, 'label', e.target.value)}
                        placeholder="Label (bijv. Max. Hijslast)"
                        className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-300 font-semibold"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => updateHeroSpec(idx, 'value', e.target.value)}
                        placeholder="Waarde (bijv. 10.000 kg)"
                        className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-amber-400 font-bold"
                      />
                      <input
                        type="text"
                        value={spec.subtext || ''}
                        onChange={(e) => updateHeroSpec(idx, 'subtext', e.target.value)}
                        placeholder="Toelichting"
                        className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-amber-400 border-b border-slate-800 pb-2">
                De 3 Meest Recente Projecten
              </h3>

              {formData.projects.map((proj, pIdx) => (
                <div key={proj.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-extrabold text-amber-400">Project #{pIdx + 1}</span>
                    <span className="text-slate-500 text-[10px]">ID: {proj.id}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1">Project Titel</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateProject(pIdx, 'title', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Categorie / Type</label>
                      <input
                        type="text"
                        value={proj.clientOrType}
                        onChange={(e) => updateProject(pIdx, 'clientOrType', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Datum (bijv. Juli 2026)</label>
                      <input
                        type="text"
                        value={proj.date}
                        onChange={(e) => updateProject(pIdx, 'date', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1">Locatie (bijv. Tiel, Gelderland)</label>
                      <input
                        type="text"
                        value={proj.location}
                        onChange={(e) => updateProject(pIdx, 'location', e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Afbeelding URL</label>
                    <input
                      type="text"
                      value={proj.imageUrl}
                      onChange={(e) => updateProject(pIdx, 'imageUrl', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Project Beschrijving</label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => updateProject(pIdx, 'description', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-white resize-none"
                    />
                  </div>

                  {/* Project Specs */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-slate-400 font-bold">Specificatie Punten</label>
                      <button
                        type="button"
                        onClick={() => addProjectSpec(pIdx)}
                        className="text-amber-400 hover:underline text-[11px] flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        Punt Toevoegen
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {proj.specs.map((sp, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={sp}
                            onChange={(e) => updateProjectSpec(pIdx, sIdx, e.target.value)}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 text-white"
                          />
                          <button
                            onClick={() => removeProjectSpec(pIdx, sIdx)}
                            className="p-1 text-slate-500 hover:text-red-400"
                            title="Verwijderen"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: TERMS */}
          {activeTab === 'terms' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-amber-400 border-b border-slate-800 pb-2">
                Algemene Voorwaarden Artikelen
              </h3>

              {formData.terms.map((term, tIdx) => (
                <div key={term.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={term.number}
                      onChange={(e) => updateTerm(tIdx, 'number', e.target.value)}
                      className="w-12 bg-slate-900 border border-slate-800 rounded p-1.5 text-amber-400 font-bold text-center"
                    />
                    <input
                      type="text"
                      value={term.title}
                      onChange={(e) => updateTerm(tIdx, 'title', e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded p-1.5 text-white font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-400">Regels / Paragrafen</label>
                      <button
                        onClick={() => addTermParagraph(tIdx)}
                        className="text-amber-400 hover:underline text-[11px] flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Regel Toevoegen
                      </button>
                    </div>

                    {term.content.map((paragraph, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2">
                        <textarea
                          rows={2}
                          value={paragraph}
                          onChange={(e) => updateTermParagraph(tIdx, pIdx, e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded p-2 text-white text-xs resize-none"
                        />
                        <button
                          onClick={() => removeTermParagraph(tIdx, pIdx)}
                          className="p-1.5 text-slate-500 hover:text-red-400 mt-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-2 rounded-lg font-medium transition-colors"
              title="Exporteer instellingen naar een JSON bestand"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Exporteer JSON</span>
            </button>

            <label className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-3 py-2 rounded-lg font-medium cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span>Importeer</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-slate-400 hover:text-red-400 px-3 py-2"
              title="Reset naar oorspronkelijke fabrieksinstellingen"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-5 py-2 rounded-lg text-sm transition-all shadow-md active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Wijzigingen Opslaan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
