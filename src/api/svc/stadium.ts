import Bluebird from 'bluebird';

interface Location {
  readonly googleLocation: object;
  readonly street1: string;
  readonly street2: string;
  readonly city: string;
  readonly state: string;
  readonly zipcode: string;
  readonly countyFips: number;
  readonly longitude: number;
  readonly latitude: number;
  readonly geo: string;
}

interface DbStadium {
  readonly id_stadium: string;
  readonly stadium_name: string;
  readonly capacity: number;
  readonly year_opened: number;
  readonly google_location: object;
  readonly location_street1: string;
  readonly location_street2: string;
  readonly location_city: string;
  readonly location_state: string;
  readonly location_zipcode: string;
  readonly location_county_fips: number;
  readonly location_longitude: number;
  readonly location_latitude: number;
  readonly location_geo: string;
}

interface JsStadium {
  readonly id: string;
  readonly name: string;
  readonly capacity: number;
  readonly yearOpened: number;
  readonly location: Location;
}

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
        geo: (stadium || {}).location_geo
      }
    };
  },
  totalCount: ({ count }) => count
};

const orderByMap = {
  id: 'id_stadium',
  name: 'name'
};

const getTotalCount = db =>
  db
    .withSchema('reporting')
    .from('stadiums')
    .count('id_stadium')
    .first();

interface OrderCriteria {
  readonly direction: 'asc' | 'desc';
  readonly field: string;
}

interface FindCriteria {
  readonly cursor?: string;
  readonly first?: number;
  readonly orderBy?: OrderCriteria;
}

interface StadiumSvc {
  readonly find: (criteria: FindCriteria) => Bluebird<any>;
  readonly getStadiumById: (id: string) => Bluebird<any>;
}

export default (db): StadiumSvc => ({
  find: (criteria: FindCriteria) => {
    const {
      cursor,
      first = 10,
      orderBy = { direction: 'asc', field: 'id' }
    } = criteria;

    const orderField = orderByMap[orderBy.field] || orderByMap.id;
    const orderDirection = orderBy.direction || 'asc';

    const builder = db
      .withSchema('reporting')
      .from('stadiums')
      .select('*')
      .limit(first)
      .orderBy([
        {
          column: orderField,
          order: orderDirection
        }
      ]);

    const query = cursor
      ? builder.where(
          orderField,
          orderBy.direction === 'asc' ? '>' : '<',
          cursor
        )
      : builder;

    return Bluebird.props({
      totalCount: getTotalCount(db).then(serialize.totalCount),
      stadiums: query.map(stadium => ({
        ...serialize.fromDb(stadium),
        cursor: stadium[orderField]
      }))
    });
  },
  getStadiumById: (id: string) => {
    return db
      .withSchema('reporting')
      .from('stadiums')
      .where({ id_stadium: id })
      .select('*')
      .first()
      .then(serialize.fromDb);
  }
});
