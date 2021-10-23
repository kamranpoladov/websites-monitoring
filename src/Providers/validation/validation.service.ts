import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { ValidatorOptions, validate } from 'class-validator';
import { createSpinner } from 'nestjs-console';

import { LoggerService } from 'Providers';

@Injectable()
export class ValidationService {
  constructor(
    @Inject(forwardRef(() => LoggerService))
    private readonly loggerService: LoggerService
  ) {}
  public async validate(object: object, options?: ValidatorOptions) {
    const spinner = createSpinner({ text: 'Validating...' }).start();
    const errors = await validate(object, options);

    if (errors.length) {
      spinner.fail('Validation failed!');
      const messages = errors.map(({ constraints }) =>
        constraints ? Object.values(constraints)[0] : ''
      );
      messages.forEach(message => {
        this.loggerService.error(message);
      });
      this.loggerService.error('Please, restart the application');
      process.exit();
    }

    spinner.succeed('Validation passed!');
  }
}
