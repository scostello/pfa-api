import { Result } from '../../../shared';
import { Address, Location } from '../../../types';

interface StadiumLocation extends Location {
  readonly address: Address;
  readonly latitude: string;
  readonly longitude: string;
  readonly geoPoint?: string;
}

interface Stadium {
  readonly id: number;
  readonly capacity: number;
  readonly location: StadiumLocation;
  readonly name: string;
  readonly yearOpened: number;
}

const StadiumFactory = {
  create: (props: Partial<Stadium>): Result<Stadium> => {
    const stadium = {
      capacity: props.capacity,
      id: props.id.toString(),
      location: {
        address: {
          streetAddress1: props.location.address.streetAddress1,
          streetAddress2: props.location.address.streetAddress2,
          city: props.location.address.city,
          stateCode: props.location.address.stateCode,
          zipCode: props.location.address.zipCode,
          countyFips: props.location.address.countyFips,
        },
        latitude: props.location.latitude,
        longitude: props.location.longitude,
        geoPoint: props.location?.geoPoint,
      },
      name: props.name,
      yearOpened: props.yearOpened,
    };

    return Result.Ok<Stadium>(stadium);
  },
};

export {
  Stadium,
  StadiumFactory,
};
