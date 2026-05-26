import { Module } from '@nestjs/common';

import { QuestDBModule } from './questbd/questdb.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { DashboardModule } from './dashboard/dashboard.module';

/**
 * Módulo Principal de la Aplicación (AppModule)
 * Importa y configura todos los módulos de la aplicación.
 * 
 * Módulos importados:
 * - QuestDBModule: Gestiona la conexión a la base de datos
 * - IngestionModule: Carga y procesa los datos del CSV
 * - DashboardModule: Proporciona endpoints para ver estadísticas y análisis
 */
@Module({
  imports: [
    QuestDBModule,
    IngestionModule,
    DashboardModule,
  ],
})
export class AppModule {}