import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

export interface SkillDatum {
  subject: string;
  A: number;
  fullMark: number;
}

/**
 * The radar plot, split out from SkillsView so that recharts — 316 kB, a
 * third of the landing payload — is fetched when this chart is actually
 * wanted rather than on arrival at the home view.
 */
const SkillsRadar: React.FC<{ data: SkillDatum[] }> = ({ data }) => (
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
);

export default SkillsRadar;
