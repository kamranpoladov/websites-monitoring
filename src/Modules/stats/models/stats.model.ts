import { HttpStatus } from '@nestjs/common';
import { Expose, Type } from 'class-transformer';
import { Duration } from 'moment';

import { Interval } from 'Models';

export class StatsModel {
  @Expose()
  public availability!: number;

  @Expose()
  public averageResponseTime!: Duration;

  @Expose()
  public maxResponseTime!: Duration;

  @Expose()
  public httpStatusCount!: Map<HttpStatus, number>;

  @Expose()
  @Type(() => Interval)
  public interval!: Interval;
}
