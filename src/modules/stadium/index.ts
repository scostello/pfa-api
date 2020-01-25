import { QueryBuilder } from 'knex';
import { CreateStadiumResolvers, CreateStadiumTypeDefs } from './api';
import { CreateStadiumRepo } from './repos';

const CreateModule = (client: QueryBuilder) => {
  return {
    resolvers: CreateStadiumResolvers(CreateStadiumRepo(client)),
    typeDefs: CreateStadiumTypeDefs(),
  };
};

export { CreateModule };
