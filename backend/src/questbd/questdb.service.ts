import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class QuestDBService implements OnModuleInit {
  private client: any;

  async onModuleInit() {
    await this.connectWithRetry();
    await this.initializeDatabase();
  }

  async connectWithRetry() {
    const maxRetries = 30;

    for (let i = 0; i < maxRetries; i++) {
      try {
        console.log(`Conectando a QuestDB... (${i + 1})`);

        this.client = new Client({
          host: 'questdb',
          port: 8812,
          user: 'admin',
          password: 'quest',
          database: 'qdb',
        });

        await this.client.connect();

        console.log('Conectado a QuestDB');
        return;

      } catch (error) {
        console.log('QuestDB aún no está listo...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    throw new Error('No se pudo conectar a QuestDB');
  }

  async initializeDatabase() {
    await this.client.query(`
        CREATE TABLE IF NOT EXISTS compras_raw (
            usuarioid LONG,
            edad INT,
            ciudad SYMBOL,
            producto SYMBOL,
            categoria SYMBOL,
            precio DOUBLE,
            fecha DATE,
            hora SYMBOL,
            metodopago SYMBOL
        )
    `);

    await this.client.query(`
      CREATE TABLE IF NOT EXISTS compras (
        usuarioid LONG,
        edad INT,
        ciudad SYMBOL,
        producto SYMBOL,
        categoria SYMBOL,
        precio DOUBLE,
        fecha TIMESTAMP,
        metodopago SYMBOL
      )
      timestamp(fecha)
      PARTITION BY DAY
    `);

    console.log('Tabla compras creada');
  }

  getClient() {
    return this.client;
  }
}