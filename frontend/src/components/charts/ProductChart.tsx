import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

export default function ProductChart({ data }: { data: any }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#999', padding: '40px 20px' }}>
        <p>No hay datos disponibles</p>
      </div>
    );
  }

  const counts = data.map((item: any) => item.count);
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);
  const yDomain = [Math.max(0, minCount - 100), maxCount + 100];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: 20,
        color: 'white',
        fontSize: '18px',
        fontWeight: '600',
        margin: '0 0 20px 0'
      }}>
        🛍️ Productos Más Vendidos
      </h2>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="producto" />
            <YAxis domain={yDomain} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px'
              }}
            />
            <Bar dataKey="count" fill="#FFA07A" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}