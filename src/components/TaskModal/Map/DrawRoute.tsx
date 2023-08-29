import L, { LatLngLiteral } from "leaflet"
import React from "react"
import Sticker from "./sticker"
import { Marker, Polyline } from "react-leaflet";

type DrawLineProps = {
    lines: LatLngLiteral[]
}

function DrawRoute(props: DrawLineProps) {

    const startIcon = L.icon({
        iconUrl: `/assets/sticker/navigation/${Sticker.StartPoint}.svg`,
        iconSize: [32, 32],
    })
    const endIcon = L.icon({
        iconUrl: `/assets/sticker/navigation/${Sticker.Destination}.svg`,
        iconSize: [32, 32],
    })

    return (props.lines.length > 1 ?
        <>
            <Marker position={props.lines[0]} icon={startIcon} />
            <Marker position={props.lines.slice(-1)[0]} icon={endIcon} />
            {props.lines.slice(0, -1).map((latLng, i) =>
                <Polyline
                    positions={[latLng, props.lines[i + 1]]}
                    weight={5}
                    pathOptions={{ color: "black", fillColor: "black" }}
                />
            )}
        </>
        : <></>
    )
}

export default DrawRoute