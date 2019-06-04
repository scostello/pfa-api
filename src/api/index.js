// @flow
import http from 'http';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import * as Rx from 'rxjs';
import * as RxOp from 'rxjs/operators';

import massive from 'massive';
import schema from './schema';

const mapServer = ([_db, _app, _httpServerFxty, _gqlServerFxty]) => {
  _app.use('/healthz', (req, res) => res.sendStatus(200));
  const gqlServer = _gqlServerFxty({ client: _db });
  gqlServer.applyMiddleware({ app: _app });
  const httpServer = _httpServerFxty(_app);
  gqlServer.installSubscriptionHandlers(httpServer);
  return Rx.of(httpServer);
};

export default () => {
  const db$ = Rx.from(massive({
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    database: process.env.PG_DB_NAME || 'postgres',
    user: process.env.PG_DB_USER || 'postgres',
    password: process.env.PG_DB_PASSWORD || null,
    poolSize: 5,
  }));
  const app$ = Rx.of(express());
  const httpServerFxty$ = Rx.of(app => http.createServer(app));
  const gqlServerFxty$ = Rx.of(context => new ApolloServer({ schema, context }));

  return Rx.forkJoin([db$, app$, httpServerFxty$, gqlServerFxty$])
    .pipe(RxOp.mergeMap(mapServer));
};
