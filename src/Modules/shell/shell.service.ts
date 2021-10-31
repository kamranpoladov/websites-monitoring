import { Injectable } from '@nestjs/common';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { plainToClass } from 'class-transformer';
import shell from 'shelljs';
import Vorpal from 'vorpal';

import { LoggerService, PrettyService, ValidationService } from 'Providers';

import { MonitorWebsiteDto } from './dto';
import { MonitorWebsiteEvent } from './events';
import { ShellRepository } from './shell.repository';

@Injectable()
export class ShellService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly eventEmitter: EventEmitter,
    private readonly validationService: ValidationService,
    private readonly shell: Vorpal,
    private readonly prettyService: PrettyService,
    private readonly shellRepository: ShellRepository
  ) {}

  public bootstrap() {
    this.shell.delimiter('> ').show();

    this.shell
      .command('monitor <website> <interval>')
      .action(async ({ website, interval }) => {
        const monitorWebsiteDto = plainToClass(MonitorWebsiteDto, {
          website,
          interval
        });
        const errors = await this.validationService.validateObject(
          monitorWebsiteDto
        );

        // make sure website isn't already being monitored
        const alreadyExists = this.shellRepository.hasWebsite(
          monitorWebsiteDto.website
        );

        if (!errors.length && !alreadyExists) {
          this.shellRepository.addWebsite(monitorWebsiteDto.website);
          this.eventEmitter.emit(
            MonitorWebsiteEvent.eventName,
            new MonitorWebsiteEvent(
              monitorWebsiteDto.website,
              monitorWebsiteDto.interval
            )
          );
        } else {
          const alreadyExistsMessage = alreadyExists
            ? `Website ${website} is already monitored`
            : '';
          const prettyMessage = this.prettyService
            .withTitle(`${website} - Validation errors`)
            .withMessages(...errors, alreadyExistsMessage)
            .buildBox();
          this.loggerService.error(prettyMessage);
        }
      });
  }

  public show() {
    this.shell.show();
  }

  public traceErrors() {
    this.loggerService.info(
      'If you input wrong data, validation errors will appear here...'
    );
    shell.exec('tail -f errors.log');
  }
}
