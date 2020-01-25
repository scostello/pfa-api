import { GeometryObject } from 'geojson';

interface Address {
  readonly streetAddress1: string;
  readonly streetAddress2: string;
  readonly city: string;
  readonly stateCode: string;
  readonly zipCode: string;
  readonly countyFips: string;
}

interface Location {
  readonly address: Address;
  readonly geom?: GeometryObject;
}

export { Address, Location }
