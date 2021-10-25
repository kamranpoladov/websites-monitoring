import path from 'path';

import { Inject, Injectable } from '@nestjs/common';
import moment from 'moment';
import { Logger, createLogger, format, transports } from 'winston';
import { table } from 'table';

import { TIME_FORMAT } from 'Constants';
import { AlertType } from 'Modules/alert/constants';

import { PrettyService } from '../pretty';

import { LOGGER_MODULE_OPTIONS, LoggerOptions } from './logger.options';
import { AlertLogModel, StatsLogModel } from './models';

@Injectable()
export class LoggerService {
  private readonly logger: Logger;

  constructor(
    @Inject(LOGGER_MODULE_OPTIONS)
    private readonly options: LoggerOptions,
    private readonly prettyService: PrettyService
  ) {
    this.logger = createLogger({
      format: format.combine(
        format.simple(),
        format.printf(info => info.message)
      ),
      transports: [new transports.Console()]
    });
  }

  public streamLogsToFile(filename: string) {
    const now = moment();
    const dirname = path.join(
      this.options.logsDirectory,
      `${now.year()}`,
      `${now.format('MMMM')}`,
      `${now.date()}`
    );

    this.logger.add(
      new transports.File({
        level: 'info',
        filename: `${filename}.rft`,
        dirname,
        format: format.combine(
          format.simple(),
          format.printf(info => info.message)
        )
      })
    );
  }

  public info(message: string) {
    this.logger.info(message);
  }

  public error(message: string) {
    this.logger.error(message);
  }

  public stats(stats: StatsLogModel) {
    const title = `${stats.type} STATS`;

    const displayLabelMessage = `Displaying stats for ${
      stats.website
    } ${stats.interval.format()}`;
    const averageMessage = `Average response time: ${stats.averageResponseTime.asMilliseconds()} ms`;
    const maximumMessage = `Maximum response time: ${stats.maxResponseTime.asMilliseconds()} ms`;
    const availabilityMessage = `Availability: ${stats.availability}%`;

    const sortedStatusCodesMap = new Map(
      [...stats.statusCodesCount.entries()].sort(([a], [b]) => a - b)
    );

    const data = Array.from(sortedStatusCodesMap.entries());

    const statusCodesTable = table([['Status', 'Frequency'], ...data]);

    const prettyMessage = this.prettyService.wrap(
      title,
      displayLabelMessage,
      averageMessage,
      maximumMessage,
      availabilityMessage,
      statusCodesTable
    );

    this.info(prettyMessage);
  }

  public alert(alertLog: AlertLogModel) {
    const alertTitle =
      alertLog.type === AlertType.Down ? 'ALERT DOWN' : 'ALERT RECOVER';
    const availabilityMessage = `Availability is ${
      alertLog.availability
    }% at ${alertLog.time.format(TIME_FORMAT)}`;

    if (alertLog.type === AlertType.Down) {
      const infoMessage = `Website ${alertLog.website} is down`;

      const prettyMessage = this.prettyService.wrap(
        alertTitle,
        infoMessage,
        availabilityMessage
      );
      this.info(prettyMessage);
    } else {
      const infoMessage = `Website ${alertLog.website} has recovered`;

      const prettyMessage = this.prettyService.wrap(
        alertTitle,
        infoMessage,
        availabilityMessage
      );
      this.info(prettyMessage);
    }
  }
}
