import { applyDecorators } from '@nestjs/common';
import { Command } from 'nestjs-console';

export const Monitor = (): MethodDecorator =>
  applyDecorators(
    Command({
      command: 'monitor',
      description: 'Monitor a website',
      options: [
        {
          flags: '-w --website <website>',
          required: true,
          description: 'Website to be monitored'
        },
        {
          flags: '-i --interval <interval>',
          required: true,
          description: 'Interval in seconds (minimum 3)'
        },
        {
          flags: '-s --save',
          required: false,
          defaultValue: false,
          description: 'Saves logs in separate file if present'
        }
      ]
    })
  );
