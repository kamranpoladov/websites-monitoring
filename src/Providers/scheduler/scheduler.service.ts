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
    callback,
    executeImmediately
  }: AddJobDto) {
    await this.executeAndScheduleJob({
      name,
      job,
      period,
      executeImmediately
    });

    callback?.(); // execute callback if it was provided
  }

  private async executeAndScheduleJob({
    name,
    job,
    period,
    executeImmediately
  }: Omit<AddJobDto, 'callback'>): Promise<void> {
    if (executeImmediately) await job();
    const interval = setInterval(job, period.asMilliseconds());
    this.schedulerRegistry.addInterval(name, interval);
  }
}
