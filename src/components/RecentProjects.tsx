import React from 'react';
import { Calendar, MapPin, Check, Maximize2, HardHat, Award } from 'lucide-react';
import { ProjectItem } from '../types';

interface RecentProjectsProps {
  projects: ProjectItem[];
  onOpenLightbox: (imageUrl: string, title: string) => void;
}

export const RecentProjects: React.FC<RecentProjectsProps> = ({ projects, onOpenLightbox }) => {
  return (
    <section className="py-16 sm:py-20 bg-slate-950 text-slate-100 border-t border-slate-800" id="recente-projecten">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
              <HardHat className="w-4 h-4" />
              <span>Praktijkvoorbeelden</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Drie Meest Recente Projecten
            </h2>
            <p className="text-slate-400 text-base max-w-2xl">
              Bekijk hieronder recente hijswerkzaamheden die door VIERBACH met de AT6 mobiele hijskraan succesvol en veilig zijn uitgevoerd.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs text-slate-300 self-start md:self-auto">
            <Award className="w-4 h-4 text-amber-400" />
            <span>100% VCA gecertificeerd & gekeurd</span>
          </div>
        </div>

        {/* 3 Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden flex flex-col transition-all hover:border-slate-700 hover:shadow-xl group"
              id={`project-card-${project.id}`}
            >
              {/* Project Image Box */}
              <div className="relative h-60 sm:h-64 overflow-hidden bg-slate-950">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />

                {/* Lightbox Trigger */}
                <button
                  onClick={() => onOpenLightbox(project.imageUrl, project.title)}
                  className="absolute top-3 right-3 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-lg backdrop-blur border border-slate-700 transition-colors"
                  title="Vergroot foto"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                {/* Badge */}
                <span className="absolute bottom-3 left-3 bg-amber-400 text-slate-950 font-extrabold text-xs px-2.5 py-1 rounded shadow-sm">
                  {project.clientOrType}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Date & Location */}
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      {project.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      {project.location}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Project Specs Tags */}
                {project.specs && project.specs.length > 0 && (
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Specificaties
                    </span>
                    <ul className="space-y-1">
                      {project.specs.map((spec, sIdx) => (
                        <li key={sIdx} className="text-xs text-slate-300 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
