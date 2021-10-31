import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ResponseModule } from 'Modules/response';

import { ShellModule } from '../shell';

import { StatsRepository } from './stats.repository';
import { StatsService } from './stats.service';

@Module({
  imports: [ScheduleModule.forRoot(), ResponseModule, ShellModule],
  providers: [StatsService, StatsRepository],
  exports: [StatsService, StatsRepository]
})
export class StatsModule {}
