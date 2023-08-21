import L, { LeafletMouseEvent } from "leaflet"
import LineSegment from "./LineSegment"
import React from "react"
import ClickListener from "./ClickListener"

function LineEditor(props: LineProps) {

    const handleMapClick = (e: LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e)
        props.setLines(props.lines.concat([e.latlng]))
    }

    return (<>
    {props.lines.length >= 2 ? props.lines?.slice(0, -1).map((i, j) => <LineSegment start={i} end={props.lines[j + 1]} colour={"black"} key={i.lat} />) : <></>}
        <ClickListener onMapClick={handleMapClick} />
    </>
    )
}

type LineProps = {
    lines: L.LatLngLiteral[],
    setLines: React.Dispatch<React.SetStateAction<L.LatLngLiteral[]>>
}

export default LineEditor