import React from 'react'
import Sticker, { findFolder } from './sticker'
import { Paper } from '@mui/material'
import { Grid } from '@mui/material'

function StickerDrawer(props: StickerDrawerProps) {

  return (<Paper style={{ maxHeight: 150, overflowY: 'auto', overflowX: 'hidden' }}>
    <Grid container xs={11.5}>
      {props.stickers.map(sticker => {
        return (
          <Grid item key={sticker} xs={3}>
            <button
              onClick={() => props.onStickerClick(sticker)}
              key={sticker}
              style={{ backgroundColor: "white"}}>
              <img
                src={findFolder(sticker)}
                alt={sticker}
                width={32}
                height={32}
                style={{ backgroundColor: "white" }} />
            </button>
            <p style={{ padding: 0, margin: 0 }}>{sticker}</p>
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
