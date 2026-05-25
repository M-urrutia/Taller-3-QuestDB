import { Module } from '@nestjs/common';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { QuestDBModule } from '../questbd/questdb.module';

@Module({
  imports: [QuestDBModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}