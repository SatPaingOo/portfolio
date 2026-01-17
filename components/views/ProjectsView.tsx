import React from 'react';
import { PORTFOLIO_DATA } from '../../constants';
import { Project } from '../../types';

const ProjectsView: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-10 pb-24">
      <div className="max-w-7xl mx-auto px-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2 holo-text-shadow">
          PROJECT NODES
        </h2>
        <p className="text-holo-300 font-mono mb-6 sm:mb-8 text-xs sm:text-sm border-l-2 border-holo-500 pl-3 sm:pl-4">
          // ACCESSING ARCHIVE...<br/>
          // {PORTFOLIO_DATA.projects.length} RECORDS FOUND
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {PORTFOLIO_DATA.projects.map((project: Project) => (
            <div 
              key={project.id} 
              className="glass-panel p-4 sm:p-5 md:p-6 rounded-xl relative group hover:bg-holo-950/50 transition-all duration-300 hover:scale-[1.02] border-t-2 border-t-transparent hover:border-t-holo-400 overflow-hidden"
            >
              {/* Decorative holographic corners */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-holo-400"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-holo-400"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-holo-400"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-holo-400"></div>

              <div className="mb-3 sm:mb-4">
                <span className="text-[10px] sm:text-xs font-mono text-holo-500 border border-holo-800 px-2 py-1 rounded bg-black/30 inline-block">ID: {String(project.id).padStart(3, '0')}</span>
                <h3 className="text-lg sm:text-xl font-bold font-sans text-white mt-2 group-hover:text-holo-200 break-words">{project.title}</h3>
                <p className="text-xs sm:text-sm text-holo-400 font-mono break-words">{project.role}</p>
              </div>

              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div>
                  <h4 className="text-[10px] sm:text-xs uppercase tracking-widest text-holo-600 mb-1">Challenge</h4>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed break-words">{project.challenge}</p>
                </div>
                <div>
                  <h4 className="text-[10px] sm:text-xs uppercase tracking-widest text-holo-600 mb-1">Solution</h4>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed break-words">{project.solution}</p>
                </div>
                <div className="bg-holo-900/30 p-2 rounded border-l-2 border-holo-500">
                  <h4 className="text-[10px] sm:text-xs uppercase tracking-widest text-holo-400 mb-1">Metrics</h4>
                  <p className="text-xs sm:text-sm text-holo-100 font-bold break-words">{project.metrics}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                {project.technologies.map((tech) => (
                  <span key={tech} className="text-[10px] sm:text-xs text-holo-300 bg-holo-900/40 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded break-words">
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-t border-holo-800 pt-3 sm:pt-4 mt-auto">
                 {project.links.liveDemo && (
                     <a
                       href={project.links.liveDemo}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex-1 text-center py-2 text-xs sm:text-sm bg-holo-600/20 hover:bg-holo-600/40 text-holo-200 border border-holo-600 rounded transition-colors uppercase font-bold tracking-wider"
                     >
                         Live Demo
                     </a>
                 )}
                 {project.links.github && (
                     <a
                       href={project.links.github}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="flex-1 text-center py-2 text-xs sm:text-sm bg-black/40 hover:bg-white/10 text-gray-300 border border-gray-700 hover:border-white rounded transition-colors uppercase font-bold tracking-wider"
                     >
                         GitHub
                     </a>
                 )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsView;