import { Moment } from 'moment';

import { TIME_FORMAT } from 'Constants';

export class Interval {
  public readonly start!: Moment;

  public readonly end!: Moment;

  constructor(obj: Omit<Interval, 'plain' | 'format'>) {
    Object.assign(this, obj);
  }

  public format() {
    return `from ${this.start.format(TIME_FORMAT)} to ${this.end.format(
      TIME_FORMAT
    )}`;
  }
}
