import { LatLngLiteral, LeafletMouseEvent, } from 'leaflet'
import { v4 } from "uuid"
import React, { useEffect } from 'react'
import Emotion from './emotion'
import EmotionMarker from './EmotionMarker'
import { useMap } from 'react-leaflet'

function EmotionEditor(props: EmotionEditorProps) {
    const map = useMap();

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

    const handleRemove = function (uuid: string) {
        if (!props.emotions) return
        props.setEmotions(props.emotions.filter((e) => e.uuid != uuid))
    }

    return (<>
        {props.emotions.map((s) => (
            <EmotionMarker key={s.uuid} emotion={s} onRemove={() => handleRemove(s.uuid)} />))}
    </>)
}

export type EmotionsProps = {
    point: LatLngLiteral,
    emotion: Emotion,
    uuid: string
}

type EmotionEditorProps = {
    emotions: EmotionsProps[],
    setEmotions: React.Dispatch<React.SetStateAction<EmotionsProps[]>>,
    activeEmotion: Emotion
}

export default EmotionEditor
