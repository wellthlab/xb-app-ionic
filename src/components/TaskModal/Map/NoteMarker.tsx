import { Marker, Popup, useMap } from 'react-leaflet'
import Sticker from './sticker'
import L, { DragEndEvent } from 'leaflet'
import React from 'react'
import { Button } from '@mui/joy'

function NoteMarker(props: NoteMarkerProps) {
    // Replace with note icon
    const icon = L.icon({
        iconUrl: `/assets/sticker/${Sticker.StartPoint}.svg`,
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
            <Popup closeOnClick closeOnEscapeKey>
                <p>{props.label}</p>
                <Button onClick={remove}>Remove</Button>
            </Popup>
        </Marker>
    )
}

type NoteMarkerProps = {
    position: {
        lat: number
        lng: number
    }
    onDrag: (e: DragEndEvent) => void
    onRemove: () => void
    label: string
}

export default NoteMarker
