import axios from "axios";
import { GOOGLE_MAP_API_KEY } from "../../settings/config";

export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  const { data } = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API_KEY}`
  );

  let formattedAddress = "";

  for (const result of data?.results) {
    const types = result.address_components[0].types;

    if (!types.includes("plus_code")) {
      formattedAddress = result.formatted_address;
      break;
    }
  }

  return formattedAddress;
};

export const getGoogleMapLink = (
  latitude: number,
  longitude: number
): string => {
  return `https://www.google.com/maps/search/?api=1&query=${latitude}&${longitude}`;
};
