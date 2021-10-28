import { plainToClass } from 'class-transformer';
import {
  ShellComponent as NestShellComponent,
  ShellFacade
} from 'nestjs-shell';

import { PrettyService, ValidationService } from 'Providers';
import { openTerminal } from 'Utils';

import {
  ShellCommandExit,
  ShellCommandHelp,
  ShellCommandMonitor
} from './decorators';
import { MonitorWebsiteDto } from './dto';

export class ShellComponent extends NestShellComponent {
  constructor(
    private readonly shellFacade: ShellFacade,
    private readonly prettyService: PrettyService,
    private readonly validationService: ValidationService
  ) {
    super();
  }

  @ShellCommandMonitor()
  public async monitor(
    website: string,
    interval: string,
    save: string
  ): Promise<string> {
    const monitorWebsiteDto = plainToClass(MonitorWebsiteDto, {
      website,
      interval,
      save: !!save
    });
    const errors = await this.validationService.validate(monitorWebsiteDto);

    if (!errors.length) {
      openTerminal(
        `ts-node -P tsconfig.json -r tsconfig-paths/register src/main.ts monitor -w ${website} -i ${interval}`
      );

      return `\nMonitoring ${website}!\n`;
    } else {
      return this.prettyService
        .withTitle('Validation failed')
        .withMessages(...errors)
        .buildBox();
    }
  }

  @ShellCommandHelp()
  public async help(): Promise<string> {
    const title = 'Available commands';
    const messages = this.shellFacade
      .getAllCommands()
      .map(
        command =>
          `${command.name} ${command.pattern} - ${
            command.description || 'Description not available'
          }`
      );

    return this.prettyService
      .withTitle(title)
      .withOptions({
        borderStyle: 'bold',
        margin: 1,
        padding: 1,
        titleAlignment: 'center'
      })
      .withMessages(...messages)
      .buildBox();
  }

  @ShellCommandExit()
  public exit() {
    console.log('Bye-bye!');

    return process.exit();
  }
}
