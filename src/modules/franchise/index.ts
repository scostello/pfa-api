import { QueryBuilder } from 'knex';
import { CreateFranchiseResolvers, CreateFranchiseTypeDefs } from './api';
import { CreateFranchiseRepo } from './repos';

const CreateModule = (client: QueryBuilder) => ({
  resolvers: CreateFranchiseResolvers(CreateFranchiseRepo(client)),
  typeDefs: CreateFranchiseTypeDefs(),
});

export { CreateModule };
