import { Module } from '@nestjs/common';
import { QuestDBService } from './questdb.service';

/**
 * Módulo de QuestDB
 * Proporciona la conexión y servicios de base de datos para toda la aplicación.
 * 
 * Componentes:
 * - QuestDBService: 
 *   - Conecta a QuestDB (con reintentos automáticos)
 *   - Inicializa las tablas necesarias (compras_raw y compras)
 *   - Proporciona métodos para ejecutar queries
 * 
 * Exportado: true (disponible para otros módulos)
 */
@Module({
  providers: [QuestDBService],
  exports: [QuestDBService],
})
export class QuestDBModule {}