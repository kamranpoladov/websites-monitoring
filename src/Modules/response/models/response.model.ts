import { Expose, Transform } from 'class-transformer';
import moment, { Moment } from 'moment';

import { HttpResponseModel } from 'Providers/http/models';

export class ResponseModel extends HttpResponseModel {
  @Expose()
  @Transform(({ value }) => moment(value))
  public readonly registeredAt!: Moment;

  constructor(obj: ResponseModel) {
    super();
    Object.assign(this, obj);
  }
}
