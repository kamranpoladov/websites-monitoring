import { HttpStatus, Injectable } from '@nestjs/common';
import { TableUserConfig, table } from 'table';
import { Logger, createLogger, format, transports } from 'winston';

import { TIME_FORMAT } from 'Constants';
import { AlertType } from 'Modules/alert/constants';

import { AlertModel } from '../../Modules/alert/models';
import { StatsType } from '../../Modules/stats/constants';
import { StatsListModel, StatsModel } from '../../Modules/stats/models';

@Injectable()
export class LoggerService {
  private readonly logger: Logger;

  constructor() {
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

  public stats(stats: StatsListModel) {
    const config: TableUserConfig = {
      header: {
        alignment: 'center',
        content: 'STATS FOR ALL WEBSITES'
      }
    };
    const data = [
      [
        'Website',
        'Period',
        'From',
        'To',
        'Availability',
        'Average response time',
        'Max response time',
        'Http status count',
        'Alerts'
      ]
    ];

    stats.rows.forEach(row => {
      if (row.short.availability !== undefined) {
        const dataPoint = this.generateStatsDataPoint(
          row.website,
          StatsType.Short,
          row.short,
          row.alerts
        );
        data.push(dataPoint);
      }

      if (row.long.availability !== undefined) {
        const datapoint = this.generateStatsDataPoint(
          row.website,
          StatsType.Long,
          row.long
        );
        data.push(datapoint);
      }
    });

    this.info(table(data, config));
  }

  private generateStatsDataPoint(
    website: string,
    type: StatsType,
    stats: StatsModel,
    alerts: AlertModel[] = []
  ) {
    const dataPoint = [];
    type === StatsType.Short ? dataPoint.push(website) : dataPoint.push('');
    dataPoint.push(type);
    dataPoint.push(stats.interval.start.format(TIME_FORMAT));
    dataPoint.push(stats.interval.end.format(TIME_FORMAT));
    dataPoint.push(`${stats.availability}%`);
    dataPoint.push(`${stats.averageResponseTime.asMilliseconds()} ms`);
    dataPoint.push(`${stats.maxResponseTime.asMilliseconds()} ms`);

    const httpStatsCountMessage = this.constructHttpStatsCountMessage(
      stats.httpStatusCount
    );

    dataPoint.push(httpStatsCountMessage);

    const alertMessages = alerts.map(alert =>
      this.constructAlertMessage(alert)
    );
    dataPoint.push(alertMessages.join('\n'));

    return dataPoint;
  }

  private constructHttpStatsCountMessage(
    httpStatusCount: Map<HttpStatus, number>
  ): string {
    return Array.from(httpStatusCount.entries())
      .sort(([statusCode1], [statusCode2]) => statusCode1 - statusCode2)
      .map(([status, count]) => `${status} => ${count}`)
      .join('\n');
  }

  private constructAlertMessage(alert: AlertModel): string {
    return alert.type === AlertType.Down
      ? `Went down with availability ${
          alert.availability
        }% at ${alert.time.format(TIME_FORMAT)}`
      : `Recovered with availability ${
          alert.availability
        }% at ${alert.time.format(TIME_FORMAT)}`;
  }
}
