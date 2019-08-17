// @flow
import { gql } from 'apollo-server';

export const CommonTypeDefs = gql`
  
  type Location {
    googleLocation  : JSON
    street1         : String
    street2         : String
    city            : String
    state           : String
    zipcode         : String
    countyFips      : Int
    longitude       : Float
    latitude        : Float
    geo             : String
  }
  
  type PersonName {
    title   : String
    first   : String
    middle  : String
    last    : String
    suffix  : String
  }

  type Person {
    id    : ID!
    name  : PersonName
    dob   : Date
  }
  
`;
