import { Injectable, Scope } from '@nestjs/common';
import boxen, { Options } from 'boxen';

@Injectable({ scope: Scope.TRANSIENT })
export class PrettyService {
  private options: Options;
  private messages: string[];

  constructor() {
    this.options = {
      borderStyle: 'bold',
      padding: 1,
      margin: 1,
      titleAlignment: 'center',
      textAlignment: 'center'
    };
    this.messages = [];
  }

  public buildBox() {
    const text = boxen(
      this.messages.reduce(
        (acc, curr, i) =>
          i === this.messages.length - 1 ? acc + curr : acc + curr + '\n',
        ''
      ),
      this.options
    );
    this.reset();

    return text;
  }

  public withTitle(title: string) {
    this.options = { ...this.options, title };

    return this;
  }

  public withOptions(options: Omit<Options, 'title'>) {
    this.options = { ...options, title: this.options.title };

    return this;
  }

  public withMessages(...messages: string[]) {
    this.messages = [...messages];

    return this;
  }

  private reset() {
    this.options = {
      borderStyle: 'bold',
      padding: 1,
      margin: 1,
      titleAlignment: 'center',
      textAlignment: 'center'
    };
    this.messages = [];
  }
}
