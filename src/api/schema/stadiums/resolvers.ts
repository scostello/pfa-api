import * as R from 'ramda';

export interface StadiumsOrder {
  readonly direction?: 'asc' | 'desc';
  readonly field?: 'id' | 'name';
}

export interface StadiumsArgs {
  readonly cursor?: string;
  readonly first?: number;
  readonly orderBy?: StadiumsOrder;
}

export const StadiumResolvers = {
  Query: {
    stadiums: (_, args: StadiumsArgs, { stadiumSvc, util }) => {
      const {
        cursor,
        first = 10,
        orderBy = { direction: 'asc', field: 'id' }
      } = args;

      return stadiumSvc.find({
        cursor: cursor && util.fromBase64(cursor),
        first,
        orderBy
      });
    }
  },
  StadiumConnection: {
    nodes: ({ stadiums }) => stadiums,
    edges: ({ stadiums }, {}, { util }) =>
      stadiums.map(util.nodeToEdge(util.toBase64)),
    pageInfo: ({ stadiums }, {}, { util }) => ({
      endCursor: util.toBase64(R.prop('cursor', R.last(stadiums))),
      startCursor: util.toBase64(R.prop('cursor', R.head(stadiums)))
    }),
    totalCount: ({ totalCount }) => totalCount
  }
};
