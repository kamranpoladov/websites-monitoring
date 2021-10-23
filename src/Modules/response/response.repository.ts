import { Moment } from 'moment';

import { Interval } from 'Models';

import { ResponseModel } from './models';

export class ResponseRepository {
  constructor(private readonly responses: ResponseModel[]) {
    this.responses = [];
  }

  public addResponse(response: ResponseModel): void {
    this.responses.push(response);
  }

  public getResponsesForInterval(interval: Interval): ResponseModel[] {
    const startIndex = this.getClosestResponseIndexToTime(interval.start);
    const endIndex = this.getClosestResponseIndexToTime(interval.end);

    return this.responses.slice(startIndex, endIndex);
  }

  // since responses are always sorted by registeredAt, use binary search for quicker find operations
  private getClosestResponseIndexToTime(time: Moment): number {
    let start = 0;
    let end = this.responses.length;

    while (start < end) {
      const mid = Math.floor((start + end) / 2);
      if (this.responses[mid].registeredAt === time) {
        return mid;
      } else if (this.responses[mid].registeredAt < time) {
        start = mid + 1;
      } else {
        end = mid - 1;
      }
    }

    return start;
  }

  public clearBeforeTime(time: Moment): void {
    if (this.responses.length === 0) return;

    const removeUntilIndex = this.getClosestResponseIndexToTime(time);
    console.log(removeUntilIndex);
    this.responses.splice(0, removeUntilIndex);
  }
}
