import Bluebird from 'bluebird';
import { QueryBuilder } from 'knex';
import { Stadium } from '../domain';
import { StadiumMap, StadiumPersistence } from '../mappers';

export interface StadiumRepo {
  readonly findById: (id: number) => Bluebird<Stadium>;
  readonly total: () => number;
}

const findByIdWith = (baseQuery: QueryBuilder) =>
  (stadiumId: number): Bluebird<Stadium> =>
    baseQuery
      .select<StadiumPersistence>('*')
      .where({ id_stadium: stadiumId })
      .first(1)
      .then(StadiumMap.toDomain);

const totalWith = (baseQuery: QueryBuilder) =>
  (): Bluebird<number> =>
    baseQuery
      .count('id_stadium')
      .first()
      .then(({ count }) => count);

const CreateStadiumRepo = (client: QueryBuilder): StadiumRepo => {
  const baseQuery = client
    .withSchema('reporting')
    .from<StadiumPersistence>('stadiums');

  return {
    findById: findByIdWith(baseQuery),
    total: totalWith(baseQuery),
  };
};

export {
  CreateStadiumRepo,
  findByIdWith,
};
