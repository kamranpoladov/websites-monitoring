import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

import { AddJobDto } from './dto';

@Injectable()
export class SchedulerService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  public addJob({
    name,
    period,
    job,
    callback,
    executeImmediately
  }: AddJobDto) {
    this.executeAndScheduleJob({
      name,
      job,
      period,
      executeImmediately
    });

    callback?.(); // execute onStart callback if it was provided
  }

  private async executeAndScheduleJob({
    name,
    job,
    period,
    executeImmediately
  }: AddJobDto): Promise<void> {
    if (executeImmediately) await job();
    const interval = setInterval(job, period.asMilliseconds());
    this.schedulerRegistry.addInterval(name, interval);
  }
}
