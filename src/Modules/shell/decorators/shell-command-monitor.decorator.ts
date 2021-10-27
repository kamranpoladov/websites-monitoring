import { applyDecorators } from '@nestjs/common';
import { ShellCommand } from 'nestjs-shell';

export const ShellCommandMonitor = () =>
  applyDecorators(
    ShellCommand({
      name: 'monitor',
      description: 'Starts monitoring a website with specified interval',
      pattern: '<website> <interval>'
    })
  );
