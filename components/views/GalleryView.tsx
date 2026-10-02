import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { PORTFOLIO_DATA } from '../../constants';
import { GalleryPhoto } from '../../types';

const GalleryView: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  // The tile the lightbox was opened from, so focus can go back where it began.
  const openerRef = useRef<HTMLElement | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const photos = PORTFOLIO_DATA.gallery || [];
  const categories = ['All', ...Array.from(new Set(photos.map(p => p.category).filter(Boolean)))];
  const filteredPhotos = selectedCategory === 'All'
    ? photos
    : photos.filter(p => p.category === selectedCategory);

  const openPhoto = (photo: GalleryPhoto, event: React.SyntheticEvent) => {
    openerRef.current = event.currentTarget as HTMLElement;
    setSelectedPhoto(photo);
  };

  /**
   * While the lightbox is open it is the only live part of the page: the rest
   * of the app is marked `inert`, so Tab cannot walk into the nav or the chat
   * sitting behind it, and Escape closes it. The lightbox renders through a
   * portal into `body` precisely so it sits outside the subtree being frozen.
   */
  useEffect(() => {
    if (!selectedPhoto) return;

    // The shell's children -- the nav, the drawer, the main column and the
    // chat panel -- rather than the shell itself. `inert` does inherit, but
    // the attribute belongs on the regions it describes, not on the anonymous
    // wrapper above them.
    const behind = [...(document.getElementById('app-shell')?.children ?? [])] as HTMLElement[];
    for (const el of behind) {
      el.setAttribute('inert', '');
      el.setAttribute('aria-hidden', 'true');
    }
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedPhoto(null);
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      for (const el of behind) {
        el.removeAttribute('inert');
        el.removeAttribute('aria-hidden');
      }
      window.removeEventListener('keydown', onKeyDown);
      openerRef.current?.focus();
    };
  }, [selectedPhoto]);

  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-10 pb-24">
      <div className="max-w-7xl mx-auto px-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2 holo-text-shadow">
          IMAGE ARCHIVE
        </h1>
        <p className="text-holo-300 font-mono mb-6 sm:mb-8 text-xs sm:text-sm border-l-2 border-holo-500 pl-3 sm:pl-4">
          // SCANNING MEDIA FILES...<br/>
          // {photos.length} IMAGES FOUND
        </p>

        {/* Category Filter */}
        {categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                aria-pressed={selectedCategory === cat}
                className={`flex min-h-11 items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded border transition-all font-mono text-xs sm:text-sm ${
                  selectedCategory === cat
                    ? 'bg-holo-500/30 border-holo-400 text-white'
                    : 'bg-holo-900/40 border-holo-700 text-holo-300 hover:border-holo-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Photo Grid */}
        {filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredPhotos.map((photo) => (
              /* A tile is a control, so it carries a role, a tab stop, and the
                 Enter and Space keys a button would answer to. */
              <div
                key={photo.id}
                role="button"
                tabIndex={0}
                aria-label={`Open ${photo.title}`}
                onClick={(e) => openPhoto(photo, e)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openPhoto(photo, e);
                  }
                }}
                className="glass-panel rounded-xl overflow-hidden cursor-pointer group hover:scale-[1.02] transition-all duration-300 border-t-2 border-t-transparent hover:border-t-holo-400 relative"
              >
                {/* Decorative holographic corners */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-holo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-holo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-holo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-holo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {/* Shown on focus as well as hover, so a keyboard reader gets
                      the caption a pointer user gets. */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-lg mb-1">{photo.title}</h3>
                      {photo.description && (
                        <p className="text-holo-200 text-sm">{photo.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-holo-400 font-mono">
                      {photo.category || 'Uncategorized'}
                    </span>
                    {photo.date && (
                      <span className="text-xs text-holo-300 font-mono">{photo.date}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center">
            <p className="text-holo-300 font-mono">// NO IMAGES FOUND IN THIS CATEGORY</p>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            className="relative max-w-5xl max-h-[90vh] w-full glass-panel rounded-xl overflow-hidden border border-holo-500/50"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              onClick={() => setSelectedPhoto(null)}
              aria-label="Close image"
              className="absolute top-4 right-4 z-10 w-11 h-11 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white border border-holo-400 transition-colors shadow-[0_0_10px_rgba(56,223,255,0.3)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.title}
              className="w-full h-auto max-h-[70vh] object-contain"
            />
            <div className="p-6 border-t border-holo-500/30">
              <h3 id="lightbox-title" className="text-2xl font-bold text-white mb-2 holo-text-shadow">{selectedPhoto.title}</h3>
              {selectedPhoto.description && (
                <p className="text-gray-300 mb-4">{selectedPhoto.description}</p>
              )}
              <div className="flex gap-4 text-sm text-holo-300 font-mono">
                {selectedPhoto.category && (
                  <span className="px-3 py-1 bg-holo-900/40 rounded border border-holo-800">
                    Category: {selectedPhoto.category}
                  </span>
                )}
                {selectedPhoto.date && (
                  <span className="px-3 py-1 bg-holo-900/40 rounded border border-holo-800">
                    Date: {selectedPhoto.date}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
};

export default GalleryView;
