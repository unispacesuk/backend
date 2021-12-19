import App from './Core/App';

const app: App = new App();

app.setMiddlewares().tryConnection().RunServer();
