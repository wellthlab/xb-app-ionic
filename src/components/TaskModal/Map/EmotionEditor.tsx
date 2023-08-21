import { LatLngLiteral, LeafletMouseEvent, } from 'leaflet'
import { v4 } from "uuid"
import React, { useEffect } from 'react'
import Emotion, { getKeyFromValue } from './emotion'
import EmotionMarker from './EmotionMarker'
import { useMap } from 'react-leaflet'

function EmotionEditor(props: EmotionEditorProps) {
    let result = ""
    const map = useMap();

    useEffect(() =>
        convertEmotionsToString(props.emotions),
        [props.emotions])

    useEffect(() => {

        const handleEmotionClick = (e: LeafletMouseEvent) => {
            if (!props.emotions) return
            props.setEmotions([...props.emotions, { point: e.latlng, emotion: props.activeEmotion, uuid: v4() }])
        }

        map.addEventListener("click", handleEmotionClick)

        return function cleanup() {
            map.removeEventListener("click")
        }
    })

    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            map.flyTo(e.latlng, map.getZoom());
        });
    }, [map]);

    const convertEmotionsToString = function (emotions: EmotionsProps[]) {
        if (!emotions.length) return
        const s = emotions.slice(-1)[0]
        result += getKeyFromValue(s.emotion) + " " + s.point.lat.toString() + " " + s.point.lng.toString() + " " + s.uuid + " "
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
