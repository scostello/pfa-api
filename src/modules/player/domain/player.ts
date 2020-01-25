import { Person } from '../../../types';
import { PlayerMeasurables } from './playerMeasureables';
import { PlayerPosition } from './playerPosition';

interface Player extends Person {
  readonly id: string;
  readonly college: number; // reference
  readonly currentTeam: number; // reference
  readonly position: PlayerPosition;
  readonly measurables: PlayerMeasurables;
  readonly draftPosition: number;
  readonly firstYear: number;
  readonly jerseyNumber: number;
}

export { Player, PlayerMeasurables, PlayerPosition };
