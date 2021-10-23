import { Expose } from 'class-transformer';
import { Duration } from 'moment';

export class ResponseTimesModel {
  @Expose()
  public readonly max!: Duration;

  @Expose()
  public readonly average!: Duration;
}
