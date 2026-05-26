import { Module } from '@nestjs/common';

import { IngestionService } from './ingestion.service';
import { QuestDBModule } from '../questbd/questdb.module';

/**
 * Módulo de Ingesta de Datos (Ingestion)
 * Se encarga de cargar y procesar datos CSV en la base de datos.
 * 
 * Componentes:
 * - IngestionService: Ejecuta automáticamente el proceso de carga del CSV al iniciar
 *   - Verifica si ya hay datos cargados
 *   - Importa el archivo compras.csv en compras_raw
 *   - Procesa y transforma los datos a la tabla final compras
 * - Dependencia: QuestDBModule para acceso a la base de datos
 */
@Module({
  imports: [QuestDBModule],
  providers: [IngestionService],
})
export class IngestionModule {}