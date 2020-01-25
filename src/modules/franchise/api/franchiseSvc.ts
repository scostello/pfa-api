import * as R from 'ramda';
import { Relay } from '../../../shared';
import { Franchise } from '../domain';
import { FranchiseRepo } from '../repos/franchiseRepo';

const withConnectionProps = R
  .compose(
    Relay.withNodes,
    Relay.withEdges,
    Relay.withPageInfo,
  );

const CreateFranchiseSvc = (repo: FranchiseRepo) => {
  return {
    query: {
      franchises: Relay.withFetchCriteria<Franchise[]>(({ criteria }) => repo.fetch(criteria)),
    },
    franchiseConnection: {
      nodes: withConnectionProps(R.prop('nodes')),
      edges: withConnectionProps(R.prop('edges')),
      pageInfo: withConnectionProps(R.prop('pageInfo')),
      totalCount: () => repo.total(),
    },
    franchiseNode: {
      stadium: ({ id }) => repo.findStadium(id),
    },
  };
};

export { CreateFranchiseSvc };