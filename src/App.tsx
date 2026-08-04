import React, { useState, useEffect } from 'react';
import { WebsiteData } from './types';
import { INITIAL_WEBSITE_DATA } from './data/defaultData';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RecentProjects } from './components/RecentProjects';
import { TermsAndConditions } from './components/TermsAndConditions';
import { ContactFooter } from './components/ContactFooter';
import { CmsDrawer } from './components/CmsDrawer';
import { LightboxModal } from './components/LightboxModal';

const STORAGE_KEY = 'vierbach_website_cms_data_v1';

export default function App() {
  const [websiteData, setWebsiteData] = useState<WebsiteData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.company && parsed.hero && parsed.projects) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load saved CMS data, using default', e);
    }
    return INITIAL_WEBSITE_DATA;
  });

  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [lightboxState, setLightboxState] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
  });

  // Save changes to localStorage whenever websiteData changes
  const handleSaveData = (newData: WebsiteData) => {
    setWebsiteData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Failed to save CMS data to localStorage', e);
    }
  };

  const handleResetData = () => {
    setWebsiteData(INITIAL_WEBSITE_DATA);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear CMS localStorage', e);
    }
  };

  const handleOpenLightbox = (imageUrl: string, title: string) => {
    setLightboxState({ isOpen: true, imageUrl, title });
  };

  const handleCloseLightbox = () => {
    setLightboxState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-amber-400 selection:text-slate-950">
      {/* Sticky Navigation Header */}
      <Header
        company={websiteData.company}
        onOpenCms={() => setIsCmsOpen(true)}
        isCmsActive={isCmsOpen}
      />

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

      {/* Interactive CMS Slide-Over Editor for the Website Owner */}
      <CmsDrawer
        isOpen={isCmsOpen}
        onClose={() => setIsCmsOpen(false)}
        data={websiteData}
        onSaveData={handleSaveData}
        onResetData={handleResetData}
      />

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
