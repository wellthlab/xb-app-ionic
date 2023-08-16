import { useEffect } from 'react'
import L, { LatLngLiteral, LeafletMouseEvent, } from 'leaflet'
import { v4 } from "uuid"
import React from 'react'
import { Circle, useMap } from 'react-leaflet'
import Emotion from './emotion'


function EmotionEditor(props: EmotionEditorProps) {
    const map = useMap();

    useEffect(() => {
        const handleEmotionClick = (e: LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(e)
            props.setEmotions([...props.emotions, { point: e.latlng, emotion: props.activeEmotion, uuid: v4() }])
            convertEmotionsToString(props.emotions)
        }

        const convertEmotionsToString = function (emotions: EmotionsProps[]) {
            let result = ""
            emotions.map((s) => {
                result = s.point.lat.toString() + " " + s.point.lng.toString() + " " + getKeyFromValue(s.emotion) + " " + s.uuid
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

    const getKeyFromValue = function (e: Emotion) {
        return Object.keys(Emotion)[Object.values(Emotion).indexOf(e)]
    }

    return (
        <>
            {props.emotions.map((s) => (<Circle center={s.point} color={s.emotion.valueOf()} radius={30} />))}
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
