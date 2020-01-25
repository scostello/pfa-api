import { Application } from 'express';
import http, { Server } from 'http';

const createHttpServer = (app: Application): Server => {
  return http.createServer(app);
};

export { createHttpServer }