import React, { useState } from 'react';
import HoloBackground from './components/HoloBackground';
import ChatInterface from './components/ChatInterface';
import ProjectsView from './components/views/ProjectsView';
import SkillsView from './components/views/SkillsView';
import HistoryView from './components/views/HistoryView';
import GalleryView from './components/views/GalleryView';
import HolographicHeadView from './components/HolographicHeadView';
import { ViewMode } from './types';
import { PORTFOLIO_DATA } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.HOME);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleViewChange = (view: ViewMode) => {
    setCurrentView(view);
    setSidebarOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewMode.PROJECTS:
        return <ProjectsView />;
      case ViewMode.SKILLS:
        return <SkillsView />;
      case ViewMode.HISTORY:
        return <HistoryView />;
      case ViewMode.GALLERY:
        return <GalleryView />;
      case ViewMode.HOME:
      default:
        return (
          <div className="flex flex-col items-center h-full p-4 md:p-6 text-center z-10 justify-start pt-4 md:pt-6">
            <div className="mb-3 relative">
              <div className="flex items-center justify-center">
                 <HolographicHeadView />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-1 tracking-tighter holo-text-shadow">
              {PORTFOLIO_DATA.personalInfo.name.toUpperCase()}
            </h1>
            <p className="text-lg md:text-xl text-holo-400 font-mono tracking-widest mb-5">
              {PORTFOLIO_DATA.personalInfo.title}
            </p>

            <div className="glass-panel p-5 md:p-6 max-w-2xl text-base md:text-lg text-gray-300 leading-relaxed border-t border-b border-holo-500/50 mb-6">
               {PORTFOLIO_DATA.personalInfo.summary}
            </div>

            <div className="flex gap-4 flex-wrap justify-center">
               <button onClick={() => setCurrentView(ViewMode.PROJECTS)} className="px-6 py-2.5 md:px-8 md:py-3 bg-holo-900/50 border border-holo-500 hover:bg-holo-500 hover:text-white hover:scale-105 transition-all duration-300 rounded font-display tracking-widest uppercase text-sm md:text-base shadow-lg shadow-holo-500/20">
                  View Projects
               </button>
               <button onClick={() => setCurrentView(ViewMode.SKILLS)} className="px-6 py-2.5 md:px-8 md:py-3 bg-transparent border border-holo-700 hover:border-holo-400 hover:text-white hover:scale-105 text-holo-300 transition-all duration-300 rounded font-display tracking-widest uppercase text-sm md:text-base shadow-lg shadow-holo-500/20">
                  Tech Stack
               </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans fixed inset-0">
      <HoloBackground />

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-black/60 backdrop-blur-md border-b border-holo-900/50 z-40 flex items-center justify-between px-4 md:px-10 shadow-lg shadow-black/20">
        <div
          className="flex flex-col leading-tight cursor-pointer"
          onClick={() => handleViewChange(ViewMode.HOME)}
        >
          <span className="text-holo-400 font-display font-bold text-xl hover:text-white transition-colors">
            SPO.SYS
          </span>
          <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-holo-700">
            Aura portfolio for Sat Paing Oo
          </span>
        </div>

        {/* Hamburger button - mobile only */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden text-holo-400 hover:text-white transition-colors p-2"
          aria-label="Toggle navigation"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop nav - hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex gap-6">
            {Object.values(ViewMode).map((mode) => (
              <button
                key={mode}
                onClick={() => handleViewChange(mode)}
                className={`text-sm tracking-widest font-mono uppercase transition-all ${
                  currentView === mode
                    ? 'text-white border-b-2 border-holo-400'
                    : 'text-gray-500 hover:text-holo-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-holo-900/80">
            <a
              href={PORTFOLIO_DATA.personalInfo.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-widest text-holo-300 hover:text-white transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={PORTFOLIO_DATA.personalInfo.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono uppercase tracking-widest text-holo-300 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Mobile overlay (click to close) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black/95 backdrop-blur-md border-r border-holo-900/50 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full pt-16 px-6">
          <div className="mb-8 pb-6 border-b border-holo-900/50">
            <h2 className="text-holo-400 font-display font-bold text-lg mb-1">
              SPO.SYS
            </h2>
            <p className="text-[10px] font-mono uppercase tracking-widest text-holo-700">
              Navigation
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {Object.values(ViewMode).map((mode) => (
              <button
                key={mode}
                onClick={() => handleViewChange(mode)}
                className={`text-left px-4 py-3 rounded border transition-all ${
                  currentView === mode
                    ? 'bg-holo-900/50 border-holo-400 text-white'
                    : 'border-holo-900/50 text-gray-400 hover:border-holo-500 hover:text-holo-300'
                }`}
              >
                <span className="font-mono uppercase tracking-widest text-sm">
                  {mode}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-auto pt-6 border-t border-holo-900/50 pb-6">
            <a
              href={PORTFOLIO_DATA.personalInfo.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-holo-300 hover:text-white transition-colors font-mono uppercase tracking-widest text-xs mb-2"
            >
              LinkedIn
            </a>
            <a
              href={PORTFOLIO_DATA.personalInfo.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-holo-300 hover:text-white transition-colors font-mono uppercase tracking-widest text-xs"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="pt-14 w-full h-full relative overflow-y-auto">
        {renderView()}
      </main>

      {/* Aura Chat Interface */}
      <ChatInterface onViewChange={handleViewChange} />
    </div>
  );
};

export default App;