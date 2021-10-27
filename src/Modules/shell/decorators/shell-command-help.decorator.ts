import { applyDecorators } from '@nestjs/common';
import { ShellCommand } from 'nestjs-shell';

export const ShellCommandHelp = () =>
  applyDecorators(
    ShellCommand({
      name: 'help',
      description: 'Displays all commands with description and usage'
    })
  );
