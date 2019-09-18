import createApi from './api';

const config = {
  host: process.env.API_HOST || '0.0.0.0',
  port: process.env.API_PORT || 4000,
};

const listenCallback = () =>
  console.log(`🚀 Server ready at http://${config.host}:${config.port}!`);

createApi()
  .subscribe({
    next: api => api
      .listen(config, listenCallback),
  });
