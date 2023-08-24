import L, { LatLngLiteral } from "leaflet"
import React, { useState, useEffect } from "react"
import Sticker from "./sticker"
import { Marker } from "react-leaflet";
import LineSegment from "./LineSegment"


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
        <><Marker position={props.lines[0]} icon={startIcon} />
            <Marker position={props.lines.slice(-1)[0]} icon={endIcon} />
            {props.lines.slice(0, -1).map((i, j) => <LineSegment start={i} end={props.lines[j + 1]} colour={"black"} key={i.lat} />)}</>
        : <></>
    )
}

export default DrawRoute