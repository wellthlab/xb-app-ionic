import L, { LeafletMouseEvent, Map } from "leaflet"
import { useEffect, useState } from "react"
import LineSegment from "./Elements/LineSegment"
import React from "react"
import ClickListener from "./utils/ClickListener"
import { useMap } from "react-leaflet"

function LineEditor(props: LineProps) {

    const [currentPoint, setCurrentPoint] = useState<L.LatLngLiteral | null>()

    const map = useMap();
    useEffect(()=> {
        const handleMapClick = (e: LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(e)
            if (currentPoint != null) {
                props.setLines([...props.lines, [currentPoint, e.latlng]])
            }
            setCurrentPoint(e.latlng)
        }
        map.addEventListener("click", handleMapClick)

        return function cleanup() {
            map.removeEventListener("click")
        }
    })

    return (<>
        {props.lines?.map(([i, j]) =>
            <LineSegment start={i} end={j} colour={"lime"} key={i.lat} />)
        }</>
    )
}

type LineProps = {
    lines: [L.LatLngLiteral, L.LatLngLiteral][],
    setLines: React.Dispatch<React.SetStateAction<[L.LatLngLiteral, L.LatLngLiteral][]>>
}

export default LineEditor