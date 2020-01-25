import { Franchise, FranchiseFactory } from '../domain';

export interface FranchisePersistence {
  readonly id_franchise: string;
  readonly id_stadium: string;
  readonly current_name_abbr: string;
  readonly current_name_full: string;
  readonly current_mascot: string;
  readonly active_from: number;
  readonly active_to: number;
}

const FranchiseMap = {
  toDomain: (rawFranchise: any): Franchise => {
    return FranchiseFactory.create({
      id: rawFranchise.id_franchise,
      idStadium: rawFranchise.id_stadium,
      currentOwner: rawFranchise.current_owner,
      currentName: {
        abbr: rawFranchise.current_name_abbr,
        full: rawFranchise.current_name_full,
        mascot: rawFranchise.current_mascot,
      },
      activeFrom: rawFranchise.active_from,
      activeTo: rawFranchise.active_to,
    });
  },
  toPersistence: (franchise: Franchise): Partial<FranchisePersistence> => {
    return {
      id_franchise: franchise.id.toString(),
      id_stadium: franchise.idStadium.toString(),
      current_name_abbr: franchise?.currentName.abbr,
      current_name_full: franchise?.currentName.full,
      current_mascot: franchise?.currentName.mascot,
      active_from: franchise.activeFrom,
      active_to: franchise.activeTo,
    };
  },
};

export { FranchiseMap };
