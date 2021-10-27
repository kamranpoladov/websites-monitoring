import { Module } from '@nestjs/common';

import { ShellController } from './shell.controller';
import { ShellService } from './shell.service';

@Module({
  providers: [ShellController, ShellService],
  exports: [ShellService]
})
export class ShellModule {}
