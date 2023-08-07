enum Sticker {
    'StartPoint' = 'Start Point',
    'Stop' = 'Stop',
    'Sunny' = 'Sunny',
    'Walking' = 'Walking',
    'Cycling' = 'Cycling'
  }
  
  export function valueToKey(value: Sticker): string {
    const res = Object.keys(Sticker).find(
      (key) => Sticker[key as keyof typeof Sticker] === value
    )
  
    if (!res) {
      throw new Error(`Sticker ${value} not found`)
    }
  
    return res
  }
  
  export default Sticker
  