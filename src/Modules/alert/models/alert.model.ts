import { Moment } from 'moment';

import { AlertType } from '../constants';

export class AlertModel {
  public readonly availability!: number;

  public readonly time!: Moment;

  public readonly type!: AlertType;
}
