import App from './Core/App';
import { Logger } from '@ricdotnet/logger/dist';

const app: App = new App();

(async () => {
  await Logger.checkLogDir();
  await app.tryConnection().then((r) => {
    Logger.info(r);
    app.setMiddlewares().initialiseRoutes().runServer();
  }).catch((r) => {
    Logger.error(r);
  });
})();
