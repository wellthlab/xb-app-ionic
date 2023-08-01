import L, { LeafletMouseEvent } from "leaflet"
import { useState } from "react"
import ClickListener from "./utils/ClickListener"
import LineSegment from "./Elements/LineSegment"
import React from "react"

function LineEditor(props: LineProps) {

    const [currentPoint, setCurrentPoint] = useState<L.LatLngLiteral | null>()

    const handleMapClick = (e: LeafletMouseEvent) => {
        if (currentPoint != null) {
            L.DomEvent.stopPropagation(e)
            props.setLines([...props.lines, [currentPoint, e.latlng]])
        }
        setCurrentPoint(e.latlng)
    }

    return (<>
        {props.lines?.map(([i, j]) =>
            <LineSegment start={i} end={j} colour={"lime"} key={i.lat} />)
        }
        <ClickListener onMapClick={handleMapClick} /></>
    )
}

type LineProps = {
    lines: [L.LatLngLiteral, L.LatLngLiteral][],
    setLines: React.Dispatch<React.SetStateAction<[L.LatLngLiteral, L.LatLngLiteral][]>>,
}

export default LineEditor