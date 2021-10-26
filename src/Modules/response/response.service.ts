import { HttpStatus, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import moment, { duration } from 'moment';
import { EventEmitter2 as EventEmitter } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';

import { AppConfigService, HttpService } from 'Providers';
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
    private readonly appConfigService: AppConfigService
  ) {}

  public async registerResponse(url: string): Promise<ResponseModel> {
    const httpResponse = await this.httpService.fetch(url);
    const response = plainToClass(ResponseModel, {
      ...httpResponse,
      registeredAt: moment().toISOString()
    });

    this.responseRepository.addResponse(response);

    // notify AlertService about new registered response
    this.eventEmitter.emit(
      RegisterResponseEvent.eventName,
      new RegisterResponseEvent(url)
    );

    return response;
  }

  // delete old responses every 30 minutes to free up memory
  @Cron(CronExpression.EVERY_30_MINUTES)
  private deleteOldResponses() {
    const time = moment().subtract(this.appConfigService.longDuration);

    this.responseRepository.clearBeforeTime(time);
  }

  public getAvailability(interval: Interval): number {
    const responses = this.responseRepository.getResponsesForInterval(interval);

    const { percent } = responses.reduce(
      ({ available, total }, { code }) => ({
        available: code < 300 ? available + 1 : available,
        total: total + 1,
        get percent(): number {
          return Math.round((this.available / this.total) * 100);
        }
      }),
      {
        available: 0,
        total: 0,
        get percent(): number {
          return 0;
        }
      }
    );

    return percent;
  }

  public getResponseTimes(interval: Interval): ResponseTimesModel {
    const responses = this.responseRepository.getResponsesForInterval(interval);
    const { sum, max } = responses.reduce(
      ({ max, sum }, { time }) => ({
        sum: sum.add(time),
        max: max > time ? max : time
      }),
      { max: duration(0), sum: duration(0) }
    );

    const average = duration(
      Math.floor(sum.asMilliseconds() / responses.length),
      'ms'
    );

    return plainToClass(ResponseTimesModel, { average, max });
  }

  public getResponseCodesCount(interval: Interval): Map<HttpStatus, number> {
    const responses = this.responseRepository.getResponsesForInterval(interval);

    return responses.reduce(
      (acc, { code }) =>
        acc.set(code, acc.has(code) ? (acc.get(code) as number) + 1 : 1),
      new Map<HttpStatus, number>()
    );
  }

  public getAdjustedInterval(interval: Interval): Interval {
    const [response] =
      this.responseRepository.getResponsesForInterval(interval);

    if (response.registeredAt > interval.start) {
      return new Interval({
        start: response.registeredAt,
        end: interval.end
      });
    }

    return interval;
  }
}
