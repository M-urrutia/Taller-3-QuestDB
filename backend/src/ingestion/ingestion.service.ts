import { Injectable, OnModuleInit } from '@nestjs/common';
import { QuestDBService } from '../questbd/questdb.service';

@Injectable()
export class IngestionService implements OnModuleInit {

  constructor(
    private readonly questdb: QuestDBService
  ) {}

  /**
   * Se ejecuta automáticamente cuando inicia el módulo
   */
  async onModuleInit() {
    await this.checkAndLoad();
  }

  /**
   * Verifica si ya existen datos en compras_raw.
   * Si no existen, carga el CSV.
   */
  async checkAndLoad() {

    const client = this.questdb.getClient();

    const result = await client.query(`
      SELECT count(*) as total
      FROM compras_raw
    `);

    const total = Number(result.rows[0].total);

    // Si ya existen datos, no vuelve a cargar
    if (total > 0) {
      console.log('Datos ya cargados');
      return;
    }

    console.log('No hay datos, cargando CSV...');

    await this.loadCsv();
  }

  /**
   * Espera hasta que una tabla tenga registros.
   * Esto evita usar setTimeout "a ciegas".
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
   * Carga el archivo CSV en compras_raw
   */
  async loadCsv() {

    const client = this.questdb.getClient();

    console.log('Limpiando tabla compras_raw...');

    // Limpia tabla temporal
    await client.query(`
      TRUNCATE TABLE compras_raw
    `);

    console.log('Importando CSV...');

    // Importa CSV
    await client.query(`
      COPY compras_raw
      FROM 'compras.csv'
      WITH HEADER TRUE
    `);

    console.log('COPY ejecutado');

    // Espera hasta que existan registros reales
    await this.waitForRows('compras_raw');

    console.log('CSV cargado correctamente');

    // Construye tabla final
    await this.finalTable();
  }

  /**
   * Llena la tabla final "compras"
   * usando los datos de compras_raw
   */
  async finalTable() {

    const client = this.questdb.getClient();

    console.log('Creando tabla final...');

    // Limpia tabla final
    await client.query(`
      TRUNCATE TABLE compras
    `);

    console.log('Insertando datos procesados...');

    // Inserta datos transformados
    await client.query(`
      INSERT INTO compras
      SELECT

        usuarioid,
        edad,
        ciudad,
        producto,
        categoria,
        precio,

        -- Construcción del timestamp completo
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

    // Verifica que la tabla final tenga datos
    await this.waitForRows('compras');

    console.log('Tabla compras creada correctamente');
  }
}