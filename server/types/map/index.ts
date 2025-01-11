import { z } from "zod";
import { GetAddressFromCoordinatesDTOSchema } from "../../validationSchemas/map/map-schemas";

export interface IReverseGeocodeResponse {
  results: {
    address_components: {
      long_name: string;
      short_name: string;
      types: [string];
    }[];
    formatted_address: string;
    place_id: string;
  }[];
}

export type TGetAddressFromCoordinatesRequest = z.infer<
  typeof GetAddressFromCoordinatesDTOSchema
>;
