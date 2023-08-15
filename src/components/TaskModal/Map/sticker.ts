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
const Transport = [Sticker.Bus, Sticker.Car, Sticker.Cycling, Sticker.Scooter, Sticker.Tube, Sticker.Walking]
const Util = [Sticker.StartPoint, Sticker.Stop]
const Categories = [Transport, Util]

export default Sticker
