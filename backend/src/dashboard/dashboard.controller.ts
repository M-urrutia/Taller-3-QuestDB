import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get('summary')
  getSummary() {
    return this.dashboard.getSummary();
  }

  @Get('analytics')
  getAnalytics(@Query() filters: any) {
    return this.dashboard.getAnalytics(filters);
  }
}