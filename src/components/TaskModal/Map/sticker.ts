//Sort alphabetically
enum Sticker {
  Bus = 'Bus',
  Car = 'Car',
  StartPoint = 'StartPoint',
  Stop = 'Stop',
  Walking = 'Walking',
  Cycling = 'Cycling',
  Scooter = 'Scooter',
  Tube = 'Tube'
}

//List of all the categories and the stickers that fit in each category
export const Transport = [Sticker.Bus, Sticker.Car, Sticker.Cycling, Sticker.Scooter, Sticker.Tube, Sticker.Walking]
export const Util = [Sticker.StartPoint, Sticker.Stop]
export const ABC = []
export const Activities = []
export const Environment = []
export const Places = []
export const Logistics = []

export enum Category {
  Any = "Any",
  Transport = "Transport",
  Util = "Util",
  ABC = "ABC",
  Activities = "Activities",
  Environment = "Environment",
  Places = "Places",
  Logistics = "Logistics",
}

export default Sticker
