import { HttpStatus } from '@nestjs/common';
import { Duration } from 'moment';

export class HttpResponseModel {
  public time!: Duration;

  public code!: HttpStatus;
}
