import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import http from 'http';
import client from 'knex';
import * as Rx from 'rxjs';
import * as RxOp from 'rxjs/operators';

import schema from './schema';
import { FranchiseSvcFxty, StadiumSvcFxty } from './svc';
import util from './util';

const getContext = db => {
  const franchiseSvc = FranchiseSvcFxty(db);
  const stadiumSvc = StadiumSvcFxty(db);

  return () => ({
    franchiseSvc,
    stadiumSvc,
    util
  });
};

const mapServer = ([db, app, httpServerFxty, gqlServerFxty]) => {
  const gqlServer = gqlServerFxty(getContext(db));
  // tslint:disable-next-line:no-expression-statement
  gqlServer.applyMiddleware({ app });
  const httpServer = httpServerFxty(app);
  // tslint:disable-next-line:no-expression-statement
  gqlServer.installSubscriptionHandlers(httpServer);
  return Rx.of(httpServer);
};

export default () => {
  const db$ = Rx.of(
    client({
      client: 'pg',
      connection: {
        database: process.env.PG_DB_NAME || 'postgres',
        host: process.env.PG_HOST || 'localhost',
        password: process.env.PG_DB_PASSWORD || null,
        port: Number(process.env.PG_PORT) || 5432,
        user: process.env.PG_DB_USER || 'postgres'
      }
    })
  );
  const app$ = Rx.of(express());
  const httpServerFxty$ = Rx.of(app => http.createServer(app));
  const gqlServerFxty$ = Rx.of(
    context => new ApolloServer({ schema, context })
  );

  return Rx.forkJoin([db$, app$, httpServerFxty$, gqlServerFxty$]).pipe(
    RxOp.mergeMap(mapServer)
  );
};
