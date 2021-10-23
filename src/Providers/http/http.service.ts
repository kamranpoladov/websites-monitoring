import { HttpStatus, Injectable } from '@nestjs/common';
import { HttpService as HttpService2 } from '@nestjs/axios';
import moment, { duration } from 'moment';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import { HttpResponseModel } from './models';
import { ErrorMessage, TIMEOUT } from './constants';

@Injectable()
export class HttpService {
  constructor(private readonly httpService: HttpService2) {}

  public async fetch(url: string): Promise<HttpResponseModel> {
    const response = new HttpResponseModel();
    const start = moment();

    try {
      const { status: code } = await lastValueFrom(
        this.httpService.get(url, { timeout: TIMEOUT })
      );
      const end = moment();
      const time = duration(end.valueOf() - start.valueOf());

      response.code = code;
      response.time = time;

      return response;
    } catch (e) {
      const error = e as AxiosError;
      const end = moment();

      response.time = duration(end.valueOf() - start.valueOf());
      response.code = HttpStatus.INTERNAL_SERVER_ERROR; // default if we can't get any other info

      if (error.code) {
        if (!isNaN(+error.code)) {
          response.code = +error.code;
        } else if (error.code === ErrorMessage.Timeout) {
          response.code = HttpStatus.REQUEST_TIMEOUT;
        } else if (error.code === ErrorMessage.BadGateway) {
          response.code = HttpStatus.BAD_GATEWAY;
        }
      }

      return response;
    }
  }
}
