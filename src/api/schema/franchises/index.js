// @flow
import { FranchiseSchema } from './typeDefs';
import { FranchiseResolvers } from './resolvers';

export default {
  typeDefs: [FranchiseSchema],
  resolvers: FranchiseResolvers,
};
