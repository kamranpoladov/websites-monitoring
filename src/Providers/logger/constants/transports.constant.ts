import winston from 'winston';

import { ERRORS_FILE_NAME } from '../../../Constants';

export const transports = {
  console: new winston.transports.Console({ level: 'info' }),
  file: new winston.transports.File({
    filename: ERRORS_FILE_NAME,
    level: 'error'
  })
};
