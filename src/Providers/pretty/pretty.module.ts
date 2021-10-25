import { Global, Module } from '@nestjs/common';

import { PrettyService } from './pretty.service';

@Global()
@Module({
  providers: [PrettyService],
  exports: [PrettyService]
})
export class PrettyModule {}
