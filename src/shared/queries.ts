import Bluebird from 'bluebird';
import { QueryBuilder } from 'knex';
import { FetchCriteria } from '../types';
import { OrderDirection } from '../types/criteria';

export interface OrderByMap {
  readonly id: string;
}

const createFetchCriteriaWith = <T extends OrderByMap>(orderByMap: T) =>
  (criteria: FetchCriteria): FetchCriteria => {
    const {
      orderBy = { direction: 'asc', field: 'id' }
    } = criteria;

    const orderField = orderByMap[orderBy.field] || orderByMap.id;
    const orderDirection = orderBy.direction || 'asc';

    return {
      ...criteria,
      orderBy: {
        field: orderField,
        direction: orderDirection as OrderDirection
      },
    };
  };

const withOrderByCriteria = (baseQuery: QueryBuilder, criteria): QueryBuilder => {
  const {
    first,
    orderBy,
  } = criteria;

  return baseQuery
    .clone()
    .select('*')
    .limit(first)
    .orderBy([
      {
        column: orderBy.field,
        order: orderBy.direction
      }
    ]);
};

const withCursorCriteria = (baseQuery: QueryBuilder, criteria): QueryBuilder => {
  const {
    cursor,
    orderBy
  } = criteria;

  return cursor
      ? baseQuery
        .clone()
        .where(
          orderBy.field,
          orderBy.direction === 'asc' ? '>' : '<',
          cursor
        )
      : baseQuery
        .clone();
};

const fetchWith = (fetchArgs) =>
  (rawCriteria: FetchCriteria) => {
    const {
      baseQuery,
      criteriaBuilder,
      domainMapper,
    } = fetchArgs;

    const criteria = criteriaBuilder(rawCriteria);

    const query = withOrderByCriteria(baseQuery, criteria);
    return Bluebird.resolve(withCursorCriteria(query, criteria))
      .then(entities => entities.map(entity => ({
        ...domainMapper(entity).merge(),
        cursor: entity[criteria.orderBy.field]
      })))
      .tap(entities => {
        console.log(entities);
      });
  };

export { createFetchCriteriaWith, fetchWith };
