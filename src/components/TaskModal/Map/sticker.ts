enum Category {
  transport = 'transport',
  util = 'util'
}

export class Sticker {
  public static bus = new Sticker("Bus", Category.transport)
  public static car = new Sticker("Car", Category.transport)
  public static startPoint = new Sticker("StartPoint", Category.util)
  public static stop = new Sticker("Stop", Category.util)
  public static walking = new Sticker("Walking", Category.transport)
  public static cycling = new Sticker("Cycling", Category.transport)
  public static scooter = new Sticker("Scooter", Category.transport)
  public static tube = new Sticker("Tube", Category.transport)

  private label
  private category

  private constructor(label: string, category: Category) {
    this.label = label;
    this.category = category;
  }

  public getLabel() {
    return this.label;
  }

  public getCategory() {
    return this.category;
  }
}

export default Sticker
