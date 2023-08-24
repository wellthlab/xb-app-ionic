import React, { useState } from "react";
import { Button, FormControlProps, IconButton, Stack, Typography } from "@mui/joy";
import Map from "./Map/Map";
import Emotion, { getKeyFromValue } from "./Map/emotion";
import EmotionEditor, { EmotionsProps } from "./Map/EmotionEditor";
import DrawRoute from "./Map/DrawRoute";
import { Grid, Paper } from "@mui/material";
import UndoIcon from '@mui/icons-material/Undo';
import CircleIcon from '@mui/icons-material/Circle';

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

    const removeLastPoint = function() {
        setEmotionList(emotionList.slice(0, -1))
    }

    return (
        <Stack spacing={1}>
            <Typography>
                {props.label}
            </Typography>
            <Stack direction="row" spacing={1}>
            <Map>
                <EmotionEditor emotions={emotionList} setEmotions={setEmotionList} activeEmotion={activeEmotion} onChange={props.onChange} />
                <DrawRoute />
            </Map>
            <Stack spacing={1}>
            <CircleIcon sx={{color: activeEmotion, width: "40px", height: "40px"}}/>
            <IconButton children={<UndoIcon />} onClick={removeLastPoint} />
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
                            }} onClick={() => setActiveEmotion(e)}>{getKeyFromValue(e)}</Button>
                        </Grid>)}
                </Grid>
            </Paper>
            <img src={"emotion-wheel.png"}></img>
        </Stack>
    )
}

export default EmotionPlacer