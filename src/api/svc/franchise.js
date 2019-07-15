// @flow
import Bluebird from 'bluebird';

type DbFranchise = {
  id_franchise: string,
  id_stadium: string,
  id_logo: string,
  team_abbr: string,
  team_full: string,
  mascot: string,
  active_from: number,
  active_to: number,
};

type JsFranchise = {
  id: string,
  idStadium: string,
  idLogo: string,
  nameAbbr: string,
  nameFull: string,
  mascot: string,
  activeFrom: number,
  activeTo: number,
};

const serialize = {
  fromDb(franchise: DbFranchise): JsFranchise {
    return {
      id: franchise.id_franchise,
      idStadium: franchise.id_stadium,
      idLogo: franchise.id_logo,
      nameAbbr: franchise.team_abbr,
      nameFull: franchise.team_full,
      mascot: franchise.mascot,
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

export default db => ({
  find(criteria) {
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
  getStadiumFor(franchise) {
    return db
      .withSchema('reporting')
      .from('franchises')
      .leftJoin('stadiums', 'franchises.id_stadium', 'stadiums.id_stadium')
      .where('franchises.id_franchise', franchise.id)
      .select([
        'stadiums.name',
      ])
      .first();
  },
});
