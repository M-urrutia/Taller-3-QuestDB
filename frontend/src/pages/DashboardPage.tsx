import { useEffect, useState } from 'react';
import { api } from '../services/api';
import DashboardCards from '../components/DashboardCards';

export default function DashboardPage() {

  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const response = await api.get('/dashboard/summary');
    setSummary(response.data);
  }

  if (!summary) return <h1>Cargando...</h1>;

  return (
    <div style={{ padding: 30 , background: '#0f172a' }}>
      <h1>Dashboard Principal</h1>

      <DashboardCards summary={summary} />
    </div>
  );
}