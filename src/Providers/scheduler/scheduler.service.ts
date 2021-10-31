import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

import { AddJobDto } from './dto';

@Injectable()
export class SchedulerService {
  constructor(private readonly schedulerRegistry: SchedulerRegistry) {}

  public async addJob({
    name,
    period,
    job,
    afterStart,
    executeImmediately,
    beforeStart
  }: AddJobDto) {
    await beforeStart?.(); // execute beforeStart callback if it was provided

    await this.executeAndScheduleJob({
      name,
      job,
      period,
      executeImmediately
    });

    afterStart?.(); // execute afterStart callback if it was provided
  }

  private async executeAndScheduleJob({
    name,
    job,
    period,
    executeImmediately
  }: Omit<AddJobDto, 'afterStart' | 'beforeStart'>): Promise<void> {
    if (executeImmediately) await job();
    const interval = setInterval(job, period.asMilliseconds());
    this.schedulerRegistry.addInterval(name, interval);
  }
}
