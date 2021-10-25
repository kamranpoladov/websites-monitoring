import { Injectable } from '@nestjs/common';
import boxen from 'boxen';

@Injectable()
export class PrettyService {
  public wrap(title: string, ...messages: string[]): string {
    const message = messages.reduce((acc, curr) => acc + curr + '\n', '');

    return boxen(message, {
      title,
      borderStyle: 'bold',
      padding: 1,
      margin: 1,
      titleAlignment: 'center',
      textAlignment: 'center'
    });
  }
}
