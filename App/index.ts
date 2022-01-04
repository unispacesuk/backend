import App from './Core/App';

const app: App = new App();

(async () => {
  await app.tryConnection().then((r) => {
    console.log(r);
    app.setMiddlewares().initialiseRoutes().runServer();
  }).catch((r) => {
    console.log(r);
  });
})();
