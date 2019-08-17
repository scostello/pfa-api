// @flow
import * as R from 'ramda';

type FranchisesOrder = {
  direction?: 'asc' | 'desc',
  field?: 'id' | 'name',
};

type FranchisesArgs = {
  cursor?: ?string,
  first?: ?number,
  orderBy?: ?FranchisesOrder,
};

export const FranchiseResolvers = {
  Query: {
    franchises: (_, args: FranchisesArgs, { franchiseSvc, util }) => {
      const {
        cursor,
        first = 10,
        orderBy = { direction: 'asc', field: 'id' },
      } = args;

      return franchiseSvc
        .find({
          cursor: cursor && util.fromBase64(cursor),
          first,
          orderBy,
        });
    },
  },
  FranchiseConnection: {
    nodes: ({ franchises }) => franchises,
    edges: ({ franchises }, args, { util }) => franchises
      .map(util.nodeToEdge(util.toBase64)),
    totalCount: ({ totalCount }) => totalCount,
    pageInfo: ({ franchises }, args, { util }) => ({
      startCursor: util.toBase64(R.prop('cursor', R.head(franchises))),
      endCursor: util.toBase64(R.prop('cursor', R.last(franchises))),
    }),
  },
  Franchise: {
    currentStadium: async (franchise, args, { stadiumSvc }) => stadiumSvc
      .getStadiumById(franchise.idStadium),
  },
};
