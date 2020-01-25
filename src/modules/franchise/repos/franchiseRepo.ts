import Bluebird from 'bluebird';
import { QueryBuilder } from 'knex';
import { createFetchCriteriaWith, fetchWith, OrderByMap } from '../../../shared/queries';
import { FetchCriteria } from '../../../types'
import { Stadium } from '../../stadium/domain';
import { Franchise } from '../domain';
import { FranchiseMap, FranchisePersistence } from '../mappers';

export interface FranchiseRepo {
  readonly fetch: (criteria: FetchCriteria) => Bluebird<Franchise[]>;
  readonly findById: (franchiseId: string) => Bluebird<Franchise>;
  readonly findStadium: (franchiseId: string) => Bluebird<Stadium>;
  readonly total: () => Bluebird<number>
}

const findByIdWith = (baseQuery: QueryBuilder) =>
  (franchiseId: string): Bluebird<Franchise> =>
    baseQuery
      .select<FranchisePersistence>('*')
      .where({ id_franchise: franchiseId })
      .first(1)
      .then(FranchiseMap.toDomain);

const findStadiumWith = (baseQuery: QueryBuilder) =>
  (franchiseId: string): Bluebird<Franchise> =>
    baseQuery
      .select<FranchisePersistence>('*')
      .where({ id_franchise: franchiseId })
      .innerJoin('reporting.stadiums', 'franchises.id_stadium', 'stadiums.id_stadium')
      .first(1)
      .then(franchise => FranchiseMap.toDomain(franchise));

const totalWith = (baseQuery: QueryBuilder) =>
  (): Bluebird<number> =>
    baseQuery
      .count('id_franchise')
      .first()
      .then(({ count }) => count);

interface FranchiseOrderByMap extends OrderByMap {
  readonly name: string;
}

const franchiseOrderByMap = (): FranchiseOrderByMap => ({
  id: 'id_franchise',
  name: 'current_name_abbr',
});

const fetchFranchisesWith = (baseQuery: QueryBuilder) => {
  return fetchWith({
    baseQuery,
    criteriaBuilder: createFetchCriteriaWith(franchiseOrderByMap()),
    domainMapper: FranchiseMap.toDomain,
  })
};

const CreateFranchiseRepo = (client: QueryBuilder): FranchiseRepo => {
  const baseQuery = client
    .withSchema('reporting')
    .from<FranchisePersistence>('franchises');

  return {
    fetch: fetchFranchisesWith(baseQuery.clone()),
    findById: findByIdWith(baseQuery.clone()),
    findStadium: findStadiumWith(baseQuery.clone()),
    total: totalWith(baseQuery.clone()),
  };
};

export {
  CreateFranchiseRepo,
  findByIdWith,
};
