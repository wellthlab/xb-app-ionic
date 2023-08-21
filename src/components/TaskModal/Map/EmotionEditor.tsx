import L, { LatLngLiteral, LeafletMouseEvent, } from 'leaflet'
import { v4 } from "uuid"
import React, { useEffect } from 'react'
import Emotion from './emotion'
import EmotionMarker from './EmotionMarker'
import ClickListener from './ClickListener'

function EmotionEditor(props: EmotionEditorProps) {

    const handleEmotionClick = (e: LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e)
        if (!props.emotions) return
        props.setEmotions([...props.emotions, { point: e.latlng, emotion: props.activeEmotion, uuid: v4() }])
        convertEmotionsToString(props.emotions)
    }

    useEffect(() =>
        convertEmotionsToString(props.emotions),
        [props.emotions])

    const convertEmotionsToString = function (emotions: EmotionsProps[]) {
        let result = ""
        emotions.map((s) => {
            result = s.point.lat.toString() + " " + s.point.lng.toString() + " " + s.emotion.valueOf() + " " + s.uuid + " "
        })
        props.onChange(result)
    }

    const handleRemove = function (uuid: string) {
        if (!props.emotions) return
        props.setEmotions(props.emotions.filter((e) => e.uuid != uuid))
    }

    return (
        <>
            {props.emotions.map((s) => (
                <EmotionMarker point={s.point} emotion={s.emotion} onRemove={() => handleRemove(s.uuid)} />))}
            <ClickListener onMapClick={handleEmotionClick} />
        </>
    )
}

export type EmotionsProps = {
    point: LatLngLiteral,
    emotion: Emotion,
    uuid: string
}

type EmotionEditorProps = {
    emotions: EmotionsProps[],
    setEmotions: React.Dispatch<React.SetStateAction<EmotionsProps[]>>,
    activeEmotion: Emotion,
    onChange: (Emotion: string) => void
}

export default EmotionEditor
