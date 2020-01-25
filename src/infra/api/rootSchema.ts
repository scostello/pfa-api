import { gql } from 'apollo-server';
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';

const CreateRootTypeDefs = () => gql`
  """
  Scalers
  """
  scalar JSON
  scalar Date
  scalar Time
  scalar DateTime

  """
  Enums
  """
  enum OrderDirection {
    asc
    desc
  }

  """
  Interfaces
  """
  interface Node {
    id: ID!
  }

  interface Edge {
    cursor: String!
    node: Node
  }

  interface Connection {
    edges: [Edge]
    nodes: [Node]
    pageInfo: PageInfo!
    totalCount: Int!
  }
  
  """
  Types
  """
  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean!
    hasPreviousPage: Boolean!
  }

  """
  Root Operations
  """
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`;

const CreateRootResolvers = () => ({
  Date: GraphQLDate,
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,
  Mutation: {
    _: () => true
  },
  Query: {
    _: () => true
  },
  Subscription: {
    _: () => true
  },
  Time: GraphQLTime
});

export { CreateRootResolvers, CreateRootTypeDefs };
