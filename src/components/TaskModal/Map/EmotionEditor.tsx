import { useEffect } from 'react'
import L, { LatLngLiteral, LeafletMouseEvent, } from 'leaflet'
import { v4 } from "uuid"
import React from 'react'
import { useMap } from 'react-leaflet'
import Emotion from './emotion'
import EmotionMarker from './EmotionMarker'


function EmotionEditor(props: EmotionEditorProps) {
    const map = useMap();

    useEffect(() => {
        const handleEmotionClick = (e: LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(e)
            if (!props.emotions) return
            props.setEmotions([...props.emotions, { point: e.latlng, emotion: props.activeEmotion, uuid: v4() }])
            convertEmotionsToString(props.emotions)
        }

        const convertEmotionsToString = function (emotions: EmotionsProps[]) {
            let result = ""
            emotions.map((s) => {
                result = s.point.lat.toString() + " " + s.point.lng.toString() + " " + s.emotion + " " + s.uuid
            })
            props.onChange(result)
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
