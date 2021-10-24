import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import moment from 'moment';

import { Interval } from 'Models';
import { ResponseService } from 'Modules/response/response.service';
import { ConfigService, LoggerService } from 'Providers';
import { RegisterResponseEvent } from 'Modules/response/events';

import { AlertRepository } from './alert.repository';
import { AlertType } from './constants';

@Injectable()
export class AlertService {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly responseService: ResponseService,
    private readonly configService: ConfigService,
    private readonly alertRepository: AlertRepository
  ) {}

  // Check if website is down or has recovered every time new response is registered
  @OnEvent(RegisterResponseEvent.eventName)
  public onRegisterResponse({ website }: RegisterResponseEvent): void {
    const start = moment().subtract(this.configService.downCheckDuration);
    const now = moment();
    const interval = new Interval({ start, end: now });

    const availability = this.responseService.getAvailability(interval);
    const targetAvailability = this.configService.alertAvailability;
    const currentlyDown = this.alertRepository.getIsDown();

    this.alertRepository.setIsDown(availability < targetAvailability);

    if (availability < targetAvailability && !currentlyDown) {
      this.loggerService.alert({
        availability,
        time: now,
        website,
        type: AlertType.Down
      });
    } else if (availability >= targetAvailability && currentlyDown) {
      this.loggerService.alert({
        availability,
        time: now,
        website,
        type: AlertType.Recover
      });
    }
  }
}
