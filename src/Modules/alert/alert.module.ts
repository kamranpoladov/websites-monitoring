import { Module } from '@nestjs/common';

import { ResponseModule } from 'Modules/response';

import { StatsModule } from '../stats';

import { AlertRepository } from './alert.repository';
import { AlertService } from './alert.service';

@Module({
  imports: [ResponseModule, StatsModule],
  providers: [AlertService, AlertRepository],
  exports: [AlertService]
})
export class AlertModule {}
