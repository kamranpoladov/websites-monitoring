import { plainToClass } from 'class-transformer';
import { Console } from 'nestjs-console';

import { ValidationService } from 'Providers';

import { Monitor } from './decorators';
import { AddWebsiteDto, AddWebsiteDtoPlain } from './dto';
import { StatsService } from './stats.service';

@Console()
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    private readonly validationService: ValidationService
  ) {}

  @Monitor()
  public async monitor({
    save,
    website,
    interval
  }: AddWebsiteDtoPlain): Promise<void> {
    const addWebsiteDto = plainToClass(AddWebsiteDto, {
      website,
      interval,
      save
    });
    await this.validationService.validate(addWebsiteDto);

    return this.statsService.monitor(addWebsiteDto);
  }
}
