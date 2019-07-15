// @flow
import { StadiumSchema } from './typeDefs';
import { StadiumResolvers } from './resolvers';

export default {
  typeDefs: [StadiumSchema],
  resolvers: StadiumResolvers,
};