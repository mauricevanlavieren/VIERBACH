import React from 'react';
import { Phone, FileText, Settings, CheckCircle2 } from 'lucide-react';
import { CompanyInfo } from '../types';
import { Logo } from './Logo';

interface HeaderProps {
  company: CompanyInfo;
  onOpenCms: () => void;
  isCmsActive: boolean;
}

export const Header: React.FC<HeaderProps> = ({ company, onOpenCms, isCmsActive }) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800" id="main-header">
      {/* Top Banner Notice */}
      <div className="bg-slate-950 py-1.5 px-4 border-b border-slate-800/80 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-medium text-slate-200">{company.statusBadge}</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">{company.workingRadius}</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-400 hidden md:inline">Eénmanszaak met gecertificeerde machinist</span>
            <button
              onClick={onOpenCms}
              className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                isCmsActive
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700'
              }`}
              title="Content Management System (Beheer)"
              id="cms-header-toggle"
            >
              <Settings className="w-3 h-3" />
              <span>{isCmsActive ? 'CMS Modus Actief' : 'Eigenaar Beheer (CMS)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2 group">
          <Logo className="transition-transform group-hover:scale-[1.01]" />
        </a>

        {/* Quick Contact Buttons - Phone & WhatsApp (NO forms, direct contact) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`tel:${company.phone}`}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 sm:px-4 py-2 rounded-lg text-sm transition-all shadow-sm active:scale-95"
            id="header-phone-button"
          >
            <Phone className="w-4 h-4 fill-slate-950" />
            <span className="hidden sm:inline">Direct Bellen:</span>
            <span>{company.phoneDisplay}</span>
          </a>

          <button
            onClick={() =>
              document.getElementById('algemene-voorwaarden')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            className="hidden md:flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-semibold px-3.5 py-2 rounded-lg text-sm transition-all shadow-sm active:scale-95"
            id="header-terms-button"
            title="Bekijk de algemene voorwaarden"
          >
            <FileText className="w-4 h-4" />
            <span>Algemene Voorwaarden</span>
          </button>
        </div>
      </div>
    </header>
  );
};
