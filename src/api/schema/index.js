// @flow
import * as R from 'ramda';
import { makeExecutableSchema } from 'graphql-tools';
import { gql } from 'apollo-server';
import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import players from './players';
import franchises from './franchises';

const rootSchema = gql`
  scalar JSON
  
  enum OrderDirection {
    asc
    desc
  }
  
  interface Node {
    id  : ID!
  }
  
  type PageInfo {
    startCursor     : String
    endCursor       : String    
    hasNextPage     : Boolean!
    hasPreviousPage : Boolean!
  }
  
  # Base Query type we'll use to extend in the other modules
  type Query {
    _ : Boolean
  }
  
  type Mutation {
    _: Boolean
  }
  
  type Subscription {
    _: Boolean
  }
`;

const rootResolvers = {
  JSON: GraphQLJSON,
  Query: {
    _: () => true,
  },
  Mutation: {
    _: () => true,
  },
  Subscription: {
    _: () => true,
  },
};

const typeDefs = [
  rootSchema,
  ...players.typeDefs,
  ...franchises.typeDefs,
];

const resolversFrom = R.prop('resolvers');

const resolvers = merge(
  rootResolvers,
  resolversFrom(players),
  resolversFrom(franchises),
);

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
