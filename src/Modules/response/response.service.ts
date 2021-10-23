import { HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import moment, { Duration, duration } from 'moment';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ConfigService, HttpService } from 'Providers';
import { Interval } from 'Models';

import { ResponseModel, ResponseTimesModel } from './models';
import { ResponseRepository } from './response.repository';
import { RegisterResponseEvent } from './events';

@Injectable()
export class ResponseService {
  constructor(
    private readonly responseRepository: ResponseRepository,
    private readonly httpService: HttpService,
    private readonly eventEmitter: EventEmitter,
    private readonly configService: ConfigService
  ) {}

  public async registerResponse(url: string): Promise<void> {
    const responseRaw = await this.httpService.fetch(url);

    const response = plainToClass(ResponseModel, {
      ...responseRaw,
      registeredAt: moment().toISOString()
    });

    this.responseRepository.addResponse(response);

    // notify AlertService about new registered response
    this.eventEmitter.emit(
      RegisterResponseEvent.eventName,
      new RegisterResponseEvent(url)
    );
  }

  // delete old responses every 30 minutes to free up memory
  @Cron(CronExpression.EVERY_30_MINUTES)
  private deleteOldResponses() {
    const time = moment().subtract(this.configService.longDuration);

    this.responseRepository.clearBeforeTime(time);
  }

  public getAvailability(interval: Interval): number {
    const responses = this.responseRepository.getResponsesForInterval(interval);

    let [available, total] = [0, 0];

    for (const response of responses) {
      if (response.code < 300) {
        available++;
      }
      total++;
    }

    return Math.round((available / total) * 100);
  }

  private getAverageResponseTime(interval: Interval): Duration {
    const responses = this.responseRepository.getResponsesForInterval(interval);

    const sum = responses.reduce(
      (acc, { time }) => (acc = acc.add(time)),
      duration(0)
    );
    const averageTimeMilliseconds = Math.floor(
      sum.asMilliseconds() / responses.length
    );

    return duration(averageTimeMilliseconds, 'milliseconds');
  }

  private getMaxResponseTime(interval: Interval): Duration {
    const responses = this.responseRepository.getResponsesForInterval(interval);

    return responses.reduce(
      (max, response) => (max > response.time ? max : response.time),
      duration(0)
    );
  }

  public getResponseTimes(interval: Interval): ResponseTimesModel {
    const average = this.getAverageResponseTime(interval);
    const max = this.getMaxResponseTime(interval);

    return plainToClass(ResponseTimesModel, { average, max });
  }

  public getResponseCodesCount(interval: Interval): Map<HttpStatus, number> {
    const responsesCount = new Map<number, number>();
    const responses = this.responseRepository.getResponsesForInterval(interval);

    responses.forEach(response => {
      if (!responsesCount.has(response.code)) {
        responsesCount.set(response.code, 0);
      }

      const temp = responsesCount.get(response.code) as number;
      responsesCount.set(response.code, temp + 1);
    });

    return responsesCount;
  }

  public getAdjustedInterval(interval: Interval): Interval {
    const responses = this.responseRepository.getResponsesForInterval(interval);

    if (responses[0].registeredAt > interval.start) {
      return new Interval({
        start: responses[0].registeredAt,
        end: interval.end
      });
    }

    return interval;
  }
}
