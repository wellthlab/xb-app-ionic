import React, { Suspense, useState } from "react"
import LineEditor from "./Map/LineEditor"
import Map from "./Map/Map"
import { CircularProgress, Stack, Typography } from "@mui/joy"

interface RouteDrawerProps {
    label: string

}

const RouteDrawer = function (props: RouteDrawerProps) {
    const [lines, setLines] = useState<L.LatLngLiteral[]>([])

    return (<Suspense fallback={<CircularProgress />}>
        <Stack spacing={1}>
            <Typography textAlign="center" level="h3" component="p">
                {props.label}
            </Typography>
            <Map>
                <LineEditor lines={lines} setLines={setLines} />
            </Map>
        </Stack>
    </Suspense>)
}

export default RouteDrawer