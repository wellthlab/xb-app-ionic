import React, { useState } from "react"
import LineEditor from "./Map/LineEditor"
import Map from "./Map/Map"
import { Button, IconButton, Stack, Typography } from "@mui/joy"
import Routes, { IPoints, pointType } from "../../models/Route"
import GoogleTimeline from "../foundation/GoogleTimeline"
import CreateIcon from '@mui/icons-material/Create';
import UndoIcon from '@mui/icons-material/Undo';

interface RouteDrawerProps {
    label: string
}

const RouteDrawer = function (props: RouteDrawerProps) {
    const [lines, setLines] = useState<L.LatLngLiteral[]>([])

    const handleSubmitRoute = async function () {
        let points: IPoints[] = []
        points.push({ lat: lines[0].lat, lng: lines[0].lng, type: pointType.start })
        lines.slice(1, -1).map((l) => points.push({ lat: l.lat, lng: l.lng, type: pointType.point }))
        points.push({ lat: lines.slice(-1)[0].lat, lng: lines.slice(-1)[0].lng, type: pointType.end })
        await Routes.saveRoute({ route: points });
    };

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
                    <GoogleTimeline setLines={setLines} />
                    <Button onClick={removeRoute} fullWidth> Remove Route </Button>
                    <Button onClick={handleSubmitRoute} fullWidth> Save Route</Button>
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Map>
                        <LineEditor lines={lines} setLines={setLines} />
                    </Map>
                    <Stack spacing={1}>
                        <IconButton children={<CreateIcon />} />
                        <IconButton children={<UndoIcon />} onClick={removeLastPoint} />
                    </Stack>
                </Stack>
        </Stack>)
}

export default RouteDrawer