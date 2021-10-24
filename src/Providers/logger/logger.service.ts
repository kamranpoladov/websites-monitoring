import path from 'path';

import moment from 'moment';
import { Inject, Injectable } from '@nestjs/common';
import winston, { Logger } from 'winston';

import { TIME_FORMAT } from 'Constants';
import { AlertType } from 'Modules/alert/constants';

import { LOGGER_MODULE_OPTIONS, LoggerOptions } from './logger.options';
import { AlertLogModel, StatsLogModel } from './models';

@Injectable()
export class LoggerService {
  private readonly logger: Logger;

  constructor(
    @Inject(LOGGER_MODULE_OPTIONS)
    private readonly options: LoggerOptions
  ) {
    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.simple(),
        winston.format.printf(info => info.message)
      ),
      transports: [new winston.transports.Console()]
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
      new winston.transports.File({
        level: 'info',
        filename: `${filename}.log`,
        dirname,
        format: winston.format.combine(
          winston.format.simple(),
          winston.format.printf(info => info.message)
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

  private title(title: string) {
    this.logger.info(
      `\n\n--------------------------------------- ${title} ---------------------------------------\n\n`
    );
  }

  private statusCodes(statusCodesCount: StatsLogModel['statusCodesCount']) {
    this.info('\nStatus\tFrequency\n');

    statusCodesCount.forEach((count, code) => {
      this.info(`${code}\t${count}`);
    });
  }

  public stats(stats: StatsLogModel) {
    this.title(`${stats.type} STATS`);

    this.info(
      `Displaying stats for ${stats.website} ${stats.interval.format()}`
    );
    this.info(
      `Average response time: ${stats.averageResponseTime.asMilliseconds()} ms`
    );
    this.info(
      `Maximum response time: ${stats.maxResponseTime.asMilliseconds()} ms`
    );
    this.info(`Availability: ${stats.availability}%`);

    this.statusCodes(stats.statusCodesCount);
  }

  public alert(alertLog: AlertLogModel) {
    if (alertLog.type === AlertType.Down) {
      this.title('ALERT DOWN');
      this.info(
        `Website ${alertLog.website} is down. Availability is ${
          alertLog.availability
        }% at ${alertLog.time.format(TIME_FORMAT)}`
      );
    } else {
      this.title('ALERT RECOVER');
      this.info(
        `Website ${alertLog.website} recovered. Availability is ${
          alertLog.availability
        }% at ${alertLog.time.format(TIME_FORMAT)}`
      );
    }
  }
}
