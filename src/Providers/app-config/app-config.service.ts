import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { duration } from 'moment';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get shortInterval() {
    const [input, unit] = this.configService
      .get('SHORT_INTERVAL')
      .match(/(\d+)\s*(\w+)/)
      .slice(1);

    return duration(input, unit);
  }

  get shortDuration() {
    const [input, unit] = this.configService
      .get('SHORT_DURATION')
      .match(/(\d+)\s*(\w+)/)
      .slice(1);

    return duration(input, unit);
  }

  get longInterval() {
    const [input, unit] = this.configService
      .get('LONG_INTERVAL')
      .match(/(\d+)\s*(\w+)/)
      .slice(1);

    return duration(input, unit);
  }

  get longDuration() {
    const [input, unit] = this.configService
      .get('LONG_DURATION')
      .match(/(\d+)\s*(\w+)/)
      .slice(1);

    return duration(input, unit);
  }

  get downCheckDuration() {
    const [input, unit] = this.configService
      .get('DOWN_CHECK_DURATION')
      .match(/(\d+)\s*(\w+)/)
      .slice(1);

    return duration(input, unit);
  }

  get alertAvailability() {
    const targetAvailability = this.configService.get<number>(
      'TARGET_AVAILABILITY'
    );

    return Number(targetAvailability);
  }
}
