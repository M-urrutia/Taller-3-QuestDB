import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
} from 'recharts';

export default function CategoryChart({ data }: { data: any }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#999', padding: '40px 20px' }}>
        <p>No hay datos disponibles</p>
      </div>
    );
  }

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

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
        📊 Ventas por Categoría
      </h2>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="categoria"
              outerRadius={80}
              fill="#8884d8"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {data.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}