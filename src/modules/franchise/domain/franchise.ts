import { Result } from '../../../shared';

interface FranchiseName {
  readonly abbr: string;
  readonly full: string;
  readonly mascot: string;
}

interface Franchise {
  readonly id: number;
  readonly idStadium?: number; // reference
  readonly currentOwner: number; // reference
  readonly currentName: FranchiseName;
  readonly activeFrom: number;
  readonly activeTo: number;
}

const FranchiseFactory = {
  create: (props: Partial<Franchise>): Result.Ok<Franchise> => {
    const franchise = {
      id: props.id,
      idStadium: props.idStadium,
      currentOwner: props.currentOwner,
      currentName: props.currentName,
      activeFrom: props.activeFrom,
      activeTo: props.activeTo,
    };

    return Result.Ok<Franchise>(franchise);
  }
};

export {
  Franchise,
  FranchiseName,
  FranchiseFactory,
};
