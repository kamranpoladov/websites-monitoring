import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ShellModule as NestShellModule } from 'nestjs-shell';

import {
  AppConfigModule,
  HttpModule,
  LoggerModule,
  PrettyModule,
  SchedulerModule,
  ValidationModule
} from 'Providers';

import { AlertModule } from './alert';
import { ResponseModule } from './response';
import { ShellModule } from './shell';
import { StatsModule } from './stats';

@Module({
  imports: [
    // core modules
    EventEmitterModule.forRoot({ global: true, ignoreErrors: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    NestShellModule,

    // common modules
    PrettyModule,
    LoggerModule.register({
      logsDirectory: 'logs'
    }),
    ValidationModule,
    HttpModule,
    AppConfigModule,
    SchedulerModule,

    // application modules
    StatsModule,
    ResponseModule,
    AlertModule,
    ShellModule
  ]
})
export class AppModule {}
