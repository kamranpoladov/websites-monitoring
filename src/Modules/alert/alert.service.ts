import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import moment from 'moment';

import { Interval } from 'Models';
import { RegisterResponseEvent } from 'Modules/response/events';
import { ResponseService } from 'Modules/response/response.service';
import { AppConfigService, LoggerService } from 'Providers';

import { StatsRepository } from '../stats/stats.repository';

import { AlertRepository } from './alert.repository';
import { AlertType } from './constants';

@Injectable()
export class AlertService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly responseService: ResponseService,
    private readonly appConfigService: AppConfigService,
    private readonly alertRepository: AlertRepository,
    private readonly statsRepository: StatsRepository
  ) {}

  // Check if website is down or has recovered every time new response is registered
  @OnEvent(RegisterResponseEvent.eventName, { async: true, nextTick: true })
  public onRegisterResponse({ website }: RegisterResponseEvent): void {
    const start = moment().subtract(this.appConfigService.downCheckDuration);
    const now = moment();
    const interval = new Interval({ start, end: now });

    const availability = this.responseService.getAvailability(
      website,
      interval
    );
    const targetAvailability = this.appConfigService.alertAvailability;
    const currentlyDown = this.alertRepository.getIsDown(website);

    this.alertRepository.setIsDown(website, availability < targetAvailability);

    if (availability < targetAvailability && !currentlyDown) {
      this.statsRepository.addAlertForWebsite(website, {
        time: now,
        availability,
        type: AlertType.Down
      });
    } else if (availability >= targetAvailability && currentlyDown) {
      this.statsRepository.addAlertForWebsite(website, {
        time: now,
        availability,
        type: AlertType.Recover
      });
    }
  }
}
