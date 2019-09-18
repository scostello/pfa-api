export type ID = string;

export interface PersonName {
  readonly title: string;
  readonly first: string;
  readonly middle?: string;
  readonly last: string;
  readonly suffix?: string;
}

export interface Location {
  readonly address1: string;
  readonly address2: string;
  readonly city: string;
  readonly state: string;
  readonly zipcode: string;
  readonly longitude?: number;
  readonly latitude?: number;
}

export interface Stadium {
  readonly id: ID;
  readonly name: string;
  readonly location: Location;
}

export interface Franchise {
  readonly id: ID;
  readonly stadium: Stadium;
  readonly logo: string;
  readonly nameAbbr: string;
  readonly nameFull: string;
  readonly mascot: string;
  readonly activeFrom: number;
  readonly activeTo: number;
}

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

export interface PlayerPosition {
  readonly primary: Position;
  readonly secondary?: Position;
  readonly depthChart?: Position;
}

export interface PlayerMeasurables {
  readonly height?: number; // inches
  readonly weight?: number; // lbs
  readonly forty?: number;
  readonly bench?: number;
  readonly vertical?: number;
  readonly broad?: number;
  readonly shuttle?: number;
  readonly cone?: number;
  readonly armLength?: number;
  readonly handSize?: number;
}

export interface College {
  readonly name: string;
  readonly division: string;
}

export interface Player {
  readonly id: ID;
  readonly nflId: number;
  readonly name: PersonName;
  readonly position: PlayerPosition;
  readonly dob: Date;
  readonly measurables: PlayerMeasurables;
  readonly draftPosition?: number;
  readonly college: College;
  readonly firstYear: number;
  readonly currentTeam: string;
  readonly jerseyNumber: number;
}
