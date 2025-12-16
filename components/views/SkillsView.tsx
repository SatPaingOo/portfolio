import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { PORTFOLIO_DATA } from '../../constants';

// Mapping levels to numbers for chart
const levelMap: { [key: string]: number } = {
  "Familiar": 50,
  "Proficient": 75,
  "Expert": 100,
};

// Flatten skills for display
const getAllSkills = () => {
    const { coreLanguages, frontendFrameworks, backendAndDevOps, specialty } = PORTFOLIO_DATA.skills;
    const all = [
        ...coreLanguages.map(s => ({ ...s, category: 'Lang' })),
        ...frontendFrameworks.map(s => ({ ...s, category: 'Frontend' })),
        ...backendAndDevOps.map(s => ({ ...s, category: 'Backend' })),
        ...specialty.map(s => ({ ...s, category: 'Specialty' }))
    ];
    // Take a subset or aggregate to avoid overcrowding the chart, or just show them all
    // For a cleaner chart, let's select key technologies
    return all.map(s => ({
        subject: s.name,
        A: levelMap[s.level] || 50,
        fullMark: 100
    })).slice(0, 12); // Limit to top 12 for visual clarity in this demo
};

const SkillsView: React.FC = () => {
  const data = getAllSkills();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-10 pb-24 overflow-y-auto">
        <h2 className="text-4xl font-display font-bold text-white mb-2 holo-text-shadow">
          SKILL MATRIX PROJECTION
        </h2>
        <p className="text-holo-300 font-mono mb-8">
          // ANALYZING PROFICIENCY LEVELS...
        </p>
        
        <div className="w-full max-w-4xl h-[400px] md:h-[500px] glass-panel rounded-2xl p-4 relative">
             <div className="absolute top-4 left-4 flex flex-col gap-2">
                 <div className="flex items-center gap-2">
                     <div className="w-3 h-3 bg-holo-500/50 border border-holo-400"></div>
                     <span className="text-xs text-holo-200 font-mono">Expert (100)</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <div className="w-3 h-3 bg-holo-500/30 border border-holo-400"></div>
                     <span className="text-xs text-holo-200 font-mono">Proficient (75)</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <div className="w-3 h-3 bg-holo-500/10 border border-holo-400"></div>
                     <span className="text-xs text-holo-200 font-mono">Familiar (50)</span>
                 </div>
             </div>

             <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                <PolarGrid stroke="#005870" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#80ebff', fontSize: 12, fontFamily: 'Rajdhani' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                    name="Proficiency"
                    dataKey="A"
                    stroke="#38dfff"
                    strokeWidth={3}
                    fill="#00c8f5"
                    fillOpacity={0.4}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(2, 6, 23, 0.9)', borderColor: '#0086aa', color: '#fff' }}
                    itemStyle={{ color: '#38dfff' }}
                />
                </RadarChart>
            </ResponsiveContainer>
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
            {Object.entries(PORTFOLIO_DATA.skills).map(([category, items]) => (
                <div key={category} className="glass-panel p-4 rounded border-t-2 border-holo-600">
                    <h3 className="text-holo-400 font-display font-bold uppercase text-sm mb-3 border-b border-holo-800 pb-1">
                        {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <ul className="space-y-1">
                        {items.map((skill) => (
                            <li key={skill.name} className="flex justify-between items-center text-xs font-mono">
                                <span className="text-gray-300">{skill.name}</span>
                                <span className={`
                                    px-1 rounded
                                    ${skill.level === 'Expert' ? 'text-holo-300' : 'text-gray-500'}
                                `}>{skill.level === 'Expert' ? 'EXP' : skill.level === 'Proficient' ? 'PRO' : 'FAM'}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
  );
};

export default SkillsView;