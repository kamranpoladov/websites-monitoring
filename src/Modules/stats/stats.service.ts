import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import moment, { Duration } from 'moment';

import { Interval } from 'Models';
import { ResponseService } from 'Modules/response/response.service';
import { AppConfigService, LoggerService, SchedulerService } from 'Providers';

import { MonitorWebsiteEvent } from '../shell/events';
import { ShellService } from '../shell/shell.service';

import {
  DISPLAY_STATS_LONG_JOB_KEY,
  DISPLAY_STATS_SHORT_JOB_KEY,
  FETCH_JOB_KEY,
  StatsType
} from './constants';
import { DisplayStatsModel, StatsModel } from './models';
import { StatsRepository } from './stats.repository';

@Injectable()
export class StatsService {
  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly responseService: ResponseService,
    private readonly appConfigService: AppConfigService,
    private readonly loggerService: LoggerService,
    private readonly statsRepository: StatsRepository,
    private readonly shellService: ShellService
  ) {}

  @OnEvent(MonitorWebsiteEvent.eventName)
  public async monitor({ website, interval }: MonitorWebsiteEvent) {
    const startStatsShortJob = () =>
      this.schedulerService.addJob({
        name: `${website}#${DISPLAY_STATS_SHORT_JOB_KEY}`,
        period: this.appConfigService.shortInterval,
        job: async () =>
          this.updateStats(
            website,
            this.appConfigService.shortDuration,
            StatsType.Short
          ),
        executeImmediately: true
      });

    const startStatsLongJob = () =>
      this.schedulerService.addJob({
        name: `${website}#${DISPLAY_STATS_LONG_JOB_KEY}`,
        period: this.appConfigService.longInterval,
        job: async () =>
          this.updateStats(
            website,
            this.appConfigService.longDuration,
            StatsType.Long
          ),
        executeImmediately: true
      });

    await this.schedulerService.addJob({
      name: `${website}#${FETCH_JOB_KEY}`,
      period: interval,
      job: () => this.fetchWebsite(website),
      afterStart: async () => {
        startStatsShortJob();
        setTimeout(
          () => startStatsLongJob(),
          this.appConfigService.shortDuration.asMilliseconds()
        );
      },
      beforeStart: async () =>
        this.statsRepository.initializeEmptyStats(website), // create new stats instance before fetching every website
      executeImmediately: true
    });
  }

  private updateStats(
    website: string,
    duration: Duration,
    statsType: StatsType
  ) {
    console.clear();
    this.displayStats({
      website,
      duration,
      statsType
    });
    this.shellService.show();
  }

  private fetchWebsite(website: string) {
    return this.responseService.registerResponse(website);
  }

  private calculateStats(website: string, interval: Interval): StatsModel {
    const availability = this.responseService.getAvailability(
      website,
      interval
    );
    const { average: averageResponseTime, max: maxResponseTime } =
      this.responseService.getResponseTimes(website, interval);
    const httpStatusCount = this.responseService.getResponseCodesCount(
      website,
      interval
    );
    const adjustedInterval = this.responseService.getAdjustedInterval(
      website,
      interval
    );

    return new StatsModel({
      availability,
      averageResponseTime,
      maxResponseTime,
      httpStatusCount,
      interval: adjustedInterval
    });
  }

  private displayStats({ website, duration, statsType }: DisplayStatsModel) {
    const interval = new Interval({
      start: moment().subtract(duration),
      end: moment()
    });

    const stats = this.calculateStats(website, interval);

    this.statsRepository.updateStatsForWebsite(website, stats, statsType);

    const statsList = this.statsRepository.getStatsList();

    this.loggerService.stats(statsList);
  }
}
