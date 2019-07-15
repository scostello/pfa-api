// @flow
import { gql } from 'apollo-server';

export const StadiumSchema = gql`

  type Stadium implements Node {
    id          : ID!
    name        : String
    address     : Address
    yearOpened  : Int
    capacity    : Int
  }

  type StadiumEdge {
    cursor  : String!
    node    : Stadium
  }

  type StadiumConnection {
    edges       : [StadiumEdge]
    nodes       : [Stadium]
    pageInfo    : PageInfo!
    totalCount  : Int!
  }

  enum StadiumOrderField {
    id
    name
    yearOpened
  }

  input StadiumOrder {
    direction : OrderDirection!
    field     : StadiumOrderField!
  }

  extend type Query {
    stadiums(
      cursor  : String
      first   : Int
      orderBy : StadiumOrder
    ): StadiumConnection!
  }

`;
