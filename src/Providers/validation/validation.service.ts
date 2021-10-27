import { Injectable } from '@nestjs/common';
import { ValidatorOptions, validate } from 'class-validator';

@Injectable()
export class ValidationService {
  public async validate(object: object, options?: ValidatorOptions) {
    const errors = await validate(object, options);

    return errors.map(({ constraints }) =>
      constraints ? Object.values(constraints)[0] : ''
    );
  }
}
