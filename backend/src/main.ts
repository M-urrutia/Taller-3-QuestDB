import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Inicializa la aplicación NestJS con configuración básica.
 * - Crea la instancia de la aplicación
 * - Habilita CORS para permitir solicitudes desde el frontend
 * - Inicia el servidor en el puerto 3000 (o el especificado en variables de entorno)
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
