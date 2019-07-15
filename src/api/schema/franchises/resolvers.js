// @flow
import * as R from 'ramda';
import * as R_ from 'ramda-extension';

const fieldsMap = {
  CREATED_AT: 'id_franchise',
  NAME: 'team_abbr',
  YEAR_FOUNDED: 'active_from',
};

const buildQueryOpts = ({ cursor, first = 50, orderBy }) => {
  const orderField = {
    field: R.propOr('id_franchise', R.pathOr('CREATED_AT', ['field'], orderBy), fieldsMap),
    direction: R.pathOr('ASC', ['direction'], orderBy),
  };

  return {
    order: [
      R.ifElse(
        R.isNil,
        R.always(orderField),
        () => R.assoc('last', cursor, orderField),
      )(cursor),
    ],
    pageLength: first,
  };
};

const getFranchises = (_, args, { client }) => client
  .reporting
  .franchise_stadiums
  .find({ is_active: true }, buildQueryOpts(args))
  .then(franchises => franchises.map(R_.camelizeKeys))
  .then(franchises => ({
    cursor: R.prop('idFranchise', R.last(franchises)),
    nodes: franchises,
  }))
  .catch(err => console.log(err));

const getSeasonStats = ({ teamAbbr }, args, { client }) => client
  .reporting
  .team_game_outcomes_materialized
  .find({ team_abbr: teamAbbr }, { order: [{ field: 'season', direction: 'ASC' }] })
  .then(gameOutcomes => gameOutcomes.map(R_.camelizeKeys))
  .catch(err => console.log(err));

type BasicQuery = (string) => string;

const outcomeTotalsQuery: BasicQuery = (teamAbbr: string): string => `
  SELECT
    team_abbr,
    SUM(total_games)        AS total_games,
    SUM(total_wins)         AS total_wins,
    SUM(total_losses)       AS total_losses,
    SUM(total_ties)         AS total_ties,
    SUM(total_home_games)   AS total_home_games,
    SUM(total_away_games)   AS total_home_games,
    (SUM(total_wins)::numeric / SUM(total_games)::numeric) * 100.0 AS winning_percentage
  FROM
    reporting.team_game_outcomes_materialized
  WHERE
    team_abbr = UPPER('${teamAbbr}')
  GROUP BY
    team_abbr
  ORDER BY
    team_abbr;
`;

const getTotalStats = ({ teamAbbr }, args, { client }) => client
  .query(outcomeTotalsQuery(teamAbbr))
  .then(gameOutcomes => R_.camelizeKeys(gameOutcomes[0]))
  .catch(err => console.log(err));

type FranchisesOrder = {
  direction?: 'asc' | 'desc',
  field?: 'id' | 'name',
};

type FranchisesArgs = {
  cursor?: ?string,
  first?: ?number,
  orderBy?: ?FranchisesOrder,
};

type Encode = (any) => string;

const nodeToEdge = (encode: Encode) => node => ({
  node,
  cursor: encode(node.cursor),
});

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
      .map(nodeToEdge(util.toBase64)),
    totalCount: ({ totalCount }) => totalCount,
    pageInfo: ({ franchises }, args, { util }) => ({
      startCursor: util.toBase64(R.prop('cursor', R.head(franchises))),
      endCursor: util.toBase64(R.prop('cursor', R.last(franchises))),
    }),
  },
  Franchise: {
    stadium: (franchise, args, { franchiseSvc }) => franchiseSvc
      .getStadiumFor(franchise),
  },
};
