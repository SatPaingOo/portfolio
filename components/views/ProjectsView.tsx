import React from 'react';
import { PORTFOLIO_DATA } from '../../constants';
import { Project } from '../../types';

/** How many chips fit on one line before the rest collapse into a counter. */
const TECH_SHOWN = 5;

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h4 className="mb-1 text-[10px] font-mono uppercase tracking-[0.18em] text-holo-400">{children}</h4>
);

const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const shown = project.technologies.slice(0, TECH_SHOWN);
  const hidden = project.technologies.length - shown.length;
  const hasLinks = Boolean(project.links.liveDemo || project.links.github);

  return (
    // h-full + flex-col is what makes the rows line up: the grid stretches every
    // card to the tallest in its row, the body takes the slack, and the action
    // row lands on a shared baseline. Without the flex column, mt-auto is inert.
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl glass-panel p-5 transition-colors duration-300 hover:bg-holo-950/40 focus-within:bg-holo-950/40">
      {/* Corner ticks, inset so they read as a frame rather than clipped pixels. */}
      <span aria-hidden="true" className="pointer-events-none absolute left-2 top-2 h-2.5 w-2.5 border-l border-t border-holo-500/70 transition-colors group-hover:border-holo-300" />
      <span aria-hidden="true" className="pointer-events-none absolute right-2 top-2 h-2.5 w-2.5 border-r border-t border-holo-500/70 transition-colors group-hover:border-holo-300" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-2 left-2 h-2.5 w-2.5 border-b border-l border-holo-500/70 transition-colors group-hover:border-holo-300" />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-2 right-2 h-2.5 w-2.5 border-b border-r border-holo-500/70 transition-colors group-hover:border-holo-300" />

      {/* Header — fixed shape across every card */}
      <header className="mb-4 border-b border-holo-800/70 pb-3">
        <span className="font-mono text-[11px] tracking-[0.2em] text-holo-500">
          NODE {String(index + 1).padStart(2, '0')}
        </span>
        <h3 className="mt-1 line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-snug text-white transition-colors group-hover:text-holo-100">
          {project.title}
        </h3>
        <p className="line-clamp-1 font-mono text-xs text-holo-300">{project.role}</p>
      </header>

      {/* Body — every paragraph clamped so one long entry cannot stretch a row */}
      <div className="space-y-3 text-sm leading-relaxed text-gray-300">
        <div>
          <SectionLabel>Challenge</SectionLabel>
          <p className="line-clamp-3" title={project.challenge}>{project.challenge}</p>
        </div>
        <div>
          <SectionLabel>Solution</SectionLabel>
          <p className="line-clamp-3" title={project.solution}>{project.solution}</p>
        </div>
      </div>

      <div className="mt-3 rounded border-l-2 border-holo-400 bg-holo-900/30 px-3 py-2">
        <SectionLabel>Impact</SectionLabel>
        <p className="line-clamp-3 text-sm font-semibold leading-relaxed text-holo-100" title={project.metrics}>
          {project.metrics}
        </p>
      </div>

      {/* Spacer: absorbs the height difference instead of leaving a void at the
          bottom of the shorter cards. */}
      <div className="flex-1" />

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {shown.map((tech) => (
          <li key={tech} className="rounded bg-holo-900/50 px-2 py-0.5 font-mono text-[11px] text-holo-200">
            {tech}
          </li>
        ))}
        {hidden > 0 && (
          <li
            className="rounded border border-holo-800 px-2 py-0.5 font-mono text-[11px] text-holo-400"
            title={project.technologies.slice(TECH_SHOWN).join(', ')}
          >
            +{hidden} more
          </li>
        )}
      </ul>

      {/* Footer is always rendered, so the bottom rule sits at the same height on
          every card even when a project has no public links. */}
      <footer className="mt-4 flex gap-2 border-t border-holo-800/70 pt-4">
        {hasLinks ? (
          <>
            {project.links.liveDemo && (
              <a
                href={project.links.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 flex-1 items-center justify-center rounded border border-holo-500 bg-holo-600/20 text-xs font-bold uppercase tracking-wider text-holo-100 transition-colors hover:bg-holo-500/40 hover:text-white"
              >
                {/npmjs\.com/.test(project.links.liveDemo) ? 'npm Package' : 'Live Demo'}
              </a>
            )}
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 flex-1 items-center justify-center rounded border border-gray-700 bg-black/40 text-xs font-bold uppercase tracking-wider text-gray-300 transition-colors hover:border-white hover:bg-white/10 hover:text-white"
              >
                GitHub
              </a>
            )}
          </>
        ) : (
          <p className="flex min-h-11 w-full items-center justify-center rounded border border-dashed border-holo-900 font-mono text-[11px] uppercase tracking-widest text-holo-500">
            Proprietary build, no public link
          </p>
        )}
      </footer>
    </article>
  );
};

const ProjectsView: React.FC = () => {
  const { projects } = PORTFOLIO_DATA;

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden p-4 pb-24 md:p-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h2 className="holo-text-shadow font-display text-2xl font-bold text-white sm:text-3xl md:text-4xl">
            PROJECT NODES
          </h2>
          <p className="mt-2 border-l-2 border-holo-500 pl-4 font-mono text-xs text-holo-300 sm:text-sm">
            // ACCESSING ARCHIVE...
            <br />
            // {projects.length} RECORDS FOUND
          </p>
        </header>

        <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project: Project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsView;
