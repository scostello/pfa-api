import { ApolloServer, IResolvers } from 'apollo-server-express';
import express, { Application } from 'express';
import { DocumentNode } from 'graphql';
import { Server } from 'http';
import merge from 'lodash.merge';
import * as Rx from 'rxjs';
import { Relay, Util } from '../../shared';
import { createGqlServer } from './gqlServer';
import { createHttpServer } from './httpServer';
import { CreateRootResolvers, CreateRootTypeDefs } from './rootSchema';

interface ApiConfig {
  readonly typeDefs: DocumentNode[];
  readonly resolvers: IResolvers;
}

const withRootResolvers = (resolvers: IResolvers): IResolvers =>  merge(resolvers, CreateRootResolvers());

const withRootTypeDefs = (typeDefs: DocumentNode[]): DocumentNode[] =>  ([
  ...typeDefs,
  CreateRootTypeDefs()
]);

const context = ({ req, connection }) => {
  if (connection) {
    return connection.context;
  }

  return {
    req,
    util: {
      ...Util,
      ...Relay,
    },
  };
};

const createApi = (config: ApiConfig): Rx.Observable<Server> => {
  const { typeDefs, resolvers } = config;
  const app: Application = express();
  const gqlServer: ApolloServer = createGqlServer({
    typeDefs: withRootTypeDefs(typeDefs),
    resolvers: withRootResolvers(resolvers),
    context,
  });

  // tslint:disable-next-line:no-expression-statement
  gqlServer.applyMiddleware({ app });
  const httpServer = createHttpServer(app);

  // tslint:disable-next-line:no-expression-statement
  gqlServer.installSubscriptionHandlers(httpServer);

  return Rx.of(httpServer);
};

export { createApi };
