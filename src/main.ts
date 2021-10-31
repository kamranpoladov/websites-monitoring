import * as fs from 'fs';

import { BootstrapConsole } from 'nestjs-console';

import { AppModule } from 'Modules';

// delete old error logs on exit
process.on('exit', () => {
  if (fs.existsSync('errors.log')) {
    fs.unlinkSync('errors.log');
  }
});

const bootstrap = new BootstrapConsole({
  module: AppModule,
  useDecorators: true
});
bootstrap.init().then(async app => {
  try {
    await app.init();
    await bootstrap.boot();
  } catch (e) {
    console.error(e);
    await app.close();
    process.exit(1);
  }
});
