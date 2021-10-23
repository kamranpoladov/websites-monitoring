import { Module } from '@nestjs/common';

import { ResponseModule } from 'Modules/response';

import { AlertRepository } from './alert.repository';
import { AlertService } from './alert.service';

@Module({
  imports: [ResponseModule],
  providers: [AlertService, AlertRepository],
  exports: [AlertService]
})
export class AlertModule {}
