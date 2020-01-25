import Knex from 'knex';
import * as Rx from 'rxjs';
import { createKnexClient } from './knex';

type DbConfig = Knex.Config;

const createDbClient = (config: DbConfig): Rx.Observable<Knex> => Rx.of(createKnexClient(config));

export { createDbClient }
