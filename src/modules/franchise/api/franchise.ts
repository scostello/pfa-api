import { gql } from 'apollo-server';
import { CreateFranchiseSvc } from './franchiseSvc';
import { FranchiseRepo } from '../repos/franchiseRepo';

const CreateFranchiseTypeDefs = () => gql`
  type PersonName {
    title: String
    first: String
    middle: String
    last: String
    suffix: String
  }

  type Person {
    id: ID!
    name: PersonName
    dob: Date
  }
  
  type FranchiseName {
    abbr: String
    full: String
    mascot: String
  }
  
  type Franchise implements Node {
    id: ID!
    currentName: FranchiseName
    currentStadium: Stadium
    currentMascot: String!
    activeFrom: Int!
    activeTo: Int!
  }

  type FranchiseEdge implements Edge {
    cursor: String!
    node: Franchise
  }

  type FranchiseConnection implements Connection {
    edges: [FranchiseEdge]
    nodes: [Franchise]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  enum FranchiseOrderField {
    id
    name
  }

  input FranchiseOrder {
    direction: OrderDirection!
    field: FranchiseOrderField!
  }

  extend type Query {
    franchises(
      cursor: String
      first: Int
      orderBy: FranchiseOrder
    ): FranchiseConnection!
  }
`;

const CreateFranchiseResolvers = (repo: FranchiseRepo) => {
  const { query, franchiseConnection, franchiseNode } = CreateFranchiseSvc(repo);
  return {
    Query: {
      franchises: query.franchises,
    },
    FranchiseConnection: {
      edges: franchiseConnection.edges,
      nodes: franchiseConnection.nodes,
      pageInfo: franchiseConnection.pageInfo,
      totalCount: franchiseConnection.totalCount,
    },
    Franchise: {
      currentStadium: franchiseNode.stadium,
    }
  };
};

export { CreateFranchiseResolvers, CreateFranchiseTypeDefs };