import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface StatsRadarProps {
  stats: Array<{ stat: { name: string }; base_stat: number }>;
}

const StatsRadar = ({ stats }: StatsRadarProps) => {
  const data = stats.map((s) => ({
    stat: s.stat.name.replace("-", " ").toUpperCase(),
    value: s.base_stat,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis 
          dataKey="stat" 
          tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
        />
        <PolarRadiusAxis 
          angle={90} 
          domain={[0, 150]}
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <Radar
          name="Stats"
          dataKey="value"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default StatsRadar;
