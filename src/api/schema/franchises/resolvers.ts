import * as R from 'ramda';

export interface FranchisesOrder {
  readonly direction?: 'asc' | 'desc',
  readonly field?: 'id' | 'name',
}

export interface FranchisesArgs {
  readonly cursor?: string,
  readonly first?: number,
  readonly orderBy?: FranchisesOrder,
}

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
    edges: ({ franchises }, {}, { util }) => franchises
      .map(util.nodeToEdge(util.toBase64)),
    totalCount: ({ totalCount }) => totalCount,
    pageInfo: ({ franchises }, {}, { util }) => ({
      endCursor: util.toBase64(R.prop('cursor', R.last(franchises))),
      startCursor: util.toBase64(R.prop('cursor', R.head(franchises))),
    }),
  },
  Franchise: {
    currentStadium: async (franchise, {}, { stadiumSvc }) => stadiumSvc
      .getStadiumById(franchise.idStadium),
  },
};
