import { Search } from "@mui/icons-material"
import { TextField, IconButton, Stack, Button } from "@mui/joy"
import React, { useState } from "react"
import Emotion from "./emotion"
import { Grid } from "@mui/material"


function EmotionWheel(props: EmotionWheelProps) {

    const [state, setState] = useState({ text: "", list: props.data })

    const searchList = function () {
        if (!state.text) props.setEmotionList(props.data)
        props.setEmotionList(props.data.filter((i) => getKeyFromValue(i).toLowerCase().includes(state.text)))
    }

    const getKeyFromValue = function (e: Emotion) {
        return Object.keys(Emotion)[Object.values(Emotion).indexOf(e)]
    }

    return (
        <>
            <Stack direction="row" spacing={1}>
                <TextField onChange={(e) => setState({ text: e.target.value, list: state.list })} fullWidth={true} />
                <IconButton type="submit" onClick={searchList}>
                    <Search />
                </IconButton>
                </Stack>
                <Grid container spacing={2}>
                {props.emotionList.map(e => {
                    return (
                        <Grid item spacing={2} key={e}>
                            <Button sx={{
                                backgroundColor: e.valueOf(), color: "black", '&:hover': {
                                    opacity: 0.5, backgroundColor: e.valueOf()
                                }
                            }} onClick={() => props.onEmotionClick(e)}>{getKeyFromValue(e)}</Button>
                        </Grid>
                    )
                })}
            </Grid>
            <img src={"emotion-wheel.png"}></img>
        </>
    )
}

type EmotionWheelProps = {
    data: Emotion[],
    emotionList: Emotion[],
    setEmotionList: React.Dispatch<React.SetStateAction<Emotion[]>>
    onEmotionClick: (e: Emotion) => void
}

export default EmotionWheel