import L, { LeafletMouseEvent, Map } from "leaflet"
import { useEffect, useState } from "react"
import LineSegment from "./LineSegment"
import React from "react"
import { useMap } from "react-leaflet"

function LineEditor(props: LineProps) {

    const map = useMap();

    useEffect(()=> {
        const handleMapClick = (e: LeafletMouseEvent) => {
            L.DomEvent.stopPropagation(e)
            props.setLines(props.lines.concat([e.latlng]))
        }
        map.addEventListener("click", handleMapClick)

        return function cleanup() {
            map.removeEventListener("click")
        }
    })

    const DisplayLines = function(){
        if (props.lines.length >=2) {
            return (<>{props.lines?.slice(0, -1).map((i,j) =>
                <LineSegment start={i} end={props.lines[j+1]} colour={"lime"} key={i.lat} />)}
                </>)
        } else {
            return(<></>)
        }
    }

    return (<DisplayLines/>
    )
}

type LineProps = {
    lines: L.LatLngLiteral[],
    setLines: React.Dispatch<React.SetStateAction<L.LatLngLiteral[]>>
}

export default LineEditor