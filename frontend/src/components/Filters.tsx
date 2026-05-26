import { useState } from 'react';
import type { ChangeEvent } from 'react';

export default function Filters({ setFilters }: { setFilters: (filters: any) => void }) {

  const [localFilters, setLocalFilters] = useState({
    ciudad: '',
    categoria: '',
    metodopago: '',
    fechaDesde: '',
    fechaHasta: '',
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const updated = {
      ...localFilters,
      [e.target.name]: e.target.value,
    };
    setLocalFilters(updated);
  }

  function handleApplyFilters() {
    setFilters(localFilters);
  }

  function handleClearFilters() {
    const cleared = {
      ciudad: '',
      categoria: '',
      metodopago: '',
      fechaDesde: '',
      fechaHasta: '',
    };
    setLocalFilters(cleared);
    setFilters(cleared);
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 15,
        marginBottom: 30,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <input
        name="ciudad"
        placeholder="Ciudad"
        value={localFilters.ciudad}
        onChange={handleChange}
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          fontSize: '16px',
          minWidth: '120px',
        }}
      />

      <input
        name="categoria"
        placeholder="Categoría"
        value={localFilters.categoria}
        onChange={handleChange}
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          fontSize: '16px',
          minWidth: '120px',
        }}
      />

      <input
        name="metodopago"
        placeholder="Método Pago"
        value={localFilters.metodopago}
        onChange={handleChange}
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          fontSize: '16px',
          minWidth: '120px',
        }}
      />

      <input
        type="date"
        name="fechaDesde"
        placeholder="Fecha Desde"
        value={localFilters.fechaDesde}
        onChange={handleChange}
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          fontSize: '16px',
          minWidth: '120px',
        }}
      />

      <input
        type="date"
        name="fechaHasta"
        placeholder="Fecha Hasta"
        value={localFilters.fechaHasta}
        onChange={handleChange}
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          fontSize: '16px',
          minWidth: '120px',
        }}
      />

      <button
        onClick={handleApplyFilters}
        style={{
          padding: '10px 20px',
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          minWidth: '100px',
        }}
      >
        Aplicar
      </button>

      <button
        onClick={handleClearFilters}
        style={{
          padding: '10px 20px',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          minWidth: '100px',
        }}
      >
        Limpiar
      </button>
    </div>
  );
}