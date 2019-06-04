// @flow
import { gql } from 'apollo-server';

const typeDefs = [gql`
  extend type Query {
    players: JSON  
  }
`];

export const resolvers = {
  Query: {
    players: (_, __, { client }) => client.reporting.players.find({}, { limit: 15 }),
  },
};

export default {
  typeDefs,
  resolvers,
};
