import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ResponseModule } from 'Modules/response';

import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [ScheduleModule.forRoot(), ResponseModule],
  providers: [StatsController, StatsService],
  exports: [StatsService]
})
export class StatsModule {}
