/*
CREATE TABLE IF NOT EXISTS reporting.plays (
  id_play                 bigint PRIMARY KEY NOT NULL DEFAULT public.id_generator(),
	id_game                 bigint,
	aa_play_id              int,
	aa_game_id              int,
	team_on_offense         varchar(3),
	team_on_defense         varchar(3),
	play_type               varchar(10),
	drive_sequence          smallint,
	length_in_seconds       smallint,
	quarter                 smallint,
	minutes                 smallint,
	seconds                 smallint,
	points_offense          smallint,
	points_defense          smallint,
	timeouts_offense        smallint,
	timeouts_defense        smallint,
	down                    smallint,
	yards_to_go             smallint,
	yards_from_own_goaline  smallint,
	field_zone              smallint,
	first_down              smallint,
	shotgun                 smallint,
	no_huddle               smallint,
	points_scored           smallint,
	tackle_on_play          smallint,
	sack_on_play            smallint,
	penalty_on_play         smallint,
	interception_on_play    smallint,
	fumble_on_play          smallint,
	safety_on_play          smallint,
	block_on_play           smallint
);
 */


interface PlayContext {
  readonly teamOnOffense: number; // reference
  readonly teamOnDefense: number; // reference
  readonly quarter: number;
  readonly minutes: number;
  readonly seconds: number;
  readonly pointsOffense: number;
  readonly pointsDefense: number;
  readonly timeoutsOffense: number;
  readonly timeoutsDefense: number;
  readonly down: number;
  readonly yardsToGo: number;
  readonly yardsFromOwnGoal: number;
  readonly fieldZone: number;
  readonly isFirstDown: boolean;
  readonly isNoHuddle: boolean;
}

enum PlayResult {
  Tackle,
  Sack,
  Penalty,
  Interception,
  Fumble,
  Safety,
  Block
}

interface Play {
  readonly id: number;
  readonly game: number; // reference
  readonly playType: string;
  readonly driveSequence: number;
  readonly lengthInSeconds: number;
  readonly context: PlayContext;
  readonly result: readonly PlayResult[];
}

export { Play }