import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import {
  ConfigModule,
  HttpModule,
  LoggerModule,
  SchedulerModule,
  ValidationModule
} from 'Providers';

import { AlertModule } from './alert';
import { ResponseModule } from './response';
import { StatsModule } from './stats';

@Module({
  imports: [
    // core modules
    EventEmitterModule.forRoot({ global: true, ignoreErrors: true }),

    // common modules
    LoggerModule.register({
      logsDirectory: 'logs'
    }),
    ValidationModule,
    HttpModule,
    ConfigModule,
    SchedulerModule,

    // application modules
    StatsModule,
    ResponseModule,
    AlertModule
  ]
})
export class AppModule {}
