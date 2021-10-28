import { URL } from 'url';

import { Injectable } from '@nestjs/common';
import { Logger, createLogger, format, transports } from 'winston';
import { table } from 'table';

import { TIME_FORMAT } from 'Constants';
import { AlertType } from 'Modules/alert/constants';

import { PrettyService } from '../pretty';

import { AlertLogModel, StatsLogModel } from './models';

@Injectable()
export class LoggerService {
  private readonly logger: Logger;

  constructor(private readonly prettyService: PrettyService) {
    this.logger = createLogger({
      format: format.combine(
        format.simple(),
        format.printf(info => info.message)
      ),
      transports: [new transports.Console()]
    });
  }

  public info(message: string) {
    this.logger.info(message);
  }

  public error(message: string) {
    this.logger.error(message);
  }

  public stats(stats: StatsLogModel) {
    const title = `${new URL(stats.website).host} - ${stats.type} STATS`;

    const displayLabelMessage = `Displaying stats for ${
      stats.website
    } ${stats.interval.format()}`;
    const averageMessage = `Average response time: ${stats.averageResponseTime.asMilliseconds()} ms`;
    const maximumMessage = `Maximum response time: ${stats.maxResponseTime.asMilliseconds()} ms`;
    const availabilityMessage = `Availability: ${stats.availability}%`;

    const httpStatusCountSorted = new Map(
      [...stats.httpStatusCount.entries()].sort(([a], [b]) => a - b)
    );

    const data = Array.from(httpStatusCountSorted.entries());

    const statusCodesTable = table([['Status', 'Frequency'], ...data]);

    const prettyMessage = this.prettyService
      .withTitle(title)
      .withMessages(
        displayLabelMessage,
        averageMessage,
        maximumMessage,
        availabilityMessage,
        statusCodesTable
      )
      .buildBox();

    this.info(prettyMessage);
  }

  public alert(alertLog: AlertLogModel) {
    const alertTitle =
      alertLog.type === AlertType.Down ? 'ALERT DOWN' : 'ALERT RECOVER';
    this.prettyService.withTitle(alertTitle);
    const availabilityMessage = `Availability is ${
      alertLog.availability
    }% at ${alertLog.time.format(TIME_FORMAT)}`;

    if (alertLog.type === AlertType.Down) {
      const infoMessage = `Website ${alertLog.website} is down`;

      const prettyMessage = this.prettyService
        .withMessages(infoMessage, availabilityMessage)
        .buildBox();
      this.info(prettyMessage);
    } else {
      const infoMessage = `Website ${alertLog.website} has recovered`;

      const prettyMessage = this.prettyService
        .withMessages(infoMessage, availabilityMessage)
        .buildBox();
      this.info(prettyMessage);
    }
  }
}
