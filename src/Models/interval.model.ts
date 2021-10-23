import { Expose, Transform } from 'class-transformer';
import moment, { Moment } from 'moment';

import { TIME_FORMAT } from 'Constants';

export class Interval {
  @Expose()
  @Transform(({ value }) => moment(value))
  public readonly start!: Moment;

  @Expose()
  @Transform(({ value }) => moment(value))
  public readonly end!: Moment;

  constructor(obj: Omit<Interval, 'plain' | 'format'>) {
    Object.assign(this, obj);
  }

  public get plain() {
    return {
      start: this.start.toISOString(),
      end: this.end.toISOString()
    };
  }

  public format() {
    return `from ${this.start.format(TIME_FORMAT)} to ${this.end.format(
      TIME_FORMAT
    )}`;
  }
}
