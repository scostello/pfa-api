import createApi from './api';

const config = {
  host: process.env.API_HOST || '0.0.0.0',
  port: process.env.API_PORT || 4000
};

const listenCallback = () =>
  // tslint:disable-next-line:no-console
  console.log(`🚀 Server ready at http://${config.host}:${config.port}!`);

// tslint:disable-next-line:no-expression-statement
createApi().subscribe({
  next: api => api.listen(config, listenCallback)
});
