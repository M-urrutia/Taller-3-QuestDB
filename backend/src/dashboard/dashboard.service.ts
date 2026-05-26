import { Injectable } from '@nestjs/common';
import { QuestDBService } from '../questbd/questdb.service';

@Injectable()
export class DashboardService {

  constructor(private readonly questdb: QuestDBService) {}

  /**
   * Obtiene un resumen estadístico de todas las compras.
   * Ejecuta múltiples queries a QuestDB para calcular:
   * - Cantidad total de ventas
   * - Total de ventas (suma de precios)
   * - Promedio de gasto
   * - Categoría con más ventas
   * - Producto más vendido
   * - Ciudad con más compras
   * - Método de pago más usado
   * @returns Objeto con todas las métricas de resumen
   */
  async getSummary() {

    const client = this.questdb.getClient();

    const cantVentas = await client.query(`
      SELECT COUNT(*) total
      FROM compras
    `);
    console.log('cantVentas', cantVentas.rows[0]?.total);

    const totalVentas = await client.query(`
      SELECT SUM(precio) total
      FROM compras
    `);
    console.log('totalVentas', totalVentas.rows[0]?.total);

    const promedioGasto = await client.query(`
      SELECT AVG(precio) promedio
      FROM compras
    `);
    
    const categoriaMasVendida = await client.query(`
      SELECT categoria
      FROM compras
      GROUP BY categoria
      ORDER BY COUNT(*) DESC
      LIMIT 1
    `);

    const productoMasVendido = await client.query(`
      SELECT producto
      FROM compras
      GROUP BY producto
      ORDER BY COUNT(*) DESC
      LIMIT 1
    `);

    const ciudadMasCompras = await client.query(`
      SELECT ciudad
      FROM compras
      GROUP BY ciudad
      ORDER BY COUNT(*) DESC
      LIMIT 1
    `);

    const metodoPagoMasUsado = await client.query(`
      SELECT metodopago
      FROM compras
      GROUP BY metodopago
      ORDER BY COUNT(*) DESC
      LIMIT 1
    `);
    return {
      cantVentas: cantVentas.rows[0]?.total || 0,
      totalVentas: totalVentas.rows[0]?.total || 0,
      promedioGasto: promedioGasto.rows[0]?.promedio || 0,
      categoriaMasVendida: categoriaMasVendida.rows[0]?.categoria || null,
      productoMasVendido: productoMasVendido.rows[0]?.producto || null,
      ciudadMasCompras: ciudadMasCompras.rows[0]?.ciudad || null,
      metodoPagoMasUsado: metodoPagoMasUsado.rows[0]?.metodopago || null,
    };
  }

  async getAnalytics(filters: any) {
    const client = this.questdb.getClient();

    const whereClause = this.buildWhereClause(filters);

    /**
     * Obtiene análisis detallados con filtros opcionales.
     * Agrupa los datos por: categorías, ciudades, edades, fechas, productos y métodos de pago.
     * Los resultados pueden ser filtrados por:
     * - ciudad: nombre de la ciudad
     * - categoria: nombre de la categoría
     * - metodopago: método de pago utilizado
     * - fechaDesde: fecha inicial en formato YYYY-MM-DD
     * - fechaHasta: fecha final en formato YYYY-MM-DD
     * - edadDesde: edad mínima del cliente
     * - edadHasta: edad máxima del cliente
     * @param filters - Objeto con los filtros a aplicar
     * @returns Objeto con arrays de resultados agrupados por diferentes dimensiones
     */

    const categorias = await client.query(`
      SELECT categoria, COUNT(*) as count
      FROM compras
      ${whereClause}
      GROUP BY categoria
      ORDER BY count DESC
    `);

    const ciudades = await client.query(`
      SELECT ciudad, COUNT(*) as count
      FROM compras
      ${whereClause}
      GROUP BY ciudad
      ORDER BY count DESC
    `);

    const edades = await client.query(`
      SELECT edad, COUNT(*) as count
      FROM compras
      ${whereClause}
      GROUP BY edad
      ORDER BY edad ASC
    `);

    const fechas = await client.query(`
      SELECT date_trunc('day', fecha) as fecha, COUNT(*) as count
      FROM compras
      ${whereClause}
      GROUP BY date_trunc('day', fecha)
      ORDER BY fecha
    `);

    const productos = await client.query(`
      SELECT producto, COUNT(*) as count
      FROM compras
      ${whereClause}
      GROUP BY producto
      ORDER BY count ASC
    `);

    const metodosPago = await client.query(`
      SELECT metodopago, COUNT(*) as count
      FROM compras
      ${whereClause}
      GROUP BY metodopago
      ORDER BY count ASC
    `);

    return {
      categorias: categorias.rows,
      ciudades: ciudades.rows,
      edades: edades.rows,
      fechas: fechas.rows,
      productos: productos.rows,
      metodosPago: metodosPago.rows,
    };
  }

  private buildWhereClause(filters: any): string {
    /**
     * Construye la cláusula WHERE dinámica para las queries según los filtros proporcionados.
     * Verifica cada filtro y lo agrega a las condiciones SQL si está presente.
     * @param filters - Objeto con los filtros opcionales
     * @returns String con la cláusula WHERE completa, o vacío si no hay filtros
     */
    const conditions = [];

    if (filters.ciudad) {
      conditions.push(`ciudad = '${filters.ciudad}'`);
    }
    if (filters.categoria) {
      conditions.push(`categoria = '${filters.categoria}'`);
    }
    if (filters.metodopago) {
      conditions.push(`metodopago = '${filters.metodopago}'`);
    }
    if (filters.fechaDesde) {
      conditions.push(`fecha >= '${filters.fechaDesde}'`);
    }
    if (filters.fechaHasta) {
      conditions.push(`fecha <= '${filters.fechaHasta}'`);
    }

    return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
  }
}