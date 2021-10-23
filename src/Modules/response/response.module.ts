import { Module } from '@nestjs/common';

import { ResponseRepository } from './response.repository';
import { ResponseService } from './response.service';

@Module({
  providers: [ResponseService, ResponseRepository],
  exports: [ResponseService]
})
export class ResponseModule {}
