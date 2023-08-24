//Sort alphabetically
enum Sticker {
  AdditionalStops = "Additional Stops",
  AirPollution = "Air Pollution",
  APlacetoAvoid = "A Place to Avoid",
  APlacetoVisit = "A Place to Visit",
  AestheticCharmingStreet = "Aesthetic Charming Street",
  BenchSittingArea = "Bench Sitting Area",
  BikeRack = "Bike Rack",
  Bus = "Bus",
  Car = "Car",
  CarPark = "Car Park",
  CarryingItems = "Carrying Items",
  Charging = "Charging",
  ClearingYourMind = "Clearing Your Mind",
  CrowdedRoute = "Crowded Route",
  Cycling = "Cycling",
  CyclingPath = "Cycling Path",
  DangerousArea = "Dangerous Area",
  DayDreaming = "Day Dreaming",
  DesertedPlace = "Deserted Place",
  Destination = "Destination",
  Detour = "Detour",
  DiscoverNewPath = "Discover New Path",
  DockingStation = "Docking Station",
  DrinkingFountain = "Drinking Fountain",
  DullScenery = "Dull Scenery",
  EngagingWithPhone = "Engaging with Phone",
  Exercising = "Exercising",
  ExploreHere = "Explore Here",
  FavouriteStreet = "Favourite Street",
  Gaming = "Gaming",
  GloomyZone = "Gloomy Zone",
  Greeting = "Greeting",
  Gym = "Gym",
  HiddenGem = "Hidden Gem",
  HistoricalLandmark = "Historical LandMark",
  Hospital = "Hospital",
  Inaccessible = "Inaccessible",
  Library = "Library",
  ListeningMusic = "Listening Music",
  ListeningPodcast = "Listening Podcast",
  LocalChoice = "Local's Choice",
  LoudStreet = "Loud Street",
  MeetingUp = "Meeting Up",
  MinorNoTraffic = "Minor No Traffic",
  NoWalkingInfrastructure = "No Walking Infrastructure",
  Observing = "Observing",
  OfftheBeatenPath = "Off the Beaten Path",
  Park = "Park",
  Parking = "Parking",
  PavementWalkingFriendly = "Pavements Walking Friendly",
  PeacefulSpot = "Peaceful Spot",
  PeopleWatching = "People Watching",
  Placeholder = "Placeholder",
  Planning = "Planning",
  PleasantSmell = "Pleasant Smell",
  PublicRestroom = "Public Restroom",
  QuietArea = "Quiet Area",
  Reading = "Reading",
  RecreationalArea = "Recreational Area",
  Refueling = "Refueling",
  ResidentialArea = "Residential Area",
  RetraceYourSteps = "Retrace Your Steps",
  ReturnPoint = "Return Point",
  SafePlace = "Safe Place",
  ScenicViews = "Scenic Views",
  Scooter = "Scooter",
  SharingLocation = "Sharing Location",
  Shelter = "Shelter",
  ShelteredBusStop = "Sheltered Bus Stop",
  Shopping = "Shopping",
  Shortcut = "Shortcut",
  SignOnlyBusStop = "Sign-Only Bus Stop",
  Sitting = "Sitting",
  SittingSpot = "Sitting Spot",
  Sleeping = "Sleeping",
  SlowingDown = "Slowing Down",
  SpeedingUpHurrying = "Speeding up Hurrying",
  StartPoint = "Start Point",
  StepFree = "Step-free",
  StressfulEnvironment = "Stressful Environment",
  Steps = "Steps",
  Stores = "Stores",
  StreetArt = "Street Art",
  StreetLights = "Street Lights",
  SunsetSpot = "Sunset Spot",
  TakingAPhoto = "Taking A Photo",
  Talking = "Talking",
  TeaCoffeeSpot = "Tea Coffee Spot",
  Texting = "Texting",
  ThisWay = "This Way",
  Train = "Train",
  TranquilTrail = "Tranquil Trail",
  TransferPoints = "Transfer Points", 
  Tube = "Tube",
  TurnLeft = "Turn Left",
  TurnRight = "Turn Right",
  UndesirableLocation = "Undesirable Location",
  UnexpectedEvent = "Unexpected Event",
  UnknownPath = "Unknown Path",
  UnpleasantSmell = "Unpleasant Smell", 
  VisitBackHere = "Visit Back Here",
  Waiting = "Waiting",
  Walking = "Walking",
  WalkingYourPet = "Walking Your Pet",
  Wander = "Wander",
  Working = "Working",
  WorkPlace = "Work Place"
}

//List of all the categories and the stickers that fit in each category
export const Activities = [Sticker.CarryingItems, Sticker.Charging, Sticker.ClearingYourMind, Sticker.DayDreaming, Sticker.EngagingWithPhone, Sticker.Exercising, Sticker.Gaming, Sticker.Greeting, Sticker.ListeningMusic, Sticker.ListeningPodcast, Sticker.MeetingUp, Sticker.Observing, Sticker.Parking, Sticker.PeopleWatching, Sticker.Planning, Sticker.Reading, Sticker.Refueling, Sticker.SharingLocation, Sticker.Shopping, Sticker.Sitting, Sticker.Sleeping, Sticker.SlowingDown, Sticker.SpeedingUpHurrying, Sticker.TakingAPhoto, Sticker.Talking, Sticker.Texting, Sticker.WalkingYourPet, Sticker.Working]
export const Transport = [Sticker.Bus, Sticker.Car, Sticker.Cycling, Sticker.Scooter, Sticker.Train, Sticker.Tube, Sticker.Walking]
export const FacilitiesEnvironment = [Sticker.AirPollution, Sticker.BenchSittingArea, Sticker.BikeRack, Sticker.CarPark, Sticker.CyclingPath, Sticker.DockingStation, Sticker.DrinkingFountain, Sticker.Gym, Sticker.HistoricalLandmark, Sticker.Hospital, Sticker.Inaccessible, Sticker.Library, Sticker.MinorNoTraffic, Sticker.NoWalkingInfrastructure, Sticker.Park, Sticker.PavementWalkingFriendly, Sticker.PleasantSmell, Sticker.PublicRestroom, Sticker.ResidentialArea, Sticker.Shelter, Sticker.ShelteredBusStop, Sticker.SignOnlyBusStop, Sticker.StepFree, Sticker.Steps, Sticker.Stores, Sticker.StreetArt, Sticker.StreetLights, Sticker.TeaCoffeeSpot, Sticker.UnpleasantSmell]
export const Places = [Sticker.APlacetoAvoid, Sticker.APlacetoVisit, Sticker.AestheticCharmingStreet, Sticker.CrowdedRoute, Sticker.DangerousArea, Sticker.DesertedPlace, Sticker.DullScenery, Sticker.FavouriteStreet, Sticker.GloomyZone, Sticker.LoudStreet, Sticker.PeacefulSpot, Sticker.QuietArea, Sticker.RecreationalArea, Sticker.SafePlace, Sticker.ScenicViews, Sticker.SittingSpot, Sticker.StressfulEnvironment, Sticker.SunsetSpot, Sticker.TranquilTrail, Sticker.UndesirableLocation, Sticker.WorkPlace]
export const Navigation = [Sticker.AdditionalStops, Sticker.Destination, Sticker.Detour, Sticker.DiscoverNewPath, Sticker.ExploreHere, Sticker.HiddenGem, Sticker.LocalChoice, Sticker.OfftheBeatenPath, Sticker.Placeholder, Sticker.RetraceYourSteps, Sticker.ReturnPoint, Sticker.StartPoint, Sticker.Shortcut, Sticker.ThisWay, Sticker.TransferPoints, Sticker.TurnLeft, Sticker.TurnRight, Sticker.UnexpectedEvent, Sticker.UnknownPath, Sticker.VisitBackHere, Sticker.Waiting, Sticker.Wander]

export enum Category {
  Any = "Any",
  Activities = "Activities",
  FacilitiesEnvironment = "Facilities and Environment",
  Navigation = "Navigation",
  Places = "Places",
  Transport = "Transport"
}

export const findFolder = function(sticker: Sticker) {
  if (Transport.includes(sticker)) {
    return `/assets/sticker/transport/${sticker}.svg`
  } else if (Activities.includes(sticker)) {
    return `/assets/sticker/activities/${sticker}.svg`
  } else if (FacilitiesEnvironment.includes(sticker)) {
    return `/assets/sticker/facilitiesEnvironment/${sticker}.svg`
  } else if (Places.includes(sticker)) {
    return `/assets/sticker/places/${sticker}.svg`
  } else if (Navigation.includes(sticker)) {
    return `/assets/sticker/navigation/${sticker}.svg`
  } else {
    return '/assets/sticker/navigation/Start Point.svg'
  }
}

export const getKeyFromValue = function (word: String) {
  for (const value of Object.values(Sticker)) {
    if (word == value.valueOf()) return value
  }
  return -1
}

export default Sticker
