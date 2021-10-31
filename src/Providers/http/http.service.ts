import { HttpService as HttpService2 } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import moment, { duration } from 'moment';
import { lastValueFrom } from 'rxjs';

import { ErrorMessage, TIMEOUT } from './constants';
import { HttpResponseModel } from './models';

@Injectable()
export class HttpService {
  constructor(private readonly httpService: HttpService2) {}

  public async fetch(url: string): Promise<HttpResponseModel> {
    const response = new HttpResponseModel();
    const start = moment();

    response.website = url;

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

      if (error.response && error.response.status) {
        response.code = error.response.status;
      } else {
        if (error.code === ErrorMessage.Timeout) {
          response.code = HttpStatus.REQUEST_TIMEOUT;
        } else if (error.code === ErrorMessage.BadGateway) {
          response.code = HttpStatus.BAD_GATEWAY;
        } else {
          response.code = HttpStatus.INTERNAL_SERVER_ERROR;
        }
      }

      return response;
    }
  }
}
