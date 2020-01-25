import Knex from 'knex';

const createKnexClient = (config: Knex.Config): Knex => Knex(config);

export { createKnexClient }