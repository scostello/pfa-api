// @flow
import * as R from 'ramda';

type StadiumsOrder = {
  direction?: 'asc' | 'desc',
  field?: 'id' | 'name',
};

type StadiumsArgs = {
  cursor?: ?string,
  first?: ?number,
  orderBy?: ?StadiumsOrder,
};

export const StadiumResolvers = {
  Query: {
    stadiums: (_, args: StadiumsArgs, { stadiumSvc, util }) => {
      const {
        cursor,
        first = 10,
        orderBy = { direction: 'asc', field: 'id' },
      } = args;

      return stadiumSvc
        .find({
          cursor: cursor && util.fromBase64(cursor),
          first,
          orderBy,
        });
    },
  },
  StadiumConnection: {
    nodes: ({ stadiums }) => stadiums,
    edges: ({ stadiums }, args, { util }) => stadiums
      .map(util.nodeToEdge(util.toBase64)),
    totalCount: ({ totalCount }) => totalCount,
    pageInfo: ({ stadiums }, args, { util }) => ({
      startCursor: util.toBase64(R.prop('cursor', R.head(stadiums))),
      endCursor: util.toBase64(R.prop('cursor', R.last(stadiums))),
    }),
  },
};
