import { Injectable } from '@nestjs/common';
import { CronExpression } from '@nestjs/schedule';
import { duration } from 'moment';

@Injectable()
export class ConfigService {
  get shortFrequency() {
    return duration(10, 's');
  }

  get shortFrequencyCronExpression() {
    return CronExpression.EVERY_10_SECONDS;
  }

  get shortDuration() {
    return duration(10, 'm');
  }

  get longFrequency() {
    return duration(1, 'm');
  }

  get longFrequencyCronExpression() {
    return CronExpression.EVERY_MINUTE;
  }

  get longDuration() {
    return duration(1, 'h');
  }

  get downCheckDuration() {
    return duration(2, 'm');
  }

  get alertAvailability() {
    return 80;
  }
}
