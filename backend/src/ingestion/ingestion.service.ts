import { Injectable, OnModuleInit } from '@nestjs/common';
import { QuestDBService } from '../questbd/questdb.service';

@Injectable()
export class IngestionService implements OnModuleInit {
  constructor(private readonly questdb: QuestDBService) {}

  async onModuleInit() {
    await this.checkAndLoad();
  }

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

    console.log('CSV cargado');
    console.log('Creando tabla final...');
    await this.finalTable();
  }

  async finalTable(){
    console.log('Creando tabla final... ahora si');
    const client = this.questdb.getClient();
    await new Promise(f => setTimeout(f, 3000)); // Espera 3 segundos
    console.log('pasaron 3 segundos, continuando con la creación de la tabla final');
    await client.query(`
      TRUNCATE TABLE compras
    `);
    await new Promise(f => setTimeout(f, 3000)); // Espera 3 segundos
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
