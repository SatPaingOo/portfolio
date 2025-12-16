import React from 'react';

const HoloBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Dark Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,171,209,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,171,209,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Floating Particles (Simulated with CSS for performance) */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-holo-400 rounded-full blur-[2px] animate-float opacity-50"></div>
      <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-holo-300 rounded-full blur-[1px] animate-pulse-slow opacity-60"></div>
      <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-holo-500 rounded-full blur-[4px] animate-float opacity-30" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-holo-500 rounded-full blur-[100px] opacity-10"></div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-10"></div>

      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] opacity-20 pointer-events-none"></div>
    </div>
  );
};

export default HoloBackground;