import merge from 'lodash.merge';
import * as RxOp from 'rxjs/operators';
import { createApi, createDbClient } from './infra';
import { franchise, stadium } from './modules';

const config = {
  host: process.env.API_HOST || '0.0.0.0',
  port: process.env.API_PORT || 4000
};

const listenCallback = () =>
  // tslint:disable-next-line:no-console
  console.log(`🚀 Server ready at http://${config.host}:${config.port}!!!!`);

const initialize = dbClient => {
  const FranchiseModule = franchise.CreateModule(dbClient);
  const StadiumModule = stadium.CreateModule(dbClient);

  return createApi({
    typeDefs: [
      FranchiseModule.typeDefs,
      StadiumModule.typeDefs,
    ],
    resolvers: merge(
      FranchiseModule.resolvers,
      StadiumModule.resolvers,
    ),
  });
};

const bootstrap = () => {
  const dbClient$ = createDbClient({
    client: 'pg',
    connection: {
      database: process.env.PG_DB_NAME || 'postgres',
      host: process.env.PG_HOST || 'localhost',
      password: process.env.PG_DB_PASSWORD || null,
      port: Number(process.env.PG_PORT) || 5432,
      user: process.env.PG_DB_USER || 'postgres'
    }
  });

  // tslint:disable-next-line:no-expression-statement
  dbClient$
    .pipe(RxOp.mergeMap(initialize))
    .subscribe({
      next: api => api.listen(config, listenCallback)
    });
};

bootstrap();
