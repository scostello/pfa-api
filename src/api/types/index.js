// @flow

export type ID = string;

export type PersonName = {
  title: string,
  first: string,
  middle?: string,
  last: string,
  suffix?: string,
};

export type Location = {
  address1: string,
  address2: ?string,
  city: string,
  state: string,
  zipcode: string,
  longitude?: number,
  latitude?: number,
};

export type Stadium = {
  id: ID,
  name: string,
  location: Location,
};

export type Franchise = {
  id: ID,
  stadium: ?Stadium,
  logo: ?string,
  nameAbbr: string,
  nameFull: string,
  mascot: string,
  activeFrom: number,
  activeTo: number,
};

export type Position =
  'DB' |
  'DL' |
  'K' |
  'LB' |
  'LS' |
  'OL' |
  'QB' |
  'RB' |
  'TE' |
  'WR' |
  'INA';

export type PlayerPosition = {
  primary: Position,
  secondary?: ?Position,
  depthChart?: Position,
};

export type PlayerMeasurables = {
  height?: ?number, // inches
  weight?: ?number, // lbs
  forty?: ?number,
  bench?: ?number,
  vertical?: ?number,
  broad?: ?number,
  shuttle?: ?number,
  cone?: ?number,
  armLength?: ?number,
  handSize?: ?number,
};

export type College = {
  name: string,
  division: string,
};

export type Player = {
  id: ID,
  nflId: number,
  name: PersonName,
  position: PlayerPosition,
  dob: ?Date,
  measurables: PlayerMeasurables,
  draftPosition?: ?number,
  college: ?College,
  firstYear: number,
  currentTeam: string,
  jerseyNumber: number,
};
