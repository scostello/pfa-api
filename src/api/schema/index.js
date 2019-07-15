// @flow
import * as R from 'ramda';
import { makeExecutableSchema } from 'graphql-tools';
import { gql } from 'apollo-server';
import merge from 'lodash.merge';
import GraphQLJSON from 'graphql-type-json';
import {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime,
} from 'graphql-iso-date';
import common from './common';
import franchises from './franchises';
import stadiums from './stadiums';

const rootSchema = gql`
  scalar JSON
  scalar Date
  scalar Time
  scalar DateTime
  
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
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
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
  ...common.typeDefs,
  ...franchises.typeDefs,
  ...stadiums.typeDefs,
];

const resolversFrom = R.prop('resolvers');

const resolvers = merge(
  rootResolvers,
  resolversFrom(franchises),
  resolversFrom(stadiums),
);

export default makeExecutableSchema({
  typeDefs,
  resolvers,
});
