import { Injectable } from '@nestjs/common';
import { QuestDBService } from '../questbd/questdb.service';

@Injectable()
export class DashboardService {

  constructor(private readonly questdb: QuestDBService) {}

  async getSummary() {

    const client = this.questdb.getClient();

    const totalVentas = await client.query(`
      SELECT SUM(precio) total
      FROM compras
    `);

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