// @flow
import Bluebird from 'bluebird';

type DbFranchise = {
  id_franchise: string,
  id_stadium: string,
  current_name_abbr: string,
  current_name_full: string,
  current_mascot: string,
  active_from: number,
  active_to: number,
};

type JsFranchise = {
  id: string,
  idStadium: string,
  currentNameAbbr: string,
  currentNameFull: string,
  currentMascot: string,
  activeFrom: number,
  activeTo: number,
};

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

type OrderCriteria = {
  direction: ('asc' | 'desc'),
  field: string,
};

type FindCriteria = {
  cursor?: string,
  first?: ?number,
  orderBy?: OrderCriteria,
};

export default db => ({
  find(criteria: FindCriteria) {
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
