import { Moment } from 'moment';
import { Expose } from 'class-transformer';

import { AlertType } from 'Modules/alert/constants';

export class AlertLogModel {
  @Expose()
  public readonly website!: string;

  @Expose()
  public readonly availability!: number;

  @Expose()
  public readonly time!: Moment;

  @Expose()
  public readonly type!: AlertType;
}
