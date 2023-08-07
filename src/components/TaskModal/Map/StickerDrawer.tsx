import React from 'react'
import Sticker from './sticker'
import List from '../../foundation/List'

function StickerDrawer(props: StickerDrawerProps) {

  return (<List>
    {props.stickers.map((sticker, index) => {
      const stickerKey = Object.keys(Sticker).find(
        (key) => Sticker[key as keyof typeof Sticker] === sticker)
      return (
        <button
          onClick={() => props.onStickerClick(index)}
          key={stickerKey}>
          <img
            src={`/assets/sticker/${stickerKey}.svg`}
            alt={sticker}
            width={32}
            height={32} />
          {sticker}
        </button>
      )
    })}
  </List>
  )

}
type StickerDrawerProps = {
  className?: string
  stickers: Sticker[]
  activeSticker: number | null
  onStickerClick: (index: number) => void
}

export default StickerDrawer
