// @flow
import { gql } from 'apollo-server';

export const CommonTypeDefs = gql`
  
  type Address {
    streetAddress1  : String
    streetAddress2  : String
    city            : String
    state           : String
    zipCode         : String
    countFips       : Int
    latitude        : Float
    longitude       : Float
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
