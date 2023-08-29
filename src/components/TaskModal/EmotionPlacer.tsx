import React, { useEffect, useState } from "react";
import { Button, FormControlProps, IconButton, Stack, Typography } from "@mui/joy";
import Map from "./Map/Map";
import Emotion, { getStringValueFromEmotion } from "./Map/emotion";
import EmotionEditor, { EmotionsProps } from "./Map/EmotionEditor";
import DrawRoute from "./Map/DrawRoute";
import { Grid, Paper } from "@mui/material";
import UndoIcon from '@mui/icons-material/Undo';
import CircleIcon from '@mui/icons-material/Circle';
import { LatLngLiteral } from "leaflet";
import DeleteIcon from '@mui/icons-material/Delete';

interface EmotionPlacerProps extends Omit<FormControlProps, 'onChange'> {
    label: string
    value: string
    onChange: (sticker: string) => void
    points: LatLngLiteral[]
}

const EmotionPlacer = function (props: EmotionPlacerProps) {

    const emotionSet: Emotion[] = []
    Object.values(Emotion).forEach(s => {
        emotionSet.push(s)
    });

    const [emotionList, setEmotionList] = useState<EmotionsProps[]>([])
    const [activeEmotion, setActiveEmotion] = useState<Emotion>(emotionSet[0])

    const removeLastPoint = function () {
        setEmotionList(emotionList.slice(0, -1))
    }

    //Format of payload: emotion-colour:lat:lng,
    const convertEmotionsToString = function () {
        let result = ""
        emotionList.map((s) => {
            result += s.emotion.valueOf() + ":" + s.point.lat.toString() + ":" + s.point.lng.toString() + ","
        })
        props.onChange(result)
    }

    const removeEmotions = function () {
        setEmotionList([])
    }

    useEffect(() =>
        convertEmotionsToString(),
        [emotionList])

    return (
        <Stack spacing={1}>
            <Typography>
                {props.label}
            </Typography>
            <Stack direction="row" spacing={1}>
                <Map>
                    <DrawRoute lines={props.points} />
                    <EmotionEditor emotionList={emotionList} setEmotionList={setEmotionList} activeEmotion={activeEmotion} />
                </Map>
                <Stack spacing={1}>
                    <CircleIcon sx={{ color: activeEmotion, width: "40px", height: "40px" }} />
                    <IconButton children={<UndoIcon />} onClick={removeLastPoint} />
                    <IconButton children={<DeleteIcon />} onClick={removeEmotions} />
                </Stack>
            </Stack>
            <Paper style={{ maxHeight: 150, overflow: 'auto' }}>
                <Grid container spacing={2}>
                    {emotionSet.map(e =>
                        <Grid item key={e}>
                            <Button sx={{
                                backgroundColor: "white", color: "black", borderColor: e.valueOf(), borderStyle: "solid", borderWidth: "5px", '&:hover': {
                                    opacity: 0.5, backgroundColor: "white"
                                }
                            }} onClick={() => setActiveEmotion(e)}>{getStringValueFromEmotion(e)}</Button>
                        </Grid>)}
                </Grid>
            </Paper>
            <img src={"emotion-wheel.png"}></img>
        </Stack>
    )
}

export default EmotionPlacer