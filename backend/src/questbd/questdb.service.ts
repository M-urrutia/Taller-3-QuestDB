import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from 'pg';

@Injectable()
export class QuestDBService implements OnModuleInit {
  private client: any;

  /**
   * Hook de NestJS que se ejecuta cuando el módulo se inicializa.
   * Conecta a QuestDB e inicializa las tablas necesarias.
   */
  async onModuleInit() {
    await this.connectWithRetry();
    await this.initializeDatabase();
  }

  /**
   * Intenta conectarse a QuestDB con reintentos automáticos.
   * Realiza hasta 30 intentos de conexión con esperas de 3 segundos entre intentos.
   * Esto permite esperar a que QuestDB esté completamente listo en Docker.
   * @throws Error si no logra conectarse después de los reintentos
   */
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

  /**
   * Inicializa las tablas necesarias en QuestDB.
   * Crea dos tablas:
   * - compras_raw: tabla temporal para almacenar datos del CSV sin procesar
   * - compras: tabla final con datos procesados y particionada por día
   */
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
  /**
   * Retorna la instancia del cliente de QuestDB.
   * Permite que otros servicios ejecuten queries directamente.
   * @returns Instancia del cliente PostgreSQL conectado a QuestDB
   */
      PARTITION BY DAY
    `);

    console.log('Tabla compras creada');
  }

  getClient() {
    return this.client;
  }
}