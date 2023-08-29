import { LatLngLiteral, LeafletMouseEvent, } from 'leaflet'
import { v4 } from "uuid"
import React, { useEffect } from 'react'
import Emotion from './emotion'
import EmotionMarker from './EmotionMarker'
import { useMap } from 'react-leaflet'

export type EmotionsProps = {
    point: LatLngLiteral,
    emotion: Emotion,
    uuid: string
}

type EmotionEditorProps = {
    emotionList: EmotionsProps[],
    setEmotionList: React.Dispatch<React.SetStateAction<EmotionsProps[]>>,
    activeEmotion: Emotion
}

function EmotionEditor(props: EmotionEditorProps) {
    const map = useMap();

    const handleRemove = function (uuid: string) {
        if (!props.emotionList) return
        props.setEmotionList(props.emotionList.filter((e) => e.uuid != uuid))
    }

    useEffect(() => {

        const handleEmotionClick = (e: LeafletMouseEvent) => {
            if (!props.emotionList) return
            props.setEmotionList([...props.emotionList, { point: e.latlng, emotion: props.activeEmotion, uuid: v4() }])
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
    }, [map])

    return (<>
        {props.emotionList.map((e) => (
            <EmotionMarker key={e.uuid} emotionProps={e} onRemove={() => handleRemove(e.uuid)} />
        ))}
    </>)
}

export default EmotionEditor
