import { Injectable } from '@nestjs/common';
import moment from 'moment';
import { plainToClass } from 'class-transformer';

import { AppConfigService, LoggerService, SchedulerService } from 'Providers';
import { Interval } from 'Models';
import { ResponseService } from 'Modules/response/response.service';
import { StatsLogModel } from 'Providers/logger/models';

import { FILE_NAME_REPLACER } from '../../Constants';

import {
  DISPLAY_STATS_LONG_JOB_KEY,
  DISPLAY_STATS_SHORT_JOB_KEY,
  FETCH_JOB_KEY,
  StatsType
} from './constants';
import { AddWebsiteDto } from './dto';
import { DisplayStatsModel, StatsModel } from './models';

@Injectable()
export class StatsService {
  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly responseService: ResponseService,
    private readonly appConfigService: AppConfigService,
    private readonly loggerService: LoggerService
  ) {}

  public async monitor({ website, interval, save }: AddWebsiteDto) {
    // save logs to unique file if -s flag was provided
    if (save) {
      const filename = `${website.replace(
        FILE_NAME_REPLACER.search,
        FILE_NAME_REPLACER.replace
      )}.${Date.now()}`; // replace forward slashes with underscores

      this.loggerService.streamLogsToFile(filename);
    }

    const startStatsShortJob = () =>
      this.schedulerService.addJob({
        name: DISPLAY_STATS_SHORT_JOB_KEY,
        period: this.appConfigService.shortInterval,
        job: async () =>
          this.displayStats({
            website,
            duration: this.appConfigService.shortDuration,
            statsType: StatsType.Short
          })
      });

    const startStatsLongJob = () =>
      this.schedulerService.addJob({
        name: DISPLAY_STATS_LONG_JOB_KEY,
        period: this.appConfigService.longInterval,
        job: async () =>
          this.displayStats({
            website,
            duration: this.appConfigService.longDuration,
            statsType: StatsType.Long
          }),
        executeImmediately: true
      });

    await this.schedulerService.addJob({
      name: FETCH_JOB_KEY,
      period: interval,
      job: () => this.fetchWebsite(website),
      callback: async () => {
        startStatsShortJob();
        setTimeout(
          () => startStatsLongJob(),
          this.appConfigService.shortDuration.asMilliseconds()
        );
      },
      executeImmediately: true
    });
  }

  private fetchWebsite(website: string) {
    return this.responseService.registerResponse(website);
  }

  private calculateStats(interval: Interval): StatsModel {
    const availability = this.responseService.getAvailability(interval);
    const { average: averageResponseTime, max: maxResponseTime } =
      this.responseService.getResponseTimes(interval);
    const statusCodesCount =
      this.responseService.getResponseCodesCount(interval);
    const adjustedInterval = this.responseService.getAdjustedInterval(interval);

    return plainToClass(StatsModel, {
      availability,
      averageResponseTime,
      maxResponseTime,
      statusCodesCount,
      interval: adjustedInterval.plain
    });
  }

  private displayStats({ website, duration, statsType }: DisplayStatsModel) {
    const interval = new Interval({
      start: moment().subtract(duration),
      end: moment()
    });

    const { interval: adjustedInterval, ...rest } =
      this.calculateStats(interval);

    const statsLog = plainToClass(StatsLogModel, {
      ...rest,
      interval: adjustedInterval.plain,
      website,
      type: statsType
    });

    this.loggerService.stats(statsLog);
  }
}
