import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage.tsx';
import AnalyticsPage from './pages/AnalyticsPage.tsx'; 

export default function App() {

  return (
    <BrowserRouter>

      <nav
        style={{
          display: 'flex',
          gap: 20,
          padding: 20,
          background: '#0f172a',
        }}
      >
        <Link to="/">Dashboard</Link>
        <Link to="/analytics">Analytics</Link>
      </nav>

      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
      </Routes>

    </BrowserRouter>
  );
}