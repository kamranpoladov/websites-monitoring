import { Duration } from 'moment';

import { StatsType } from '../constants';

export class DisplayStatsModel {
  public readonly website!: string;

  public readonly duration!: Duration;

  public readonly statsType!: StatsType;
}
