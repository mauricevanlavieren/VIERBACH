import React, { useState } from 'react';
import { Phone, MessageSquare, Maximize2, ShieldCheck, Zap, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { HeroData, CompanyInfo } from '../types';

interface HeroProps {
  hero: HeroData;
  company: CompanyInfo;
  onOpenLightbox: (imageUrl: string, title: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ hero, company, onOpenLightbox }) => {
  return (
    <section className="relative bg-slate-900 text-white overflow-hidden pt-8 pb-16 lg:py-20" id="hero-section">
      {/* Background Subtle Grid Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            {hero.craneModel}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {hero.badgeText}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {hero.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
              {hero.subtitle}
            </p>

            {/* Quick Benefits Bullet List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Geen voorrijdkosten binnen regio</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Compacte opstelruimte benodigd</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Eigen gecertificeerde machinist</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Radiografische afstandsbediening</span>
              </div>
            </div>

            {/* Direct Call & Messaging CTAs (NO forms as requested) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
              <a
                href={`tel:${company.phone}`}
                className="flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-xl text-base shadow-lg transition-all active:scale-98"
                id="hero-call-now-button"
              >
                <Phone className="w-5 h-5 fill-slate-950" />
                <span>Direct Bellen: {company.phoneDisplay}</span>
              </a>

              <a
                href={`https://wa.me/${company.whatsapp}?text=Beste%20VIERBACH,%20ik%20wil%20graag%20de%20beschikbaarheid%20en%20tarieven%20vragen%20voor%20de%20AT6%20mobiele%20hijskraan.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3.5 rounded-xl text-base transition-all border border-emerald-500"
                id="hero-whatsapp-button"
              >
                <MessageSquare className="w-5 h-5" />
                <span>WhatsApp Bericht</span>
              </a>
            </div>
          </div>

          {/* Prominent AT6 Crane Photo Showcase */}
          <div className="lg:col-span-6">
            <div className="relative group rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-2xl">
              {/* Photo */}
              <img
                src={hero.heroImageUrl}
                alt="VIERBACH Spierings AT6 Mobiele Torenkraan"
                className="w-full h-[360px] sm:h-[420px] lg:h-[460px] object-cover object-center transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                id="hero-crane-image"
              />

              {/* Gradient Overlay for Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

              {/* Photo Zoom Button */}
              <button
                onClick={() => onOpenLightbox(hero.heroImageUrl, 'VIERBACH AT6 Mobiele Torenkraan op de bouwlocatie')}
                className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white p-2.5 rounded-lg backdrop-blur border border-slate-700 transition-colors"
                title="Bekijk foto op volledig scherm"
                id="hero-image-zoom-button"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* Image Caption overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur border border-slate-800 p-4 rounded-xl flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-amber-400 font-bold">Vlaggenschip Kraan</p>
                  <p className="text-sm font-semibold text-white">AT6 Spierings Mobiele Torenkraan</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-amber-500 text-slate-950 text-xs font-black px-2 py-1 rounded">
                    10 Ton Max
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AT6 Crane Key Specs Bar */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-6 backdrop-blur">
          {hero.specs.map((spec, idx) => (
            <div key={idx} className="space-y-1 p-2 border-r border-slate-700/60 last:border-r-0">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider block">
                {spec.label}
              </span>
              <p className="text-xl sm:text-2xl font-black text-amber-400">
                {spec.value}
              </p>
              {spec.subtext && (
                <p className="text-xs text-slate-300 font-normal">
                  {spec.subtext}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
