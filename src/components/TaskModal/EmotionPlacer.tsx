import L from "leaflet";
import React, { useEffect, useState } from "react";
import LineSegment from "./Map/LineSegment";
import { FormControlProps, Stack, Typography } from "@mui/joy";
import Map from "./Map/Map";
import Routes, { IPoints } from "../../models/Route";
import { Marker } from "react-leaflet";
import Sticker from './Map/sticker'
import EmotionWheel from "./Map/EmotionWheel";
import Emotion from "./Map/emotion";
import EmotionEditor, { EmotionsProps } from "./Map/EmotionEditor";

interface EmotionPlacerProps extends Omit<FormControlProps, 'onChange'> {
    label: string
    value: string
    onChange: (sticker: string) => void;
}

const EmotionPlacer = function (props: EmotionPlacerProps) {

    const emotionList: Emotion[] = []
    Object.values(Emotion).forEach(s => {
        emotionList.push(s)
    });

    const [emotion, setEmotion] = useState(emotionList)

    const [emotionListA, setEmotionList] = useState<EmotionsProps[]>([])
    const [activeEmotion, setActiveEmotion] = useState<Emotion>(emotionList[0])
    const [lines, setLines] = useState<IPoints[]>([])
    const startIcon = L.icon({
        iconUrl: `/assets/sticker/${Sticker.StartPoint}.svg`,
        iconSize: [32, 32],
    })
    const endIcon = L.icon({
        iconUrl: `/assets/sticker/${Sticker.Stop}.svg`,
        iconSize: [32, 32],
    })

    useEffect(() => {
        getTodayRoute()
    }, []
    )

    const getTodayRoute = async function () {
        const raw = await Routes.getRoutes();
        setLines(raw[0].route)
    }

    const AddRoute = function () {
        if (lines.length > 1) {
            return (<><Marker position={lines[0]} icon={startIcon} />
                <Marker position={lines.slice(-1)[0]} icon={endIcon} />
                {lines?.slice(0, -1).map((i, j) =>
                    <LineSegment start={i} end={lines[j + 1]} colour={"black"} key={i.lat} />)}</>)
        } else {
            return (<></>)
        }
    }

    return (
        <Stack spacing={1}>
            <Typography>
                {props.label}
            </Typography>
            <Map>
                <EmotionEditor emotions={emotionListA} setEmotions={setEmotionList} activeEmotion={activeEmotion} onChange={props.onChange} />
                <AddRoute />
            </Map>
            <EmotionWheel data={emotionList} emotionList={emotion} setEmotionList={setEmotion} onEmotionClick={(e) => setActiveEmotion(e)} />
        </Stack>)
}

export default EmotionPlacer