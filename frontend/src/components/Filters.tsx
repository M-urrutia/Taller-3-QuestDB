import { useState } from 'react';
import type { ChangeEvent } from 'react';

export default function Filters({ setFilters }: { setFilters: (filters: any) => void }) {

  const [localFilters, setLocalFilters] = useState({
    ciudad: '',
    categoria: '',
    metodopago: '',
    fecha: '',
  });

  function handleChange(e: ChangeEvent<HTMLInputElement>) {

    const updated = {
      ...localFilters,
      [e.target.name]: e.target.value,
    };

    setLocalFilters(updated);
    setFilters(updated);
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: 15,
        marginBottom: 30,
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}
    >
      <input
        name="ciudad"
        placeholder="Ciudad"
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
        name="fecha"
        onChange={handleChange}
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          fontSize: '16px',
          minWidth: '120px',
        }}
      />
    </div>
  );
}