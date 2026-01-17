import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { PORTFOLIO_DATA } from '../../constants';

// Mapping levels to numbers for chart
const levelMap: { [key: string]: number } = {
    "Familiar": 50,
    "Proficient": 75,
    "Expert": 100,
};

// Flatten skills for display - select key skills to avoid overcrowding
const getAllSkills = () => {
    const { coreLanguages, frontendFrameworks, backendAndDevOps } = PORTFOLIO_DATA.skills;

    // Select key representative skills from each category to avoid label overlap
    // Priority: Core languages + most important frontend/backend skills
    const selectedSkills = [
        ...coreLanguages, // All 3 core languages
        frontendFrameworks.find(s => s.name === 'React'),
        frontendFrameworks.find(s => s.name === 'Next.js'),
        frontendFrameworks.find(s => s.name === 'Bootstrap'),
        frontendFrameworks.find(s => s.name === 'Tailwind CSS'),
        backendAndDevOps.find(s => s.name === 'Node.js'),
        backendAndDevOps.find(s => s.name === 'C# / .NET'),
        backendAndDevOps.find(s => s.name === '.NET Core'),
        backendAndDevOps.find(s => s.name === 'MS SQL Server')
    ].filter(Boolean); // Remove undefined values

    // Map skill names to shorter versions for chart display to prevent overlap
    const nameMap: { [key: string]: string } = {
        'JavaScript/TypeScript': 'JS/TS',
        'C# / .NET': 'C#/.NET',
        'Tailwind CSS': 'Tailwind',
        'MS SQL Server': 'SQL Server'
    };

    return selectedSkills.map(s => ({
        subject: nameMap[s.name] || s.name,
        A: levelMap[s.level] || 50,
        fullMark: 100
    })).slice(0, 10); // Limit to top 10 for visual clarity in this demo
};

const SkillsView: React.FC = () => {
    const data = getAllSkills();

    return (
        <div className="w-full h-full flex flex-col items-center justify-start p-3 sm:p-4 md:p-10 pb-24 overflow-y-auto overflow-x-hidden">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-2 holo-text-shadow text-center px-2">
                SKILL MATRIX PROJECTION
            </h2>
            <p className="text-holo-300 font-mono mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm text-center px-2">
          // ANALYZING PROFICIENCY LEVELS...
            </p>

            <div className="w-full max-w-4xl min-h-[380px] h-[380px] sm:min-h-[420px] sm:h-[420px] md:min-h-[500px] md:h-[500px] glass-panel rounded-2xl p-3 sm:p-4 relative overflow-visible">
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-col gap-1.5 sm:gap-2 z-10 bg-black/40 backdrop-blur-sm rounded px-2 py-1">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-holo-500/50 border border-holo-400 flex-shrink-0"></div>
                        <span className="text-[10px] sm:text-xs text-holo-200 font-mono whitespace-nowrap">Expert (100)</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-holo-500/30 border border-holo-400 flex-shrink-0"></div>
                        <span className="text-[10px] sm:text-xs text-holo-200 font-mono whitespace-nowrap">Proficient (75)</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-holo-500/10 border border-holo-400 flex-shrink-0"></div>
                        <span className="text-[10px] sm:text-xs text-holo-200 font-mono whitespace-nowrap">Familiar (50)</span>
                    </div>
                </div>

                {data && data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                        <RadarChart
                            cx="50%"
                            cy="50%"
                            outerRadius="70%"
                            data={data}
                            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                        >
                            <PolarGrid stroke="#005870" />
                            <PolarAngleAxis
                                dataKey="subject"
                                tick={{
                                    fill: '#80ebff',
                                    fontSize: 11,
                                    fontFamily: 'Rajdhani'
                                }}
                                tickLine={false}
                            />
                            <PolarRadiusAxis
                                angle={30}
                                domain={[0, 100]}
                                tick={false}
                                axisLine={false}
                            />
                            <Radar
                                name="Proficiency"
                                dataKey="A"
                                stroke="#38dfff"
                                strokeWidth={3}
                                fill="#00c8f5"
                                fillOpacity={0.4}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'rgba(2, 6, 23, 0.9)',
                                    borderColor: '#0086aa',
                                    color: '#fff',
                                    fontSize: '12px'
                                }}
                                itemStyle={{ color: '#38dfff' }}
                            />
                        </RadarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-holo-400 font-mono text-sm">Loading chart data...</p>
                    </div>
                )}
            </div>

            <div className="mt-4 sm:mt-6 md:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl px-2">
                {Object.entries(PORTFOLIO_DATA.skills).map(([category, items]) => (
                    <div key={category} className="glass-panel p-3 sm:p-4 rounded border-t-2 border-holo-600">
                        <h3 className="text-holo-400 font-display font-bold uppercase text-xs sm:text-sm mb-2 sm:mb-3 border-b border-holo-800 pb-1 break-words">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <ul className="space-y-1">
                            {items.map((skill) => (
                                <li key={skill.name} className="flex justify-between items-start sm:items-center gap-2 text-[10px] sm:text-xs font-mono">
                                    <span className="text-gray-300 break-words flex-1 min-w-0">{skill.name}</span>
                                    <span className={`
                                    px-1 rounded flex-shrink-0
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