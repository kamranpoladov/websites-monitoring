import { applyDecorators } from '@nestjs/common';
import { Command } from 'nestjs-console';

export const Monitor = (): MethodDecorator =>
  applyDecorators(
    Command({
      command: 'monitor',
      options: [
        {
          flags: '-W --website <website>',
          required: true,
          description:
            'Website to be monitored. Protocol must be included (either "http" or "https")'
        },
        {
          flags: '-I --interval <interval>',
          required: true,
          description: 'Interval in seconds (minimum 3)'
        },
        {
          flags: '-S --save',
          required: false,
          defaultValue: false,
          description: 'Saves logs in separate file if present'
        }
      ]
    })
  );
