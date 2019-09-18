import Bluebird from 'bluebird';

export interface DbFranchise {
  readonly id_franchise: string,
  readonly id_stadium: string,
  readonly current_name_abbr: string,
  readonly current_name_full: string,
  readonly current_mascot: string,
  readonly active_from: number,
  readonly active_to: number,
}

export interface JsFranchise {
  readonly id: string,
  readonly idStadium: string,
  readonly currentNameAbbr: string,
  readonly currentNameFull: string,
  readonly currentMascot: string,
  readonly activeFrom: number,
  readonly activeTo: number,
}

const serialize = {
  fromDb(franchise: DbFranchise): JsFranchise {
    return {
      id: franchise.id_franchise,
      idStadium: franchise.id_stadium,
      currentNameAbbr: franchise.current_name_abbr,
      currentNameFull: franchise.current_name_full,
      currentMascot: franchise.current_mascot,
      activeFrom: franchise.active_from,
      activeTo: franchise.active_to,
    };
  },
  totalCount: ({ count }) => count,
};

const orderByMap = {
  id: 'id_franchise',
  name: 'team_abbr',
};

const getTotalCount = db => db
  .withSchema('reporting')
  .from('franchises')
  .count('id_franchise')
  .first();

interface OrderCriteria {
  readonly direction: ('asc' | 'desc'),
  readonly field: string,
}

interface FindCriteria {
  readonly cursor?: string,
  readonly first?: number,
  readonly orderBy?: OrderCriteria,
}

interface FranchiseSvc {
  readonly find: (FindCriteria) => Bluebird<any>;
}

export default (db): FranchiseSvc => ({
  find: (criteria: FindCriteria) => {
    const {
      cursor,
      first = 10,
      orderBy = { direction: 'asc', field: 'id' },
    } = criteria;

    const orderField = orderByMap[orderBy.field] || orderByMap.id;
    const orderDirection = orderBy.direction || 'asc';

    const query = db
      .withSchema('reporting')
      .from('franchises')
      .select('*')
      .limit(first)
      .orderBy([{
        column: orderField,
        order: orderDirection,
      }]);

    if (cursor) {
      query
        .where(orderField, orderBy.direction === 'asc' ? '>' : '<', cursor);
    }

    return Bluebird
      .props({
        totalCount: getTotalCount(db)
          .then(serialize.totalCount),
        franchises: query
          .map(franchise => ({
            ...serialize.fromDb(franchise),
            cursor: franchise[orderField],
          })),
      });
  },
});
