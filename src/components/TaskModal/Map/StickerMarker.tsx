import { ReactNode } from 'react'
import { Marker, Popup, useMap } from 'react-leaflet'
import Sticker from './sticker'
import L, { DragEndEvent } from 'leaflet'
import Button from '../../foundation/StickerButton'
import React from 'react'
function StickerMarker(props: StickerMarkerProps) {
  const icon = L.icon({
    iconUrl: `/assets/sticker/${props.sticker.getLabel()}.svg`,
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
      position={props.position}
      icon={icon}
      draggable
      eventHandlers={{
        dragend: props.onDrag,
      }}
    >
      {props.children}
      <Popup closeOnClick closeOnEscapeKey>
        <Button onClick={remove}>Remove</Button>
      </Popup>
    </Marker>
  )
}

type StickerMarkerProps = {
  position: {
    lat: number
    lng: number
  }
  sticker: Sticker
  onDrag: (e: DragEndEvent) => void
  onRemove: () => void
  children?: ReactNode
}

export default StickerMarker
