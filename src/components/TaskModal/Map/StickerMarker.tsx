import { Marker, Popup, useMap } from 'react-leaflet'
import { findFolder } from './sticker'
import L, { DragEndEvent } from 'leaflet'
import React from 'react'
import { Button, Stack, TextField } from '@mui/joy'
import { StickersProps } from './StickerEditor'

function StickerMarker(props: StickerMarkerProps) {
  const icon = L.icon({
    iconUrl: findFolder(props.sticker.sticker),
    iconSize: [32, 32],
  })
  const map = useMap()

  const remove = () => {
    // When the popup closes, Leaflet tries to remove the click handlers
    // So we need to use the setTimeout "hack" to prevent a null pointer error
    // We simply let leaflet do it's thing, and then remove the marker
    // It's not a nice solution, but it works :^)
    map.closePopup()
    setTimeout(() => props.onRemove(), 1)
  }

  return (
    <Marker
      position={props.sticker.point}
      icon={icon}
      draggable
      eventHandlers={{
        dragend: props.onDrag,
      }}
    >
      <Popup closeOnClick closeOnEscapeKey>
        <Stack spacing={1}>
          <TextField value={props.sticker.note} fullWidth onChange={(e) => props.setNote(e)} placeholder='Enter your note here...' />
          <Button onClick={remove} fullWidth >Remove</Button>
        </Stack>
      </Popup>
    </Marker>
  )
}

type StickerMarkerProps = {
  sticker: StickersProps
  onDrag: (e: DragEndEvent) => void
  onRemove: () => void
  setNote: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default StickerMarker
