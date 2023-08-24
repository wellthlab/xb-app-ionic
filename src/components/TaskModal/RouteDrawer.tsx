import React, { useState } from "react"
import LineEditor from "./Map/LineEditor"
import Map from "./Map/Map"
import { Button, FormControlProps, IconButton, Stack, Typography } from "@mui/joy"
import GoogleTimeline from "../foundation/GoogleTimeline"
import CreateIcon from '@mui/icons-material/Create';
import UndoIcon from '@mui/icons-material/Undo';
import DeleteIcon from '@mui/icons-material/Delete';
import { LatLngLiteral } from "leaflet"

interface RouteDrawerProps extends Omit<FormControlProps, 'onChange'> {
    label: string
    value: string
    onChange: (route: string) => void
}

const RouteDrawer = function (props: RouteDrawerProps) {
    const [lines, setLines] = useState<LatLngLiteral[]>([])

    const removeRoute = function () {
        setLines([])
    }

    const removeLastPoint = function () {
        lines.length == 2 ? removeRoute() : setLines(lines.slice(0, -1))
    }

    return (
        <Stack spacing={1}>
            <Typography>{props.label}</Typography>
                <Stack direction="row" spacing={1}>
                    <Map>
                        <LineEditor lines={lines} setLines={setLines} onChange={props.onChange} value={props.value}/>
                    </Map>
                    <Stack spacing={1}>
                        <IconButton children={<CreateIcon />} />
                        <IconButton children={<UndoIcon />} onClick={removeLastPoint} />
                        <IconButton children={<DeleteIcon />} onClick={removeRoute} />
                    </Stack>
                </Stack>
        </Stack>)
}

export default RouteDrawer