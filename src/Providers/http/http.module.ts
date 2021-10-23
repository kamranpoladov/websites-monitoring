import { Global, Module } from '@nestjs/common';
import { HttpModule as HttpModule2 } from '@nestjs/axios';

import { HttpService } from './http.service';

@Global()
@Module({
  imports: [HttpModule2.register({})],
  providers: [HttpService],
  exports: [HttpService]
})
export class HttpModule {}
