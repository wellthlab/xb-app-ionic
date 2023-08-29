import { Popup, useMap, CircleMarker } from 'react-leaflet'
import React from 'react'
import { Button, Stack, Typography } from '@mui/joy'
import { getKeyFromValue } from './emotion'
import { EmotionsProps } from './EmotionEditor'

function EmotionMarker(props: EmotionMarkerProps) {

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
        <CircleMarker center={props.emotion.point} color={props.emotion.emotion.valueOf()} fillColor={props.emotion.emotion.valueOf()} radius={30} fillOpacity={0.6}>
            <Popup>
                <Stack>
                    <Typography>{getKeyFromValue(props.emotion.emotion)}</Typography>
                    <Button onClick={remove}>Remove</Button>
                </Stack>
            </Popup>
        </CircleMarker>
    )
}

type EmotionMarkerProps = {
    emotion: EmotionsProps
    onRemove: () => void
}

export default EmotionMarker
