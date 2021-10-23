import { HttpStatus } from '@nestjs/common';
import { Expose, Transform } from 'class-transformer';
import moment, { Duration, Moment } from 'moment';

export class ResponseModel {
  @Expose()
  public readonly time!: Duration;

  @Expose()
  public readonly code!: HttpStatus;

  @Expose()
  @Transform(({ value }) => moment(value))
  public readonly registeredAt!: Moment;

  constructor(obj: ResponseModel) {
    Object.assign(this, obj);
  }
}
