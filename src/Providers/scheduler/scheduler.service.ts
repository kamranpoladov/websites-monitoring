import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

import { AddJobDto } from './dto';

@Injectable()
export class SchedulerService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  public async addJob({
    name,
    frequency,
    callback,
    onStart,
    executeImmediately
  }: AddJobDto) {
    executeImmediately && (await callback());
    const interval = setInterval(callback, frequency.asMilliseconds());
    this.schedulerRegistry.addInterval(name, interval);
    onStart && onStart(); // execute onStart callback if it was provided
  }
}
