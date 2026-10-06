import React from 'react';
import { Phone, FileText, Mail, MapPin, Building, ShieldCheck, Clock } from 'lucide-react';
import { CompanyInfo } from '../types';
import { Logo } from './Logo';

interface ContactFooterProps {
  company: CompanyInfo;
}

export const ContactFooter: React.FC<ContactFooterProps> = ({ company }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12" id="contact-sectie">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main Direct Contact Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Yellow Accent Top Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-400" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Direct Call CTA */}
            <div className="lg:col-span-7 space-y-4">
              <span className="inline-block text-amber-400 font-extrabold text-xs uppercase tracking-widest bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-md">
                Direct Contact • Geen Formulieren
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Hijskraan Nodig? Bel Direct Voor Beschikbaarheid
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                Als eenmanszaak heeft u bij VIERBACH direct persoonlijk contact met uw machinist. Geen tussenpersonen, snelle afspraken en directe helderheid over tarieven en inzet.
              </p>

              {/* Big Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <a
                  href={`tel:${company.phone}`}
                  className="flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-6 py-4 rounded-xl text-lg transition-all shadow-lg active:scale-98"
                  id="footer-call-button"
                >
                  <Phone className="w-5 h-5 fill-slate-950" />
                  <span>Bel Nu: {company.phoneDisplay}</span>
                </a>

                <button
                  onClick={() =>
                    document.getElementById('algemene-voorwaarden')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                  className="flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold px-6 py-4 rounded-xl text-base transition-all active:scale-98"
                  id="footer-terms-button"
                  title="Bekijk de algemene voorwaarden"
                >
                  <FileText className="w-5 h-5" />
                  <span>Algemene Voorwaarden</span>
                </button>
              </div>
            </div>

            {/* Right Column: Direct Company Credentials */}
            <div className="lg:col-span-5 bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
                Bedrijfsgegevens & Locatie
              </h3>

              <div className="space-y-3 text-sm text-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Telefoonnummer</span>
                    <a href={`tel:${company.phone}`} className="font-bold text-white hover:text-amber-400 transition-colors">
                      {company.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">E-mailadres</span>
                    <a href={`mailto:${company.email}`} className="font-semibold text-white hover:text-amber-400 transition-colors">
                      {company.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Standplaats / Werkgebied</span>
                    <span className="font-medium text-white">{company.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-slate-900 text-xs text-slate-400">
                  <Building className="w-4 h-4 text-slate-500" />
                  <span>KVK: <strong className="text-slate-200">{company.kvk}</strong></span>
                  {company.btw && <span className="ml-auto">BTW: <strong className="text-slate-200">{company.btw}</strong></span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Static Disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-900 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <Logo size="sm" imageUrl={company.logoImageUrl} />
            <span>© {new Date().getFullYear()} VIERBACH Kraanverhuur. Alle rechten voorbehouden.</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a href="https://www.kzkm.nl/" className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Lid van Kzkm.nl
            </a>
            <span>•</span>
            <a href="#algemene-voorwaarden" className="hover:text-amber-400 transition-colors">
              Voorwaarden
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

