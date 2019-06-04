// @flow
import { gql } from 'apollo-server';
import * as R from 'ramda';
import * as R_ from 'ramda-extension';

const FranchiseSchema = gql`
  type SeasonStats {
    season            : Int!
    totalHomeGames    : Int!
    totalAwayGames    : Int!
    totalGames        : Int!
    totalWins         : Int!
    totalLosses       : Int!
    totalTies         : Int!
    winningPercentage : Float!
  }
  
  type TotalStats {
    totalHomeGames    : Int!
    totalAwayGames    : Int!
    totalGames        : Int!
    totalWins         : Int!
    totalLosses       : Int!
    totalTies         : Int!
    winningPercentage : Float!
  }
  
  type Franchise {
    idFranchise       : String!
    teamFull          : String!
    teamAbbr          : String!
    mascot            : String!
    stadiumName       : String
    activeFrom        : Int!
    activeTo          : Int!
    isActive          : Boolean!
    totalStats        : TotalStats!
    seasonStats       : [SeasonStats]!
  }
  
  type FranchiseConnection {
    cursor : String!
    nodes  : [Franchise]!
  }

  enum FranchiseOrderField {
    CREATED_AT
    NAME
    YEAR_FOUNDED
  }

  input FranchiseOrder {
    direction : OrderDirection!
    field     : FranchiseOrderField! 
  }

  extend type Query {
    franchises(
      cursor  : String
      first   : Int
      orderBy : FranchiseOrder 
    ): FranchiseConnection
  }
`;

const typeDefs = [FranchiseSchema];

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

export const resolvers = {
  Query: {
    franchises: getFranchises,
  },
  Franchise: {
    seasonStats: getSeasonStats,
    totalStats: getTotalStats,
  },
};


export default {
  typeDefs,
  resolvers,
};
