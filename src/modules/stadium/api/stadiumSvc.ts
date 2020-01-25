import * as R from 'ramda';
import { Relay } from '../../../shared';
import { StadiumRepo } from '../repos/stadiumRepo';

const withConnectionProps = R
  .compose(
    Relay.withNodes,
    Relay.withEdges,
    Relay.withPageInfo,
  );

const CreateStadiumSvc = (repo: StadiumRepo) => {
  return {
    query: {
      stadiums: () => ({}),
    },
    stadiumConnection: {
      nodes: withConnectionProps(R.prop('nodes')),
      edges: withConnectionProps(R.prop('edges')),
      pageInfo: withConnectionProps(R.prop('pageInfo')),
      totalCount: () => repo.total(),
    },
  };
};

export { CreateStadiumSvc };
