import L from "leaflet"
import React, { useState, useEffect } from "react"
import Routes, { IPoints } from "../../../models/Route"
import Sticker from "./sticker"
import { Marker } from "react-leaflet";
import LineSegment from "./LineSegment"

function DrawRoute() {
    const [lines, setLines] = useState<IPoints[]>([])

    const startIcon = L.icon({
        iconUrl: `/assets/sticker/${Sticker.StartPoint}.svg`,
        iconSize: [32, 32],
    })
    const endIcon = L.icon({
        iconUrl: `/assets/sticker/${Sticker.Stop}.svg`,
        iconSize: [32, 32],
    })

    useEffect(() => {
        getTodayRoute()
    }, []
    )

    const getTodayRoute = async function () {
        const raw = await Routes.getRoutes();
        setLines(raw[0].route)
    }

    return (lines.length > 1 ?
        <><Marker position={lines[0]} icon={startIcon} />
            <Marker position={lines.slice(-1)[0]} icon={endIcon} />
            {lines.slice(0, -1).map((i, j) => <LineSegment start={i} end={lines[j + 1]} colour={"black"} key={i.lat} />)}</>
        : <></>
    )
}

export default DrawRoute