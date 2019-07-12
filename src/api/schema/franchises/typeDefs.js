// @flow
import { gql } from 'apollo-server';

export const FranchiseSchema = gql`
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

  type Franchise implements Node {
    id                : ID!
    idStadium         : String
    idLogo            : String
    nameAbbr          : String!
    nameFull          : String!
    activeFrom        : Int!
    activeTo          : Int!
  }

  type FranchiseEdge {
    cursor  : String!
    node    : Franchise
  }

  type FranchiseConnection {
    edges       : [FranchiseEdge]
    nodes       : [Franchise]
    pageInfo    : PageInfo!
    totalCount  : Int!
  }

  enum FranchiseOrderField {
    id
    name
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