export enum EVENT_TAG {
  // Nature / Place
  BEACH = "beach",
  MOUNTAIN = "mountain",
  HILL = "hill",
  FOREST = "forest",
  JUNGLE = "jungle",
  DESERT = "desert",
  ISLAND = "island",
  RIVER = "river",
  LAKE = "lake",
  WATERFALL = "waterfall",
  SEA = "sea",
  OCEAN = "ocean",
  COUNTRYSIDE = "countryside",
  PARK = "park",
  NATIONAL_PARK = "national_park",
  VILLAGE = "village",
  CITY = "city",

  // Activities
  CAMPING = "camping",
  TREKKING = "trekking",
  HIKING = "hiking",
  BACKPACKING = "backpacking",
  ROAD_TRIP = "road_trip",
  BOAT_RIDE = "boat_ride",
  CRUISE = "cruise",
  FISHING = "fishing",
  SWIMMING = "swimming",
  SURFING = "surfing",
  DIVING = "diving",
  SNORKELING = "snorkeling",
  SKIING = "skiing",
  CYCLING = "cycling",
  BIKE_RIDE = "bike_ride",
  PHOTOGRAPHY = "photography",
  SHOPPING = "shopping",
  SIGHTSEEING = "sightseeing",
  FOOD_TOUR = "food_tour",
  SAFARI = "safari",
  PARAGLIDING = "paragliding",
  KAYAKING = "kayaking",
  ROCK_CLIMBING = "rock_climbing",

  // Mood / Style
  RELAX = "relax",
  ADVENTURE = "adventure",
  LUXURY = "luxury",
  BUDGET = "budget",
  ROMANTIC = "romantic",
  FAMILY = "family",
  FRIENDS = "friends",
  SOLO = "solo",
  PARTY = "party",
  NIGHTLIFE = "nightlife",
  PEACEFUL = "peaceful",
  CULTURAL = "cultural",
  SPIRITUAL = "spiritual",
  WELLNESS = "wellness",
  ECO = "eco",
  OFFBEAT = "offbeat",

  // Event type
  FESTIVAL = "festival",
  CONCERT = "concert",
  CONFERENCE = "conference",
  WORKSHOP = "workshop",
  SPORTS = "sports",
  TREK_EVENT = "trek_event",
  TOUR = "tour",
  GROUP_TOUR = "group_tour",
  PRIVATE_TOUR = "private_tour",
  WEEKEND_TRIP = "weekend_trip",
  DAY_TRIP = "day_trip",
  MULTI_DAY = "multi_day",

  // Season
  SUMMER = "summer",
  WINTER = "winter",
  MONSOON = "monsoon",
  SPRING = "spring",
  AUTUMN = "autumn",

  // Difficulty
  EASY = "easy",
  MODERATE = "moderate",
  HARD = "hard",

  // Transport
  BUS = "bus",
  TRAIN = "train",
  FLIGHT = "flight",
  CAR = "car",
  BOAT = "boat",
  WALK = "walk",

  // Accommodation
  HOTEL = "hotel",
  RESORT = "resort",
  HOSTEL = "hostel",
  TENT = "tent",
  HOMESTAY = "homestay",
  CAMP = "camp",

  // Food
  HALAL = "halal",
  VEG = "veg",
  NON_VEG = "non_veg",
  SEAFOOD = "seafood",
  LOCAL_FOOD = "local_food",
  STREET_FOOD = "street_food",

  // Audience
  COUPLE = "couple",
  KIDS = "kids",
  STUDENTS = "students",
  CORPORATE = "corporate",
  SENIORS = "seniors",

  // Special
  SUNRISE = "sunrise",
  SUNSET = "sunset",
  STARGAZING = "stargazing",
  BONFIRE = "bonfire",
  LIVE_MUSIC = "live_music",
  GUIDED = "guided",
  SELF_GUIDED = "self_guided",
  ALL_INCLUSIVE = "all_inclusive",
  CUSTOMIZABLE = "customizable"
}

export const eventTags = Object.values(EVENT_TAG);
