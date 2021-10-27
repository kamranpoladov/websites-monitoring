import { Injectable } from '@nestjs/common';
import { ShellFacade } from 'nestjs-shell';

import { LoggerService, PrettyService, ValidationService } from 'Providers';

import { ShellComponent } from './shell.component';

@Injectable()
export class ShellService {
  constructor(
    private readonly shellFacade: ShellFacade,
    private readonly loggerService: LoggerService
  ) {}

  public async bootstrap() {
    await this.shellFacade.bootstrap({
      prompt: '>',
      messages: {
        wrongUsage: 'Wrong usage: $command $pattern',
        notFound: 'Huh? Use "help" to see available commands'
      },
      shellPrinter: value => this.loggerService.info(value)
    });
    this.shellFacade.registerComponents(
      new ShellComponent(
        this.shellFacade,
        new PrettyService(),
        new ValidationService()
      )
    );
  }
}
