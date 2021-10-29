import { plainToClass } from 'class-transformer';
import { Console } from 'nestjs-console';

import { LoggerService, PrettyService, ValidationService } from 'Providers';

import { MonitorWebsiteDto } from '../shell/dto';

import { Monitor } from './decorators';
import { StatsService } from './stats.service';

@Console()
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    private readonly validationService: ValidationService,
    private readonly loggerService: LoggerService,
    private readonly prettyService: PrettyService
  ) {}

  @Monitor()
  public async monitor({
    website,
    interval
  }: MonitorWebsiteDto): Promise<void> {
    const monitorWebsiteDto = plainToClass(MonitorWebsiteDto, {
      website,
      interval
    });
    const errors = await this.validationService.validate(monitorWebsiteDto);

    if (errors.length === 0) {
      return this.statsService.monitor(monitorWebsiteDto);
    } else {
      this.loggerService.info(
        this.prettyService
          .withTitle('Validation failed')
          .withMessages(...errors)
          .buildBox()
      );
      process.exit();
    }
  }
}
