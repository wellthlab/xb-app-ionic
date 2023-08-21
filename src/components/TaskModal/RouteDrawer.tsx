import React, { Suspense, useState } from "react"
import LineEditor from "./Map/LineEditor"
import Map from "./Map/Map"
import { Button, CircularProgress, Stack, Typography } from "@mui/joy"
import Routes, { IPoints, pointType } from "../../models/Route"
import GoogleTimeline from "../foundation/GoogleTimeline"

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

    const removeRoute = function() {
        setLines([])
    }

    return (
        <Stack spacing={1}>
            <Typography>{props.label}</Typography>
            <Suspense fallback={<CircularProgress />}>
                <Map>
                    <LineEditor lines={lines} setLines={setLines} />
                </Map>
                <Stack direction="row" spacing={1}>
                <GoogleTimeline setLines={setLines}/>
                <Button onClick={removeRoute} fullWidth> Remove route </Button>
                <Button onClick={handleSubmitRoute} fullWidth> Save route</Button>
                </Stack>
            </Suspense>
        </Stack>)
}

export default RouteDrawer