// @flow
import createApi from './api';

const config = {
  host: process.env.API_HOST || '0.0.0.0',
  port: process.env.API_PORT || 4000,
};

const listenCallback = () => console.log('🚀 Server ready at http://localhost:4000!!');

createApi()
  .subscribe({
    next: api => api.listen(config, listenCallback),
  });
