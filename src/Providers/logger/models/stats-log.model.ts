import { Expose } from 'class-transformer';

import { StatsType } from 'Modules/stats/constants';
import { StatsModel } from 'Modules/stats/models';

export class StatsLogModel extends StatsModel {
  @Expose()
  public readonly website!: string;

  @Expose()
  public readonly type!: StatsType;
}
