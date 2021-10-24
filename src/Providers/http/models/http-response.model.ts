import { HttpStatus } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { Duration } from 'moment';

export class HttpResponseModel {
  @Expose()
  public time!: Duration;

  @Expose()
  public code!: HttpStatus;
}
