import { HttpStatus } from '@nestjs/common';
import { Duration } from 'moment';

import { Interval } from 'Models';

import { AlertModel } from '../../alert/models';

export class StatsModel {
  public availability!: number;

  public averageResponseTime!: Duration;

  public maxResponseTime!: Duration;

  public httpStatusCount!: Map<HttpStatus, number>;

  public interval!: Interval;

  constructor(obj?: StatsModel) {
    Object.assign(this, obj);
  }
}

export class WebsiteStatsModel {
  public website!: string;

  public short!: StatsModel;

  public long!: StatsModel;

  public alerts!: AlertModel[];
}

export class StatsListModel {
  public rows!: WebsiteStatsModel[];
}
