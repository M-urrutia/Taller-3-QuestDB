import { Module } from '@nestjs/common';

import { QuestDBModule } from './questbd/questdb.module';
import { IngestionModule } from './ingestion/ingestion.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    QuestDBModule,
    IngestionModule,
    DashboardModule,
  ],
})
export class AppModule {}