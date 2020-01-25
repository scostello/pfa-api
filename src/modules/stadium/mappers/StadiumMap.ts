import { Stadium, StadiumFactory } from '../domain';

export interface StadiumPersistence {
  readonly id_stadium: number;
  readonly capacity: number;
  readonly name: string;
  readonly year_opened: number;
  readonly street1: string;
  readonly street2: string;
  readonly city: string;
  readonly state: string;
  readonly zipcode: string;
  readonly count_fips: string;
  readonly latitude: string;
  readonly longitude: string;
  readonly geography_point: string;
}

const StadiumMap = {
  toDomain: (rawStadium: any): Stadium => {
    return StadiumFactory.create({
      id: rawStadium.id_stadium,
      capacity: rawStadium.capacity,
      location: {
        address: {
          streetAddress1: rawStadium.address.street1,
          streetAddress2: rawStadium.address.street2,
          city: rawStadium.address.city,
          stateCode: rawStadium.address.state,
          zipCode: rawStadium.address.zipcode,
          countyFips: rawStadium.address.county_fips,
        },
        latitude: rawStadium.location.latitude,
        longitude: rawStadium.location.longitude,
        geoPoint: rawStadium.location.geography_point,
      },
      name: rawStadium.name,
      yearOpened: rawStadium.year_opened,
    });
  },
  toPersistence: (stadium: Stadium): Partial<StadiumPersistence> => {
    return {
      id_stadium: stadium.id,
      capacity: stadium.capacity,
      name: stadium.name,
      year_opened: stadium.yearOpened,
      street1: stadium.location.address.streetAddress1,
      street2: stadium.location.address.streetAddress2,
      city: stadium.location.address.city,
      state: stadium.location.address.stateCode,
      zipcode: stadium.location.address.zipCode,
      latitude: stadium.location.latitude,
      longitude: stadium.location.longitude,
      geography_point: stadium.location.geoPoint,
    };
  },
};

export { StadiumMap };
