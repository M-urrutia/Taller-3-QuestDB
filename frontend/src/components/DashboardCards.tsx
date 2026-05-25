interface Summary {
  totalVentas: any;
  promedioGasto: any;
  categoriaMasVendida: any;
  productoMasVendido: any;
  ciudadMasCompras: any;
  metodoPagoMasUsado: any;
}

export default function DashboardCards({ summary }: { summary: Summary }) {

  const cards = [
    {
      title: 'Total Ventas',
      value: summary.totalVentas,
    },
    {
      title: 'Promedio Gasto',
      value: summary.promedioGasto,
    },
    {
      title: 'Categoría Más Vendida',
      value: summary.categoriaMasVendida,
    },
    {
      title: 'Producto Más Vendido',
      value: summary.productoMasVendido,
    },
    {
      title: 'Ciudad con Más Compras',
      value: summary.ciudadMasCompras,
    },
    {
      title: 'Método de Pago Más Utilizado',
      value: summary.metodoPagoMasUsado,
    },
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 20,
      }}
    >
      {cards.map((card) => (
        <div
          key={card.title}
          style={{
            background: '#1e293b',
            color: 'white',
            padding: 20,
            borderRadius: 10,
          }}
        >
          <h3>{card.title}</h3>
          <h2>{card.value}</h2>
        </div>
      ))}
    </div>
  );
}