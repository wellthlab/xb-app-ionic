import { Popup, useMap, CircleMarker } from 'react-leaflet'
import React from 'react'
import { Button, Stack, Typography } from '@mui/joy'
import { getStringValueFromEmotion } from './emotion'
import { EmotionsProps } from './EmotionEditor'

type EmotionMarkerProps = {
    emotionProps: EmotionsProps
    onRemove: () => void
}

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
        <CircleMarker 
            center={props.emotionProps.point}
            color={props.emotionProps.emotion.valueOf()}
            fillColor={props.emotionProps.emotion.valueOf()}
            radius={30}
            fillOpacity={0.6}>
            <Popup>
                <Stack>
                    <Typography>{getStringValueFromEmotion(props.emotionProps.emotion)}</Typography>
                    <Button onClick={remove}>Remove</Button>
                </Stack>
            </Popup>
        </CircleMarker>
    )
}

export default EmotionMarker
