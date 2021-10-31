import { Command, Console } from 'nestjs-console';

import { ShellService } from './shell.service';

@Console()
export class ShellController {
  constructor(private readonly shellService: ShellService) {}

  @Command({
    command: 'shell'
  })
  public shell() {
    return this.shellService.bootstrap();
  }

  @Command({
    command: 'errors'
  })
  public errors() {
    this.shellService.traceErrors();
  }
}
