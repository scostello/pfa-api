import Bluebird from 'bluebird';
import * as R from 'ramda';
import { Edge, FetchCriteria, Node, PageInfo } from '../types';
import { Util } from './util';

interface UtilArgs {
  readonly util?: any;
}

interface FetchArgs extends UtilArgs {
  readonly criteria: FetchCriteria,
}

type Fetch<T> = (args: FetchArgs) => Bluebird<T>;

interface ConnectionProps {
  readonly nodes?: Node[];
  readonly edges?: Array<Edge<{ readonly cursor: string }>>;
  readonly pageInfo?: PageInfo;
}

type ConnectionResolveProps = ConnectionProps & UtilArgs;

const withFetchCriteria = <T>(resolve: Fetch<T>) =>
  (...resolverArgs) => {
    const [, queryArgs, { util }] = resolverArgs;
    const {
      cursor,
      first = 10,
      orderBy = { direction: 'asc', field: 'id' }
    } = queryArgs;

    const criteria = {
      cursor: cursor && util.fromBase64(cursor),
      first,
      orderBy
    };

    return resolve({ criteria, util });
  };

type ConnectionResolve<T = any> = (arg: ConnectionResolveProps) => T;

const withNodes = (resolve: ConnectionResolve) =>
  (...resolverArgs) => {
    const [nodes,, { util }] = resolverArgs;
    return resolve({ nodes, util });
  };

const withEdges = (resolve: ConnectionResolve) =>
  ({ nodes, util }) => {
    const edges = nodes.map(util.nodeToEdge);
    return resolve({ nodes, edges, util });
  };

const withPageInfo = <A extends Node, B>(resolve: ConnectionResolve<B>) =>
  ({ nodes, edges, util }) => {
    const end = util.toBase64(R.prop<'cursor', Edge<A>>('cursor', R.last<Edge<A>>(edges)));
    const start = util.toBase64(R.prop<'cursor', Edge<A>>('cursor', R.head<Edge<A>>(edges)));

    return resolve({
      nodes,
      edges,
      pageInfo: {
        endCursor: end,
        startCursor: start,
      },
      util,
    });
  };

const nodeToEdge = node => ({
  node,
  cursor: Util.toBase64(node.cursor),
});

export {
  nodeToEdge,
  withFetchCriteria,
  withNodes,
  withEdges,
  withPageInfo,
};
