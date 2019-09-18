import { gql } from 'apollo-server';
import {
  GraphQLDate,
  GraphQLDateTime,
  GraphQLTime,
} from 'graphql-iso-date';
import { ITypeDefinitions, makeExecutableSchema} from 'graphql-tools';
import GraphQLJSON from 'graphql-type-json';
import merge from 'lodash.merge';
import * as R from 'ramda';
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
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
  Mutation: {
    _: () => true,
  },
  Query: {
    _: () => true,
  },
  Subscription: {
    _: () => true,
  },
  Time: GraphQLTime,
};

const typeDefs: ITypeDefinitions = [
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
  resolvers,
  typeDefs,
});
