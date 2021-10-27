import { applyDecorators } from '@nestjs/common';
import { ShellCommand } from 'nestjs-shell';

export const ShellCommandExit = () =>
  applyDecorators(
    ShellCommand({
      name: 'exit',
      description: 'Exits a program'
    })
  );
