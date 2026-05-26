import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  /**
   * Endpoint GET /dashboard/summary
   * Retorna un resumen de las métricas principales del dashboard:
   * - Cantidad total de ventas
   * - Total de ventas en dinero
   * - Promedio de gasto por compra
   * - Categoría más vendida
   * - Producto más vendido
   * - Ciudad con más compras
   * - Método de pago más usado
   */
  @Get('summary')
  getSummary() {
    return this.dashboard.getSummary();
  }

  /**
   * Endpoint GET /dashboard/analytics
   * Retorna datos analíticos filtrados según los parámetros proporcionados.
   * @param filters - Objeto con filtros opcionales: ciudad, categoria, metodopago, fechaDesde, fechaHasta
   * @returns Análisis agrupado por: categorías, ciudades, edades, fechas, productos, métodos de pago
   */
  @Get('analytics')
  getAnalytics(@Query() filters: any) {
    return this.dashboard.getAnalytics(filters);
  }
}