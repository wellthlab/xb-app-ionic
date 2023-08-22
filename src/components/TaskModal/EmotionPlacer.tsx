import React, { useState } from "react";
import { Button, FormControlProps, Stack, Typography } from "@mui/joy";
import Map from "./Map/Map";
import Emotion, { getKeyFromValue } from "./Map/emotion";
import EmotionEditor, { EmotionsProps } from "./Map/EmotionEditor";
import DrawRoute from "./Map/DrawRoute";
import { Grid, Paper } from "@mui/material";

interface EmotionPlacerProps extends Omit<FormControlProps, 'onChange'> {
    label: string
    value: string
    onChange: (sticker: string) => void;
}

const EmotionPlacer = function (props: EmotionPlacerProps) {

    const emotionSet: Emotion[] = []
    Object.values(Emotion).forEach(s => {
        emotionSet.push(s)
    });

    const [emotionList, setEmotionList] = useState<EmotionsProps[]>([])
    const [activeEmotion, setActiveEmotion] = useState<Emotion>(emotionSet[0])

    return (
        <Stack spacing={1}>
            <Typography>
                {props.label}
            </Typography>
            <Map>
                <EmotionEditor emotions={emotionList} setEmotions={setEmotionList} activeEmotion={activeEmotion} onChange={props.onChange} />
                <DrawRoute />
            </Map>
            <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
                <Grid container spacing={2}>
                    {emotionSet.map(e =>
                        <Grid item key={e}>
                            <Button sx={{
                                backgroundColor: e.valueOf(), color: "black", '&:hover': {
                                    opacity: 0.5, backgroundColor: e.valueOf()
                                }
                            }} onClick={() => setActiveEmotion(e)}>{getKeyFromValue(e)}</Button>
                        </Grid>)}
                </Grid>
            </Paper>
            <img src={"emotion-wheel.png"}></img>
        </Stack>
    )
}

export default EmotionPlacer