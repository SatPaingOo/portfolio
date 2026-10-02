import React, { useCallback, useEffect, useState } from 'react';
import HoloBackground from './components/HoloBackground';
import ChatInterface from './components/ChatInterface';
import ProjectsView from './components/views/ProjectsView';
import SkillsView from './components/views/SkillsView';
import HistoryView from './components/views/HistoryView';
import GalleryView from './components/views/GalleryView';
import HeroHead from './components/HeroHead';
import { ViewMode } from './types';
import { PORTFOLIO_DATA } from './constants';

/**
 * The view lives in the URL, so a view can be linked to, bookmarked and
 * reached with the back button. A hash is used rather than a path because
 * GitHub Pages serves static files and cannot rewrite unknown paths to
 * index.html.
 */
const viewFromHash = (hash: string): ViewMode => {
  const name = hash.replace(/^#\/?/, '').toUpperCase();
  return (Object.values(ViewMode) as string[]).includes(name) ? (name as ViewMode) : ViewMode.HOME;
};

const hashForView = (view: ViewMode): string => (view === ViewMode.HOME ? '#/' : `#/${view.toLowerCase()}`);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(() =>
    viewFromHash(typeof window === 'undefined' ? '' : window.location.hash),
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const drawerRef = React.useRef<HTMLDivElement>(null);

  // Opening the drawer moves focus into it and Escape closes it, so it behaves
  // like the dialog it looks like rather than a panel the keyboard cannot use.
  useEffect(() => {
    if (!sidebarOpen) return;
    drawerRef.current?.querySelector('button')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sidebarOpen]);

  const handleViewChange = useCallback((view: ViewMode) => {
    setCurrentView(view);
    setSidebarOpen(false);
    if (window.location.hash !== hashForView(view)) {
      window.history.pushState(null, '', hashForView(view));
    }
  }, []);

  // Back and forward move between views rather than leaving the site.
  useEffect(() => {
    const sync = () => setCurrentView(viewFromHash(window.location.hash));
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

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
          /* min-h-full rather than h-full: short windows let the column grow and
             scroll instead of overflowing a fixed box, tall ones centre it. The
             bottom padding keeps the buttons clear of the viewport edge and of
             the collapsed AURA bubble. */
          <div className="flex min-h-full flex-col items-center justify-center gap-2 px-4 pt-2 pb-20 text-center z-10 sm:gap-4 sm:pt-6 sm:pb-12 md:px-6">
            {/* Below lg this group owns the first screen, so the name and both
                calls to action sit above the AURA sheet rather than under it,
                and the summary begins on the next scroll instead of being cut
                in half. At lg the wrapper dissolves with `contents` and the
                explicit orders restore the original reading order. */}
            <div className="flex w-full flex-col items-center justify-start gap-2 max-lg:min-h-[calc(100dvh-3.5rem)] sm:gap-4 lg:contents">
              <HeroHead />

              <h1 className="lg:order-2 text-4xl md:text-6xl font-display font-bold text-white tracking-tighter holo-text-shadow">
                {PORTFOLIO_DATA.personalInfo.name.toUpperCase()}
              </h1>

              <p className="lg:order-3 text-balance font-mono text-base tracking-wider text-holo-400 sm:text-lg sm:tracking-widest md:text-xl">
                {PORTFOLIO_DATA.personalInfo.title}
              </p>

              <div className="lg:order-5 mt-1 flex w-full max-w-md flex-row justify-center gap-3 sm:max-w-none sm:gap-4">
                <button
                  onClick={() => handleViewChange(ViewMode.PROJECTS)}
                  className="min-h-11 flex-1 px-4 py-2.5 sm:px-6 md:px-8 bg-holo-900/50 border border-holo-500 hover:bg-holo-500 hover:text-white hover:scale-105 transition-all duration-300 rounded font-display tracking-widest uppercase text-sm md:text-base shadow-lg shadow-holo-500/20 sm:min-w-[190px]"
                >
                  View Projects
                </button>
                <button
                  onClick={() => handleViewChange(ViewMode.SKILLS)}
                  className="min-h-11 flex-1 px-4 py-2.5 sm:px-6 md:px-8 bg-transparent border border-holo-700 hover:border-holo-400 hover:text-white hover:scale-105 text-holo-300 transition-all duration-300 rounded font-display tracking-widest uppercase text-sm md:text-base shadow-lg shadow-holo-500/20 sm:min-w-[190px]"
                >
                  Tech Stack
                </button>
              </div>
            </div>

            <div className="lg:order-4 glass-panel p-5 md:p-6 max-w-2xl text-base md:text-lg text-gray-300 leading-relaxed border-t border-b border-holo-500/50">
              {PORTFOLIO_DATA.personalInfo.summary}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans fixed inset-0 max-w-full">
      <HoloBackground />

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-14 bg-black/60 backdrop-blur-md border-b border-holo-900/50 z-40 flex items-center justify-between px-3 sm:px-4 md:px-10 shadow-lg shadow-black/20">
        <button
          type="button"
          className="flex min-h-11 flex-col justify-center leading-tight min-w-0 flex-shrink text-left"
          onClick={() => handleViewChange(ViewMode.HOME)}
        >
          <span className="text-holo-400 font-display font-bold text-base sm:text-lg md:text-xl hover:text-white transition-colors truncate">
            SPO.SYS
          </span>
          <span className="text-[8px] sm:text-[9px] font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-holo-400 truncate">
            Aura portfolio for Sat Paing Oo
          </span>
        </button>

        {/* Hamburger button - mobile only */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden flex min-h-11 min-w-11 items-center justify-center text-holo-400 hover:text-white transition-colors"
          aria-label="Toggle navigation"
          aria-expanded={sidebarOpen}
          aria-controls="mobile-drawer"
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
        <div className="hidden md:flex items-center gap-4 lg:gap-6 flex-shrink-0">
          <div className="flex gap-3 lg:gap-6">
            {Object.values(ViewMode).map((mode) => (
              <button
                key={mode}
                onClick={() => handleViewChange(mode)}
                className={`flex min-h-11 items-center px-1 text-xs lg:text-sm tracking-widest font-mono uppercase transition-all whitespace-nowrap ${
                  currentView === mode
                    ? 'text-white border-b-2 border-holo-400'
                    : 'text-gray-400 hover:text-holo-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 lg:gap-3 pl-3 lg:pl-4 border-l border-holo-900/80">
            <a
              href={PORTFOLIO_DATA.personalInfo.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center text-xs font-mono uppercase tracking-widest text-holo-300 hover:text-white transition-colors whitespace-nowrap"
            >
              LinkedIn
            </a>
            <a
              href={PORTFOLIO_DATA.personalInfo.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center text-xs font-mono uppercase tracking-widest text-holo-300 hover:text-white transition-colors whitespace-nowrap"
            >
              GitHub
            </a>
            <a
              href={`mailto:${PORTFOLIO_DATA.personalInfo.contact.email}`}
              className="flex min-h-11 items-center text-xs font-mono uppercase tracking-widest text-holo-300 hover:text-white transition-colors whitespace-nowrap"
            >
              E-mail
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
      {/* `invisible` when closed, so its links leave the tab order and the
          accessibility tree instead of waiting off-screen. */}
      <div
        id="mobile-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className={`fixed top-0 left-0 h-full w-[280px] max-w-[85vw] bg-black/95 backdrop-blur-md border-r border-holo-900/50 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full hidden'
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
      {/*
        The AURA panel is fixed over the page, so the page keeps room for it
        instead of letting it sit on top of the hero and the card grid. Below
        lg it is a bottom sheet and the room is below; from lg it is a corner
        window and the room is to the right, which leaves the hero centred.
      */}
      <main
        className={`pt-14 w-full h-full relative overflow-y-auto overflow-x-hidden ${
          chatOpen ? 'pb-[47dvh] sm:pb-[440px] lg:pb-0 lg:pr-[456px]' : ''
        }`}
      >
        {renderView()}
      </main>

      {/* Aura Chat Interface */}
      <ChatInterface onViewChange={handleViewChange} onOpenChange={setChatOpen} />
    </div>
  );
};

export default App;