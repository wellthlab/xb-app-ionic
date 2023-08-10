import React from 'react'
import Sticker from './sticker'
import { Paper } from '@mui/material'
import { Grid } from '@mui/material'

function StickerDrawer(props: StickerDrawerProps) {

  return (<Paper style={{ maxHeight: 200, overflow: 'auto' }}>
    <Grid container spacing={2}>
      {props.stickers.map(sticker => {
        return (
          <Grid item xs={2} key={sticker.getLabel()}>
            <button
              onClick={() => props.onStickerClick(sticker)}
              key={sticker.getLabel()}>
              <img
                src={`/assets/sticker/${sticker.getLabel()}.svg`}
                alt={sticker.getLabel()}
                width={32}
                height={32} />
              {sticker.getLabel()}
            </button>
          </Grid>
        )
      })}
    </Grid>
  </Paper>
  )
}

type StickerDrawerProps = {
  stickers: Sticker[]
  activeSticker: Sticker
  onStickerClick: (index: Sticker) => void
}

export default StickerDrawer
