import React, { useState } from "react"
import LineEditor from "./Map/LineEditor"
import Map from "./Map/Map"
import { Stack, Typography } from "@mui/joy"

interface RouteDrawerProps {
    title: string

}

const RouteDrawer = function(props: RouteDrawerProps) {
    const [lines, setLines] = useState<[L.LatLngLiteral, L.LatLngLiteral][]>([])
    
    return(<Stack spacing={1}>
        <Typography textAlign="center" level="h1" component="p">
                {props.title}
            </Typography>
        <Map>
        <LineEditor lines={lines} setLines={setLines} />
    </Map></Stack>)
}

export default RouteDrawer