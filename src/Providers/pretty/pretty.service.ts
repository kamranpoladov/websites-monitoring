import { Injectable, Scope } from '@nestjs/common';
import boxen, { Options } from 'boxen';

@Injectable({ scope: Scope.TRANSIENT })
export class PrettyService {
  private options: Options;
  private messages: string[];
  private readonly defaultOptions: Options = {
    borderStyle: 'bold',
    padding: 1,
    margin: 1,
    titleAlignment: 'center',
    textAlignment: 'center'
  };

  constructor() {
    this.options = {
      ...this.defaultOptions
    };
    this.messages = [];
  }

  public buildBox() {
    const text = boxen(this.messages.join('\n'), this.options);
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
      ...this.defaultOptions
    };
    this.messages = [];
  }
}
