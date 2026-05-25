import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export default function DateChart({ data }: { data: any }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#999', padding: '40px 20px' }}>
        <p>No hay datos disponibles</p>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  const values = sortedData.map((item: any) => Number(item.count));
  const minCount = Math.min(...values);
  const maxCount = Math.max(...values);
  const yDomain = [Math.max(0, Math.floor(minCount * 0.95)), Math.ceil(maxCount * 1.05)];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: 20,
        color: '#1a1a1a',
        fontSize: '18px',
        fontWeight: '600',
        margin: '0 0 20px 0'
      }}>
        📅 Ventas por Fecha
      </h2>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart data={sortedData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
            <defs>
              <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff7a59" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#ff7a59" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e8eef7" vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="fecha"
              tickFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
              tick={{ fill: '#6b7c93', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              minTickGap={12}
            />
            <YAxis
              domain={yDomain}
              tickFormatter={(value: number) => value.toLocaleString('es-ES')}
              tick={{ fill: '#6b7c93', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
            <Tooltip
              cursor={{ stroke: '#ff7a59', strokeWidth: 2, opacity: 0.2 }}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                padding: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              }}
              labelFormatter={(value) => new Date(value).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
              formatter={(value: any) => [Number(value).toLocaleString('es-ES'), 'Ventas']}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#ff7a59"
              strokeWidth={3}
              fill="url(#colorVentas)"
              fillOpacity={1}
              activeDot={{ r: 5, stroke: '#ff7a59', strokeWidth: 2, fill: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}