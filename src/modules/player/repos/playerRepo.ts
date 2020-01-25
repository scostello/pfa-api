import Bluebird from 'bluebird';
import { QueryBuilder } from 'knex';
import { PersonName } from '../../../types';
import { Player } from '../domain';

type PlayerName = Partial<PersonName>;

interface PlayerRepo {
  readonly findById: (id: number) => Promise<Player>;
  readonly findByName: (name: PlayerName) => Bluebird<Player>;
}

const findByIdWith = (baseQuery: QueryBuilder) =>
  (id: number): Bluebird<Player> =>
    baseQuery
      .select<Player>('*')
      .where({ id_player: id });

const findByNameWith = (baseQuery: QueryBuilder) =>
  (name: PlayerName): Bluebird<Player> =>
    baseQuery
      .select<Player>()
      .where({ first_name: name.first })
      .orWhere({ last_name: name.last });

const CreatePlayerRepo = (client: QueryBuilder): PlayerRepo => {
  const baseQuery = client
    .withSchema('reporting')
    .from('players');

  return {
    findById: findByIdWith(baseQuery),
    findByName: findByNameWith(baseQuery),
  };
};

export {
  CreatePlayerRepo,
  findByIdWith,
  findByNameWith,
};
