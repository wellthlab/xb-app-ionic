import React from 'react'
import Sticker, { findFolder } from './sticker'
import { Paper, Typography } from '@mui/material'
import { Grid } from '@mui/material'

function StickerDrawer(props: StickerDrawerProps) {

  return (<Paper style={{ maxHeight: 200, overflow: 'auto' }}>
    <Grid container spacing={2}>
      {props.stickers.map(sticker => {
        return (
          <Grid item key={sticker} xs={3}>
            <button
              onClick={() => props.onStickerClick(sticker)}
              key={sticker}
              style={{ backgroundColor: "white" }}>
              <img
                src={findFolder(sticker)}
                alt={sticker}
                width={32}
                height={32}
                style={{ backgroundColor: "white" }} />
              <Typography>{sticker}</Typography>
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
