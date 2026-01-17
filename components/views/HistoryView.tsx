import React from 'react';
import { PORTFOLIO_DATA } from '../../constants';

const HistoryView: React.FC = () => {
  return (
    <div className="w-full h-full overflow-y-auto overflow-x-hidden p-3 sm:p-4 md:p-10 pb-24">
      <div className="max-w-4xl mx-auto px-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2 holo-text-shadow">
          TEMPORAL LOGS
        </h2>
        <p className="text-holo-300 font-mono mb-8 sm:mb-10 md:mb-12 text-xs sm:text-sm">
          // RETRIEVING EMPLOYMENT & EDUCATION HISTORY...
        </p>

        <div className="relative border-l-2 border-holo-800 ml-3 sm:ml-4 space-y-8 sm:space-y-10 md:space-y-12">
            {/* Employment Section */}
            <div>
                <span className="absolute -left-[18px] sm:-left-[21px] flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black border-2 border-holo-400 shadow-[0_0_10px_rgba(56,223,255,0.5)]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-holo-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175 4.613-.665 9.286-.665 13.838 0 .294.043.58.1.863.171m0 0c1.09.288 1.948 1.258 1.948 2.453v3.746a2.181 2.181 0 01-.75 1.661M12 21v-3" />
                    </svg>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white ml-6 sm:ml-8 mb-4 sm:mb-6">Employment History</h3>

                {PORTFOLIO_DATA.employmentHistory.map((job, idx) => (
                    <div key={idx} className="ml-4 sm:ml-6 md:ml-8 mb-6 sm:mb-8 relative group">
                        <div className="absolute -left-[34px] sm:-left-[38px] md:-left-[41px] top-2 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-holo-950 border border-holo-500 group-hover:bg-holo-400 transition-colors"></div>
                        <div className="glass-panel p-4 sm:p-5 md:p-6 rounded-lg border-l-4 border-l-holo-500 hover:shadow-[0_0_20px_rgba(56,223,255,0.15)] transition-all overflow-hidden">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 sm:mb-4 gap-2">
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-lg sm:text-xl font-bold text-holo-200 break-words">{job.position}</h4>
                                    <h5 className="text-base sm:text-lg text-white font-display break-words">{job.company}</h5>
                                </div>
                                <span className="mt-0 md:mt-0 px-2 sm:px-3 py-1 bg-holo-900/60 rounded text-xs sm:text-sm text-holo-300 font-mono border border-holo-800 whitespace-nowrap flex-shrink-0">
                                    {job.duration}
                                </span>
                            </div>
                            <ul className="list-disc list-inside space-y-1.5 sm:space-y-2 text-gray-300 text-xs sm:text-sm">
                                {job.responsibilities.map((resp, i) => (
                                    <li key={i} className="break-words">{resp}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            {/* Education Section */}
            <div>
                 <span className="absolute -left-[18px] sm:-left-[21px] flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black border-2 border-holo-400 shadow-[0_0_10px_rgba(56,223,255,0.5)]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-holo-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.499 5.258 50.55 50.55 0 00-2.658.813m-15.482 0A50.917 50.917 0 0012 13.489a50.917 50.917 0 007.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                    </svg>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white ml-6 sm:ml-8 mb-4 sm:mb-6">Education & Training</h3>
                 {PORTFOLIO_DATA.education.map((edu, idx) => (
                    <div key={idx} className="ml-4 sm:ml-6 md:ml-8 mb-6 sm:mb-8 relative group">
                         <div className="absolute -left-[34px] sm:-left-[38px] md:-left-[41px] top-2 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-holo-950 border border-holo-500 group-hover:bg-holo-400 transition-colors"></div>
                        <div className="glass-panel p-4 sm:p-5 md:p-6 rounded-lg border-l-4 border-l-purple-500 hover:shadow-[0_0_20px_rgba(147,51,234,0.15)] transition-all overflow-hidden">
                             <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-lg sm:text-xl font-bold text-purple-200 break-words">{edu.degree}</h4>
                                    <h5 className="text-base sm:text-lg text-white font-display break-words">{edu.institution}</h5>
                                </div>
                                <span className="mt-0 md:mt-0 px-2 sm:px-3 py-1 bg-purple-900/40 rounded text-xs sm:text-sm text-purple-300 font-mono border border-purple-800 whitespace-nowrap flex-shrink-0">
                                    {edu.duration}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Certifications Section */}
            <div>
                 <span className="absolute -left-[18px] sm:-left-[21px] flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black border-2 border-holo-400 shadow-[0_0_10px_rgba(56,223,255,0.5)]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 text-holo-300">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37L12 16.5l-3.59-2.13A2 2 0 0 1 7 12.72V7.5l5-3 5 3v5.22a2 2 0 0 1-1.41 1.65z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5v4.25m0 0l-2.5-1.5m2.5 1.5l2.5-1.5" />
                    </svg>
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white ml-6 sm:ml-8 mb-4 sm:mb-6">Certifications & Diplomas</h3>
                 {[...PORTFOLIO_DATA.certifications]
                    .sort((a, b) => (b.year || 0) - (a.year || 0))
                    .map((cert, idx) => (
                    <div key={idx} className="ml-4 sm:ml-6 md:ml-8 mb-6 sm:mb-8 relative group">
                         <div className="absolute -left-[34px] sm:-left-[38px] md:-left-[41px] top-2 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-holo-950 border border-holo-500 group-hover:bg-holo-400 transition-colors"></div>
                        <div className="glass-panel p-4 sm:p-5 md:p-6 rounded-lg border-l-4 border-l-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all overflow-hidden">
                             <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                                <div className="min-w-0 flex-1">
                                    <h4 className="text-lg sm:text-xl font-bold text-emerald-200 break-words">{cert.name}</h4>
                                    <h5 className="text-base sm:text-lg text-white font-display break-words">{cert.issuer}</h5>
                                </div>
                                <span className="mt-0 md:mt-0 px-2 sm:px-3 py-1 bg-emerald-900/40 rounded text-xs sm:text-sm text-emerald-300 font-mono border border-emerald-800 whitespace-nowrap flex-shrink-0">
                                    {cert.year}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;