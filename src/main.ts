import { BootstrapConsole } from 'nestjs-console';

import { AppModule } from 'Modules';

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
