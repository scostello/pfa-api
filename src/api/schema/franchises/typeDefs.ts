import { gql } from 'apollo-server';

export const FranchiseSchema = gql`
  type Franchise implements Node {
    id                : ID!
    currentStadium    : Stadium
    currentNameAbbr   : String!
    currentNameFull   : String!
    currentMascot     : String!
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
    ): FranchiseConnection!
  }
`;
