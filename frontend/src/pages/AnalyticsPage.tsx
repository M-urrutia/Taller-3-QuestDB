import { useEffect, useState } from 'react';
import { api } from '../services/api';
import CategoryChart from '../components/charts/CategoryChart';
import CityChart from '../components/charts/CityChart';
import AgeChart from '../components/charts/AgeChart';
import DateChart from '../components/charts/DateChart';
import ProductChart from '../components/charts/ProductChart';
import PaymentChart from '../components/charts/PaymentChart';

interface Filters {
  ciudad?: string;
  categoria?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  metodopago?: string;
}

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<Filters>({});
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [filters]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/dashboard/analytics', {
        params: filters,
      });
      
      // Convertir strings a números para Recharts
      const processedData = {
        categorias: response.data.categorias?.map((item: { count: string; }) => ({ ...item, count: parseInt(item.count) })) || [],
        ciudades: response.data.ciudades?.map((item: { count: string; }) => ({ ...item, count: parseInt(item.count) })) || [],
        edades: response.data.edades?.map((item: { count: string; }) => ({ ...item, count: parseInt(item.count) })) || [],
        fechas: response.data.fechas?.map((item: { fecha: any; count: string; }) => ({ ...item, fecha: item.fecha, count: parseInt(item.count) })) || [],
        productos: response.data.productos?.map((item: { count: string; }) => ({ ...item, count: parseInt(item.count) })) || [],
        metodosPago: response.data.metodosPago?.map((item: { count: string; }) => ({ ...item, count: parseInt(item.count) })) || [],
      };
      
      setData(processedData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  // Obtener opciones únicas para los filtros
  const getUniqueOptions = (field: string) => {
    if (!data) return [];
    
    let items: any[] = [];
    switch (field) {
      case 'ciudad':
        items = data.ciudades || [];
        return [...new Set(items.map(item => item.ciudad))].sort();
      case 'categoria':
        items = data.categorias || [];
        return [...new Set(items.map(item => item.categoria))].sort();
      case 'metodopago':
        items = data.metodosPago || [];
        return [...new Set(items.map(item => item.metodopago))].sort();
      default:
        return [];
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        <h1>Cargando datos...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#d32f2f'
      }}>
        <h1>Error: {error}</h1>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        <h1>No hay datos disponibles</h1>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: 10,
          color: 'white',
          fontSize: '32px',
          fontWeight: 'bold'
        }}>
          Analytics Dashboard
        </h1>
        <p style={{
          textAlign: 'center',
          marginBottom: 40,
          color: '#666',
          fontSize: '16px'
        }}>
          Visualiza y analiza los datos de tus ventas
        </p>

        {/* Filters Section */}
        <div style={{
          background: 'black',
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '40px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0'
        }}>
          <h2 style={{
            marginBottom: 20,
            color: '#333',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Filtros
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '20px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Ciudad
              </label>
              <select
                value={filters.ciudad || ''}
                onChange={(e) => handleFilterChange('ciudad', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s',
                  backgroundColor: 'white',
                  color: '#333'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2196F3'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
              >
                <option value="">Todas las ciudades</option>
                {getUniqueOptions('ciudad').map(ciudad => (
                  <option key={ciudad} value={ciudad}>{ciudad}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Categoría
              </label>
              <select
                value={filters.categoria || ''}
                onChange={(e) => handleFilterChange('categoria', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s',
                  backgroundColor: 'white',
                  color: '#333'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2196F3'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
              >
                <option value="">Todas las categorías</option>
                {getUniqueOptions('categoria').map(categoria => (
                  <option key={categoria} value={categoria}>{categoria}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Método de Pago
              </label>
              <select
                value={filters.metodopago || ''}
                onChange={(e) => handleFilterChange('metodopago', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s',
                  backgroundColor: 'white',
                  color: '#333'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2196F3'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
              >
                <option value="">Todos los métodos</option>
                {getUniqueOptions('metodopago').map(metodo => (
                  <option key={metodo} value={metodo}>{metodo}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Fecha Desde
              </label>
              <input
                type="date"
                value={filters.fechaDesde || ''}
                onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s',
                  backgroundColor: 'white',
                  color: '#333'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2196F3'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
              />
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '8px',
                color: '#555',
                fontWeight: '500',
                fontSize: '14px'
              }}>
                Fecha Hasta
              </label>
              <input
                type="date"
                value={filters.fechaHasta || ''}
                onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s',
                  backgroundColor: 'white',
                  color: '#333'   
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#2196F3'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#ddd'}
              />
            </div>
          </div>

          <button
            onClick={handleClearFilters}
            style={{
              padding: '10px 20px',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#d32f2f'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f44336'}
          >
            Limpiar Filtros
          </button>
        </div>

        {/* Charts Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(600px, 1fr))',
          gap: '30px'
        }}>
          {/* Ventas por Categoría */}
          <div style={{
            background: 'black',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CategoryChart data={data.categorias || []} />
          </div>

          {/* Compras por Ciudad */}
          <div style={{
            background: 'black',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CityChart data={data.ciudades || []} />
          </div>

          {/* Compras por Edad */}
          <div style={{
            background: 'black',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <AgeChart data={data.edades || []} />
          </div>

          {/* Ventas por Fecha */}
          <div style={{
            background: 'black',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <DateChart data={data.fechas || []} />
          </div>

          {/* Productos Más Vendidos */}
          <div style={{
            background: 'black',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <ProductChart data={data.productos || []} />
          </div>

          {/* Métodos de Pago */}
          <div style={{
            background: 'black',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <PaymentChart data={data.metodosPago || []} />
          </div>
        </div>
      </div>
    </div>
  );
}