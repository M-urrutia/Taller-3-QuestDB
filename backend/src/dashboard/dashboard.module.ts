import { Module } from '@nestjs/common';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { QuestDBModule } from '../questbd/questdb.module';

/**
 * Módulo del Dashboard
 * Contiene todos los componentes relacionados con la visualización de datos y estadísticas.
 * 
 * Componentes:
 * - DashboardController: Maneja las solicitudes HTTP GET para resúmenes y análisis
 * - DashboardService: Ejecuta las queries en QuestDB y procesa los datos
 * - Dependencia: QuestDBModule para acceso a la base de datos
 */
@Module({
  imports: [QuestDBModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}