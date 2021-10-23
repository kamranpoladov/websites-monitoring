import { DynamicModule, Global, Module } from '@nestjs/common';

import { LOGGER_MODULE_OPTIONS, LoggerOptions } from './logger.options';
import { LoggerService } from './logger.service';

@Global()
@Module({})
export class LoggerModule {
  static register(options: LoggerOptions): DynamicModule {
    return {
      module: LoggerModule,
      providers: [
        {
          provide: LOGGER_MODULE_OPTIONS,
          useValue: options
        },
        LoggerService
      ],
      exports: [LoggerService]
    };
  }
}
