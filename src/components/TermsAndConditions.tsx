import React, { useState } from 'react';
import { FileText, Printer, ChevronDown, ChevronUp, ShieldAlert, CheckCircle2, Search } from 'lucide-react';
import { TermSection, CompanyInfo } from '../types';

interface TermsProps {
  terms: TermSection[];
  company: CompanyInfo;
}

export const TermsAndConditions: React.FC<TermsProps> = ({ terms, company }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    // Open all by default for immediate transparency
    const initial: Record<string, boolean> = {};
    terms.forEach((t) => (initial[t.id] = true));
    return initial;
  });

  const [searchTerm, setSearchTerm] = useState('');

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    terms.forEach((t) => (all[t.id] = true));
    setOpenSections(all);
  };

  const collapseAll = () => {
    setOpenSections({});
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredTerms = terms.filter(
    (section) =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.content.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <section className="py-16 sm:py-20 bg-slate-900 text-slate-100 border-t border-slate-800" id="algemene-voorwaarden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl mb-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
                <FileText className="w-4 h-4" />
                <span>Transparant & Duidelijk</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Algemene Voorwaarden
              </h2>
              <p className="text-slate-400 text-sm">
                VIERBACH Hijskraanverhuur • Mobiele Torenkraan AT6 met Machinist
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
                title="Afdrukken of opslaan als PDF"
                id="print-terms-button"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>Afdrukken / PDF</span>
              </button>
            </div>
          </div>

          {/* Quick Notice Banner */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">Veiligheid & Kwaliteit Voorop</span>
              Op alle kraanverhuurovereenkomsten van VIERBACH zijn naast deze algemene voorwaarden voor kraanverhuur met machinist de landelijke VVT-veiligheidsrichtlijnen van kracht.
            </div>
          </div>

          {/* Controls: Search & Expand/Collapse */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Zoek in voorwaarden..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 self-end sm:self-auto">
              <button onClick={expandAll} className="hover:text-amber-400 transition-colors">
                Alles uitklappen
              </button>
              <span>•</span>
              <button onClick={collapseAll} className="hover:text-amber-400 transition-colors">
                Alles inklappen
              </button>
            </div>
          </div>
        </div>

        {/* Terms Accordion List */}
        <div className="space-y-4">
          {filteredTerms.length === 0 ? (
            <div className="bg-slate-950 p-8 text-center rounded-2xl border border-slate-800 text-slate-400">
              Geen artikelen gevonden voor &quot;{searchTerm}&quot;.
            </div>
          ) : (
            filteredTerms.map((section) => {
              const isOpen = !!openSections[section.id];
              return (
                <div
                  key={section.id}
                  className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden transition-colors"
                  id={`term-section-${section.id}`}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs font-black flex items-center justify-center shrink-0">
                        {section.number}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {section.title}
                      </h3>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-6 pt-2 border-t border-slate-800/80 space-y-3 text-sm text-slate-300 leading-relaxed bg-slate-950/60">
                      {section.content.map((paragraph, pIdx) => (
                        <p key={pIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
                          <span>{paragraph}</span>
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-slate-500">
          Gedeponeerd bij VIERBACH Hijskraanverhuur • KVK: {company.kvk} • BTW: {company.btw}
        </div>
      </div>
    </section>
  );
};
