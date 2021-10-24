import { Injectable } from '@nestjs/common';
import { duration } from 'moment';

@Injectable()
export class ConfigService {
  get shortFrequency() {
    return duration(10, 's');
  }

  get shortDuration() {
    return duration(10, 'm');
  }

  get longFrequency() {
    return duration(1, 'm');
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
