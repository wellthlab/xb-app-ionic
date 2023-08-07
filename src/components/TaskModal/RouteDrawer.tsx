import React, { Suspense, useState } from "react"
import LineEditor from "./Map/LineEditor"
import Map from "./Map/Map"
import { Button, CircularProgress, Stack, Typography } from "@mui/joy"
import Routes, { IPoints, pointType } from "../../models/Route"

interface RouteDrawerProps {
    label: string

}

const RouteDrawer = function (props: RouteDrawerProps) {
    const [lines, setLines] = useState<L.LatLngLiteral[]>([])

    const handleSubmitRoute = async function () {
        let points: IPoints[] = []
        points.push({lat: lines[0].lat, lng: lines[0].lng, type: pointType.start})
        lines.slice(1, -1).map((l) => points.push({lat: l.lat, lng: l.lng, type: pointType.point}))
        points.push({lat: lines.slice(-1)[0].lat, lng: lines.slice(-1)[0].lng, type: pointType.end})
        await Routes.saveRoute({route: points});
    };

    return (
        <Stack spacing={1}>
            <Typography textAlign="center" level="h3" component="p">
                {props.label}
            </Typography>
            <Suspense fallback={<CircularProgress />}>
            <Map>
                <LineEditor lines={lines} setLines={setLines} />
            </Map>
            <Button onClick={handleSubmitRoute}> Save new route</Button>
            </Suspense>
        </Stack>)
}

export default RouteDrawer