import React, { useState, useEffect } from 'react';
import { WebsiteData } from './types';
import { INITIAL_WEBSITE_DATA } from './data/defaultData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RecentProjects } from './components/RecentProjects';
import { TermsAndConditions } from './components/TermsAndConditions';
import { ContactFooter } from './components/ContactFooter';
import { LightboxModal } from './components/LightboxModal';
import { Admin } from './components/Admin';
import { fetchContent } from './api';

const STORAGE_KEY = 'vierbach_website_cms_data_v1';

/** Eenvoudige routering: /admin (pad of #/admin-hash) toont het beheerpaneel. */
function isAdminRoute(): boolean {
  const p = window.location.pathname.replace(/\/+$/, '');
  return p.endsWith('/admin') || window.location.hash.toLowerCase().startsWith('#/admin');
}

/** Servercontent boven de standaardinhoud; ontbrekende stukken vallen terug. */
function mergeWebsiteData(base: WebsiteData, server: WebsiteData): WebsiteData {
  return {
    company: { ...base.company, ...server.company },
    hero: {
      ...base.hero,
      ...server.hero,
      heroImageUrl: server.hero.heroImageUrl || base.hero.heroImageUrl,
      specs: server.hero.specs && server.hero.specs.length > 0 ? server.hero.specs : base.hero.specs,
    },
    projects: server.projects && server.projects.length > 0 ? server.projects : base.projects,
    terms: server.terms && server.terms.length > 0 ? server.terms : base.terms,
  };
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState<boolean>(isAdminRoute);

  // Reageer op navigatie tussen publieke site en beheerpaneel (#/admin of /admin)
  useEffect(() => {
    const sync = () => setIsAdmin(isAdminRoute());
    window.addEventListener('hashchange', sync);
    window.addEventListener('popstate', sync);
    return () => {
      window.removeEventListener('hashchange', sync);
      window.removeEventListener('popstate', sync);
    };
  }, []);

  const [websiteData, setWebsiteData] = useState<WebsiteData>(() => {
    // Legacy localStorage van het oude demo-CMS (wordt nog gerespecteerd als fallback).
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.company && parsed.hero && parsed.projects) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore
    }
    return INITIAL_WEBSITE_DATA;
  });

  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
  });

  // Publieke content laden vanaf de PHP-backend.
  // Geen PHP beschikbaar (lokaal zonder server of GitHub Pages)? Dan blijft de site gewoon werken met de standaardinhoud.
  useEffect(() => {
    if (isAdmin) return;
    let cancelled = false;
    fetchContent().then((server) => {
      if (cancelled || !server) return;
      setWebsiteData((prev) => mergeWebsiteData(INITIAL_WEBSITE_DATA, server));
    });
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  // Beheerpaneel
  if (isAdmin) {
    return <Admin />;
  }

  const handleOpenLightbox = (imageUrl: string, title: string) => {
    setLightboxState({ isOpen: true, imageUrl, title });
  };

  const handleCloseLightbox = () => {
    setLightboxState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-amber-400 selection:text-slate-950">
      {/* Sticky Navigation Header */}
      <Header company={websiteData.company} />

      {/* Main Single Page Content */}
      <main>
        {/* 1. Hero Section with Prominent AT6 Crane Photo & Specs */}
        <Hero
          hero={websiteData.hero}
          company={websiteData.company}
          onOpenLightbox={handleOpenLightbox}
        />

        {/* 2. Drie Meest Recente Projecten */}
        <RecentProjects
          projects={websiteData.projects}
          onOpenLightbox={handleOpenLightbox}
        />

        {/* 3. Algemene Voorwaarden */}
        <TermsAndConditions
          terms={websiteData.terms}
          company={websiteData.company}
        />
      </main>

      {/* 4. Direct Contact Footer (Phone numbers only, no forms) */}
      <ContactFooter company={websiteData.company} />

      {/* Fullscreen Photo Lightbox Modal */}
      <LightboxModal
        isOpen={lightboxState.isOpen}
        imageUrl={lightboxState.imageUrl}
        title={lightboxState.title}
        onClose={handleCloseLightbox}
      />
    </div>
  );
}
