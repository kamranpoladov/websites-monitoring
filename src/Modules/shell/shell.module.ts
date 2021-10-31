import { Module } from '@nestjs/common';
import Vorpal from 'vorpal';

import { ShellController } from './shell.controller';
import { ShellRepository } from './shell.repository';
import { ShellService } from './shell.service';

@Module({
  providers: [ShellController, ShellService, ShellRepository, Vorpal],
  exports: [ShellService]
})
export class ShellModule {}
