import L, { LeafletMouseEvent } from "leaflet"
import { useState } from "react"
import ClickListener from "./utils/ClickListener"
import LineSegment from "./Elements/LineSegment"
import React from "react"

function LineEditor() {

    const [lines, setLines] = useState<[L.LatLngLiteral, L.LatLngLiteral][]>([])
    const [currentPoint, setCurrentPoint] = useState<L.LatLngLiteral | null>()

    const handleMapClick = (e: LeafletMouseEvent) => {
        console.log(e)
        if (currentPoint != null) {
            L.DomEvent.stopPropagation(e)
            setLines([...lines, [currentPoint, e.latlng]])
        }
        setCurrentPoint(e.latlng)
    }

    return (<>
        {lines?.map(([i, j]) =>
            <LineSegment start={i} end={j} colour={"lime"} key={i.lat} />)
        }
        <ClickListener onMapClick={handleMapClick} /></>
    )
}

export default LineEditor