import {
  BANGLADESH_TOURIST_LOCATIONS,
  GLOBAL_TOURIST_LOCATIONS
} from "@/constants";
import {
  TCountryCapitalResponse,
  TPlaceOption
} from "@/types/location/location.types";

class LocationRepository {
  private static readonly countriesApi =
    "https://restcountries.com/v3.1/all?fields=name,capital";

  static getCuratedPlaces(): string[] {
    return [...BANGLADESH_TOURIST_LOCATIONS, ...GLOBAL_TOURIST_LOCATIONS];
  }

  static getCuratedPlaceOptions(): TPlaceOption[] {
    return this.normalizePlaces(this.getCuratedPlaces());
  }

  static async getCountryCapitalPlaces(): Promise<string[]> {
    const response = await fetch(this.countriesApi);

    if (!response.ok) {
      throw new Error("Failed to fetch location options");
    }

    const data: TCountryCapitalResponse[] = await response.json();
    const places = new Set<string>();

    data.forEach((item) => {
      const countryName = item.name?.common?.trim();
      const capitalName = item.capital?.[0]?.trim();

      if (countryName) {
        places.add(countryName);
      }

      if (countryName && capitalName) {
        places.add(`${capitalName}, ${countryName}`);
      }
    });

    return Array.from(places).sort((a, b) => a.localeCompare(b));
  }

  static async getPlaceOptions(): Promise<TPlaceOption[]> {
    const fetchedPlaces = await this.getCountryCapitalPlaces();
    return this.normalizePlaces([...this.getCuratedPlaces(), ...fetchedPlaces]);
  }

  private static normalizePlaces(places: string[]): TPlaceOption[] {
    const uniquePlaces = new Set<string>();

    places.forEach((place) => {
      const trimmed = place.trim();
      if (trimmed) {
        uniquePlaces.add(trimmed);
      }
    });

    return Array.from(uniquePlaces).map((place) => ({
      label: place,
      value: place
    }));
  }
}

export default LocationRepository;
