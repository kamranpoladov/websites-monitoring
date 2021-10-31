import { Duration } from 'moment';

export class MonitorWebsiteEvent {
  public static eventName = 'monitor-website';

  constructor(
    public readonly website: string,
    public readonly interval: Duration
  ) {}
}
