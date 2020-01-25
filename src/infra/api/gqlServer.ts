import { ApolloServer, ApolloServerExpressConfig, IResolvers } from 'apollo-server-express';
import { DocumentNode } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

interface GqlServerConfig extends Pick<ApolloServerExpressConfig, 'context'> {
  readonly typeDefs: DocumentNode[];
  readonly resolvers: IResolvers;
}

const createGqlServer = (config: GqlServerConfig): ApolloServer => {
  const { typeDefs, resolvers, context } = config;
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  return new ApolloServer({ schema, context });
};

export { createGqlServer }
