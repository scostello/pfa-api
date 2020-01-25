import { gql } from 'apollo-server';
import { StadiumRepo } from '../repos/stadiumRepo';
import { CreateStadiumSvc } from './stadiumSvc';

const CreateStadiumTypeDefs = () => gql`
  type Address {
    streetAddress1: String
    streetAddress2: String
    city: String
    stateCode: String
    zipCode: String
    countyFips: Int
  }
  
  type Location {
    googleLocation: JSON
    address: Address
    longitude: Float
    latitude: Float
    geoPoint: String
  }
  
  type Stadium implements Node {
    id: ID!
    name: String
    location: Location
    yearOpened: Int
    capacity: Int
  }

  type StadiumEdge implements Edge {
    cursor: String!
    node: Stadium
  }

  type StadiumConnection implements Connection {
    edges: [StadiumEdge]
    nodes: [Stadium]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  extend type Query {
    stadiums(
      cursor: String
      first: Int
      orderBy: FranchiseOrder
    ): StadiumConnection!
  }
`;

const CreateStadiumResolvers = (repo: StadiumRepo) => {
  const { query } = CreateStadiumSvc(repo);

  return {
    Query: {
      stadiums: query.stadiums,
    },
  };
};

export { CreateStadiumResolvers, CreateStadiumTypeDefs };
