import { Module } from '@nestjs/common';
import { QuestDBService } from './questdb.service';

@Module({
  providers: [QuestDBService],
  exports: [QuestDBService],
})
export class QuestDBModule {}