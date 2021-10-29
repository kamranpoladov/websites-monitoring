import { Expose, Transform } from 'class-transformer';
import { IsDefined, isURL } from 'class-validator';
import { Duration, duration } from 'moment';
import normalizeUrl from 'normalize-url';

export class MonitorWebsiteDto {
  @Expose()
  @IsDefined({
    message: 'Url is invalid'
  })
  @Transform(({ value }) =>
    isURL(value, { require_tld: false }) ? normalizeUrl(value) : undefined
  )
  public readonly website!: string;

  @Expose()
  @IsDefined({
    message: 'Interval has to be a positive number greater than or equal to 3'
  })
  @Transform(({ value }) =>
    !isNaN(+value) && +value >= 3 ? duration(value, 'seconds') : undefined
  )
  public readonly interval!: Duration;

  constructor(obj: MonitorWebsiteDto) {
    Object.assign(this, obj);
  }
}
