import { Module } from '@nestjs/common';

import { IngestionService } from './ingestion.service';
import { QuestDBModule } from '../questbd/questdb.module';

@Module({
  imports: [QuestDBModule],
  providers: [IngestionService],
})
export class IngestionModule {}