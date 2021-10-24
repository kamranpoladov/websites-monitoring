import { Moment } from 'moment';

import { AlertType } from 'Modules/alert/constants';

export class AlertLogModel {
  public readonly website!: string;

  public readonly availability!: number;

  public readonly time!: Moment;

  public readonly type!: AlertType;

  constructor(obj: AlertLogModel) {
    Object.assign(this, obj);
  }
}
