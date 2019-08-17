// @flow
import Bluebird from 'bluebird';

type Location = {
  googleLocation?: ?Object,
  street1: ?string,
  street2: ?string,
  city: ?string,
  state: ?string,
  zipcode: ?string,
  countyFips: ?number,
  longitude: ?number,
  latitude: ?number,
  geo: ?string,
};

type DbStadium = {
  id_stadium: string,
  stadium_name: string,
  capacity: ?number,
  year_opened: ?number,
  google_location: Object,
  location_street1: ?string,
  location_street2: ?string,
  location_city: ?string,
  location_state: ?string,
  location_zipcode: ?string,
  location_county_fips: ?number,
  location_longitude: number,
  location_latitude: number,
  location_geo: string,
};

type JsStadium = {
  id: string,
  name: string,
  capacity: ?number,
  yearOpened: ?number,
  location: Location,
};

const serialize = {
  fromDb(stadium: DbStadium): JsStadium {
    return {
      id: (stadium || {}).id_stadium,
      name: (stadium || {}).stadium_name,
      capacity: (stadium || {}).capacity,
      yearOpened: (stadium || {}).year_opened,
      location: {
        googleLocation: (stadium || {}).google_location,
        street1: (stadium || {}).location_street1,
        street2: (stadium || {}).location_street2,
        city: (stadium || {}).location_city,
        state: (stadium || {}).location_state,
        zipcode: (stadium || {}).location_zipcode,
        countyFips: (stadium || {}).location_county_fips,
        longitude: (stadium || {}).location_longitude,
        latitude: (stadium || {}).location_latitude,
        geo: (stadium || {}).location_geo,
      },
    };
  },
  totalCount: ({ count }) => count,
};

const orderByMap = {
  id: 'id_stadium',
  name: 'name',
};

const getTotalCount = db => db
  .withSchema('reporting')
  .from('stadiums')
  .count('id_stadium')
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
      .from('stadiums')
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
        stadiums: query
          .map(stadium => ({
            ...serialize.fromDb(stadium),
            cursor: stadium[orderField],
          })),
      });
  },
  getStadiumById(id: string) {
    return db
      .withSchema('reporting')
      .from('stadiums')
      .where({ id_stadium: id })
      .select('*')
      .first()
      .then(serialize.fromDb);
  },
});
