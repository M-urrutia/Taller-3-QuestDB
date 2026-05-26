import { Injectable, OnModuleInit } from '@nestjs/common';
import { QuestDBService } from '../questbd/questdb.service';

@Injectable()
export class IngestionService implements OnModuleInit {
  constructor(private readonly questdb: QuestDBService) {}

  async onModuleInit() {
    await this.checkAndLoad();
  }

  /**
   * Verifica si la tabla compras_raw ya contiene datos.
   * Si no existen datos, inicia el proceso de carga del archivo CSV.
   * Si ya existen, evita cargar duplicados.
   */
  async checkAndLoad() {
    const client = this.questdb.getClient();

    const result = await client.query(`
      SELECT count(*) FROM compras_raw
    `);

    const total = Number(result.rows[0].count);

    if (total > 0) {
      console.log('Datos ya cargados');
      return;
    }

    console.log('Cargando CSV...');
    await this.loadCsv();
  }

  /**
   * Espera de forma activa hasta que una tabla tenga registros.
   * Consulta cada 500ms el conteo de registros en la tabla.
   * Esto evita usar setTimeout "a ciegas" y asegura que los datos estén realmente listos.
   */
  async waitForRows(table: string) {

    const client = this.questdb.getClient();

    while (true) {

      const result = await client.query(`
        SELECT count(*) as total
        FROM ${table}
      `);

      const total = Number(result.rows[0].total);

      console.log(`Esperando datos en ${table}... Registros actuales: ${total}`);

      // Si ya hay registros, termina la espera
      if (total > 0) {
        console.log(`La tabla ${table} ya tiene datos`);
        return;
      }

      // Espera 500ms antes de volver a consultar
      await new Promise(f => setTimeout(f, 500));
    }
  }

  /**
   * Carga el archivo CSV (compras.csv) en la tabla compras_raw.
   * Proceso:
   * 1. Limpia la tabla compras_raw
   * 2. Ejecuta COPY para importar el CSV con headers
   * 3. Espera a que los datos estén disponibles
   * 4. Llama a finalTable() para procesar los datos a la tabla final
   */
  async loadCsv() {
    const client = this.questdb.getClient();
    console.log('Cargando CSV...');

    await client.query(`
      TRUNCATE TABLE compras_raw
    `);
    
    await client.query(`
      COPY compras_raw
      FROM 'compras.csv'
      WITH HEADER TRUE
    `);

    await this.waitForRows('compras_raw');
    await this.finalTable();
  }

  async finalTable(){
    console.log('Creando tabla final... ahora si');
    const client = this.questdb.getClient();

    await client.query(`
      TRUNCATE TABLE compras
    `);

    await client.query(`
      INSERT INTO compras
        SELECT
          usuarioid,
          edad,
          ciudad,
          producto,
          categoria,
          precio,

          dateadd(
            's',

            cast(split_part(hora, ':', 1) as int) * 3600 +
            cast(split_part(hora, ':', 2) as int) * 60 +
            cast(split_part(hora, ':', 3) as int),

            fecha
          ),

          metodopago

        FROM compras_raw
    `);

  }
}
